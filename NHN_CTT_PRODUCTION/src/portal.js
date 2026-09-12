import {json, readJson, uid, ipHash} from "./utils.js";
import {getAuthUser, requirePermission} from "./auth.js";

function likeQuery(q){
  return `%${String(q||"").trim().replaceAll("%","\\%").replaceAll("_","\\_")}%`;
}

async function audit(env,request,user,action,entityType="",entityId="",details={}){
  try{
    await env.DB.prepare("INSERT INTO audit_log(actor_user_id,actor_email,action,entity_type,entity_id,details_json,ip_hash) VALUES(?,?,?,?,?,?,?)")
      .bind(user?.id||null,user?.email||"",action,entityType,entityId,JSON.stringify(details),await ipHash(request)).run();
  }catch{}
}

async function publicPortal(env){
  const [ann,shortcuts,news,events,stats,incidents]=await Promise.all([
    env.DB.prepare(`SELECT id,title,body,severity,link,starts_at,ends_at
      FROM announcements WHERE enabled=1 AND audience='public'
      AND (starts_at IS NULL OR starts_at<=CURRENT_TIMESTAMP)
      AND (ends_at IS NULL OR ends_at>=CURRENT_TIMESTAMP)
      ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END, created_at DESC LIMIT 8`).all(),
    env.DB.prepare("SELECT id,title,description,icon,href FROM portal_shortcuts WHERE enabled=1 AND audience='public' ORDER BY sort_order,id LIMIT 12").all(),
    env.DB.prepare("SELECT id,title,slug,published_at FROM news WHERE status='published' ORDER BY COALESCE(published_at,created_at) DESC LIMIT 6").all(),
    env.DB.prepare("SELECT id,title,start_at,end_at,status FROM events ORDER BY COALESCE(start_at,created_at) DESC LIMIT 6").all(),
    env.DB.prepare(`SELECT
      (SELECT COUNT(*) FROM certificates WHERE status IN ('issued','active','Đã cấp')) AS certificates,
      (SELECT COUNT(*) FROM events) AS events,
      (SELECT COUNT(*) FROM news WHERE status='published') AS news,
      (SELECT COUNT(*) FROM people WHERE status='Đang hoạt động') AS active_people`).first(),
    env.DB.prepare("SELECT id,service_key,title,status,impact,message,started_at,resolved_at FROM service_incidents WHERE status!='resolved' ORDER BY started_at DESC LIMIT 10").all()
  ]);
  return json({
    version:"2.0",
    announcements:ann.results||[], shortcuts:shortcuts.results||[],
    recent_news:news.results||[], recent_events:events.results||[],
    stats:stats||{}, incidents:incidents.results||[]
  });
}

async function publicSearch(env,url){
  const q=String(url.searchParams.get("q")||"").trim();
  if(q.length<2) return json({items:[],query:q});
  const k=likeQuery(q);
  const [news,events,docs]=await Promise.all([
    env.DB.prepare("SELECT id,title,slug,substr(body,1,220) AS excerpt,'news' AS type FROM news WHERE status='published' AND (title LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\') ORDER BY COALESCE(published_at,created_at) DESC LIMIT 20").bind(k,k).all(),
    env.DB.prepare("SELECT id,title,status AS excerpt,'event' AS type FROM events WHERE title LIKE ? ESCAPE '\\' ORDER BY COALESCE(start_at,created_at) DESC LIMIT 20").bind(k).all(),
    env.DB.prepare("SELECT id,title,code AS excerpt,'document' AS type FROM documents WHERE visibility='public' AND (title LIKE ? ESCAPE '\\' OR code LIKE ? ESCAPE '\\') ORDER BY created_at DESC LIMIT 20").bind(k,k).all()
  ]);
  const items=[...(news.results||[]),...(events.results||[]),...(docs.results||[])].slice(0,40);
  return json({query:q,count:items.length,items});
}

async function status(env){
  const started=Date.now();
  let database=false,storage=false;
  try{ await env.DB.prepare("SELECT 1 AS ok").first(); database=true; }catch{}
  try{ if(env.FILES){ await env.FILES.head("__nhn_healthcheck__"); storage=true; } }catch{ storage=!!env.FILES; }
  const incidents=await env.DB.prepare("SELECT service_key,title,status,impact,message,started_at FROM service_incidents WHERE status!='resolved' ORDER BY started_at DESC LIMIT 10").all().catch(()=>({results:[]}));
  return json({
    ok:database&&storage,
    status:database&&storage?"operational":"degraded",
    services:{database:database?"operational":"degraded",storage:storage?"operational":"degraded",portal:"operational"},
    incidents:incidents.results||[], latency_ms:Date.now()-started, time:new Date().toISOString(), version:"2.0"
  },database&&storage?200:503);
}

async function adminOverview(env,user){
  const [counts,recentAudit,submissions,tickets,approvals,incidents]=await Promise.all([
    env.DB.prepare(`SELECT
      (SELECT COUNT(*) FROM users WHERE status='active') AS active_users,
      (SELECT COUNT(*) FROM people WHERE status='Đang hoạt động') AS active_people,
      (SELECT COUNT(*) FROM certificates) AS certificates,
      (SELECT COUNT(*) FROM events) AS events,
      (SELECT COUNT(*) FROM files) AS files`).first(),
    env.DB.prepare("SELECT actor_email,action,entity_type,entity_id,created_at FROM audit_log ORDER BY id DESC LIMIT 12").all(),
    env.DB.prepare("SELECT status,COUNT(*) AS count FROM submissions GROUP BY status ORDER BY count DESC").all(),
    env.DB.prepare("SELECT status,COUNT(*) AS count FROM tickets GROUP BY status ORDER BY count DESC").all().catch(()=>({results:[]})),
    env.DB.prepare("SELECT status,COUNT(*) AS count FROM approvals GROUP BY status ORDER BY count DESC").all().catch(()=>({results:[]})),
    env.DB.prepare("SELECT id,service_key,title,status,impact,message,started_at,resolved_at FROM service_incidents ORDER BY started_at DESC LIMIT 20").all()
  ]);
  return json({counts:counts||{},recent_audit:recentAudit.results||[],submissions:submissions.results||[],tickets:tickets.results||[],approvals:approvals.results||[],incidents:incidents.results||[]});
}

export async function portalRoute(request,env,url){
  const p=url.pathname;
  if(p==="/api/public/portal" && request.method==="GET") return publicPortal(env);
  if(p==="/api/public/search" && request.method==="GET") return publicSearch(env,url);
  if(p==="/api/status" && request.method==="GET") return status(env);

  if(!p.startsWith("/api/admin/portal")) return null;
  const user=await getAuthUser(request,env);
  if(!user) return json({error:"UNAUTHORIZED"},401);

  if(p==="/api/admin/portal/overview" && request.method==="GET"){
    const deny=requirePermission(user,"dashboard.view"); if(deny)return deny;
    return adminOverview(env,user);
  }

  if(p==="/api/admin/portal/announcements" && request.method==="GET"){
    const deny=requirePermission(user,"news.manage"); if(deny)return deny;
    const rs=await env.DB.prepare("SELECT * FROM announcements ORDER BY created_at DESC LIMIT 500").all();
    return json({items:rs.results||[]});
  }
  if(p==="/api/admin/portal/announcements" && request.method==="POST"){
    const deny=requirePermission(user,"news.manage"); if(deny)return deny;
    const b=await readJson(request)||{};
    if(!String(b.title||"").trim()||!String(b.body||"").trim()) return json({error:"INVALID_INPUT"},400);
    const id=uid("ann");
    await env.DB.prepare("INSERT INTO announcements(id,title,body,severity,audience,link,starts_at,ends_at,enabled,created_by) VALUES(?,?,?,?,?,?,?,?,?,?)")
      .bind(id,String(b.title).trim(),String(b.body).trim(),b.severity||"info",b.audience||"public",b.link||null,b.starts_at||null,b.ends_at||null,b.enabled===false?0:1,user.id).run();
    await audit(env,request,user,"Tạo thông báo cổng thông tin","announcement",id,{title:b.title});
    return json({ok:true,id},201);
  }
  const am=p.match(/^\/api\/admin\/portal\/announcements\/([^/]+)$/);
  if(am && request.method==="PATCH"){
    const deny=requirePermission(user,"news.manage"); if(deny)return deny;
    const id=decodeURIComponent(am[1]),b=await readJson(request)||{};
    const cur=await env.DB.prepare("SELECT * FROM announcements WHERE id=?").bind(id).first();
    if(!cur)return json({error:"NOT_FOUND"},404);
    await env.DB.prepare("UPDATE announcements SET title=?,body=?,severity=?,audience=?,link=?,starts_at=?,ends_at=?,enabled=?,updated_at=CURRENT_TIMESTAMP WHERE id=?")
      .bind(b.title??cur.title,b.body??cur.body,b.severity??cur.severity,b.audience??cur.audience,b.link??cur.link,b.starts_at??cur.starts_at,b.ends_at??cur.ends_at,b.enabled===undefined?cur.enabled:(b.enabled?1:0),id).run();
    await audit(env,request,user,"Cập nhật thông báo cổng thông tin","announcement",id,{});
    return json({ok:true});
  }
  if(am && request.method==="DELETE"){
    const deny=requirePermission(user,"news.manage"); if(deny)return deny;
    const id=decodeURIComponent(am[1]);
    await env.DB.prepare("DELETE FROM announcements WHERE id=?").bind(id).run();
    await audit(env,request,user,"Xóa thông báo cổng thông tin","announcement",id,{});
    return json({ok:true});
  }
  return null;
}
