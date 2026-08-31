const app=document.getElementById("app");
const accountBtn=document.getElementById("accountBtn");
const modalEl=document.getElementById("modal");
const modalBody=document.getElementById("modalBody");
const toastEl=document.getElementById("toast");

let state={config:null,user:null};

const E=s=>String(s??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

async function api(url,o={}){
  const opt={credentials:"include",...o};

  if(o.body && !(o.body instanceof FormData)){
    opt.headers={"content-type":"application/json",...(o.headers||{})};
    opt.body=JSON.stringify(o.body);
  }

  const r=await fetch(url,opt);
  const d=await r.json().catch(()=>({}));

  if(!r.ok) throw new Error(d.error||"REQUEST_FAILED");
  return d;
}

function toast(t){
  if(!toastEl){alert(t);return}
  toastEl.textContent=t;
  toastEl.classList.add("show");
  setTimeout(()=>toastEl.classList.remove("show"),2500);
}

function modal(html){
  modalBody.innerHTML=html;
  modalEl.classList.remove("hidden");
}

window.closeModal=()=>modalEl.classList.add("hidden");

window.copyText=async text=>{
  try{
    await navigator.clipboard.writeText(String(text??""));
    toast("Đã sao chép");
  }catch{
    const ta=document.createElement("textarea");
    ta.value=String(text??"");
    ta.style.position="fixed";
    ta.style.opacity="0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Đã sao chép");
  }
};

modalEl.onclick=e=>{
  if(e.target===modalEl) closeModal();
};

function fmt(v){
  if(v===null||v===undefined||v==="") return "—";
  return E(v);
}

function card(x){
  return `<article class="card">
    <span class="pill">NHÀ HÁN NGỮ</span>
    <h3>${E(x.title)}</h3>
    <p style="white-space:pre-line;line-height:1.7">${E(x.body||x.status||"")}</p>
  </article>`;
}

function table(headers,rows){
  return `<div style="overflow:auto">
    <table class="admin-table">
      <thead><tr>${headers.map(x=>`<th>${E(x)}</th>`).join("")}</tr></thead>
      <tbody>${rows.join("")}</tbody>
    </table>
  </div>`;
}

function actionBtn(text,fn,secondary=false){
  return `<button class="${secondary?"secondary":""}" onclick="${fn}" style="padding:7px 11px;margin:2px">${E(text)}</button>`;
}

/* =========================
   PUBLIC
========================= */

async function home(){
  const n=await api("/api/public/news").catch(()=>({items:[]}));

  app.innerHTML=`<section class="hero">
    <div>
      <div class="eyebrow">CỔNG THÔNG TIN NHÀ HÁN NGỮ</div>
      <h1>Kết nối tri thức.<br>Mở lối tương lai.</h1>
      <p>Một không gian số dành cho hoạt động, bảng tin, đăng ký tham gia và xác thực Giấy chứng nhận của Nhà Hán Ngữ.</p>
      <div class="actions">
        <a class="btn" href="#activities">Khám phá hoạt động</a>
        <a class="btn secondary" href="#lookup">Tra cứu GCN</a>
      </div>
    </div>
    <img src="/assets/nhn-logo.jpg" alt="Nhà Hán Ngữ">
  </section>

  <section class="section">
    <h2>Thông tin nổi bật</h2>
    <div class="grid">
      <div class="card"><h3>Hoạt động & Sự kiện</h3><p>Theo dõi chương trình và đăng ký tham gia.</p></div>
      <div class="card"><h3>Tra cứu GCN</h3><p>Xác thực giấy chứng nhận bằng mã phát hành.</p></div>
      <div class="card"><h3>Bảng tin</h3><p>Cập nhật thông báo và hoạt động cộng đồng.</p></div>
      <div class="card"><h3>Tham gia Nhà Hán Ngữ</h3><p>Đăng ký tham gia các hoạt động của Nhà Hán Ngữ.</p></div>
    </div>
  </section>

  <section class="section">
    <h2>Bảng tin mới</h2>
    <div class="grid">${n.items.slice(0,3).map(card).join("")||'<div class="card">Chưa có bản tin.</div>'}</div>
  </section>`;
}

async function activities(){
  const d=await api("/api/public/events").catch(()=>({items:[]}));

  app.innerHTML=`<section class="section">
    <h1>Hoạt động & Sự kiện</h1>
    <div class="grid">
      ${d.items.map(x=>`<article class="card">
        <span class="pill">${fmt(x.status)}</span>
        <h3>${fmt(x.title)}</h3>
        <p>${fmt(x.start_at)}</p>
      </article>`).join("")||'<div class="card">Chưa có hoạt động.</div>'}
    </div>
  </section>`;
}

async function news(){
  const d=await api("/api/public/news").catch(()=>({items:[]}));
  app.innerHTML=`<section class="section"><h1>Bảng tin Nhà Hán Ngữ</h1>
  <div class="grid">${d.items.map(card).join("")||'<div class="card">Chưa có bản tin.</div>'}</div></section>`;
}

function lookup(){
  const submissionStatusText=status=>({
    "Đã tiếp nhận":"Đã tiếp nhận",
    "Đang xem xét":"Đang xem xét",
    "Cần bổ sung":"Cần bổ sung thông tin",
    "Mời phỏng vấn":"Mời phỏng vấn",
    "Đang đánh giá":"Đang đánh giá",
    "Đã duyệt":"Đã duyệt",
    "Không phù hợp":"Không phù hợp",
    "Hoàn tất":"Hoàn tất"
  }[status]||status||"—");

  app.innerHTML=`<section class="form-wrap">
    <h1>Tra cứu & Xác thực</h1>
    <p class="muted">Tra cứu tình trạng hồ sơ hoặc xác thực GCN/GXN do Nhà Hán Ngữ phát hành.</p>
    <div class="grid">
      <div class="card">
        <h2>Xác thực GCN/GXN</h2>
        <p class="muted">Nhập mã được ghi trên Giấy chứng nhận hoặc Giấy xác nhận.</p>
        <form id="certLookup">
          <div class="field"><label>Mã GCN/GXN</label><input name="code" required autocomplete="off" placeholder="001/GCN-NHN/2026"></div>
          <button>Xác thực</button>
        </form>
        <div id="certResult"></div>
      </div>
      <div class="card">
        <h2>Tra cứu hồ sơ đăng ký</h2>
        <p class="muted">Nhập mã hồ sơ và email đã sử dụng khi đăng ký.</p>
        <form id="subLookup">
          <div class="field"><label>Mã hồ sơ</label><input name="code" required autocomplete="off"></div>
          <div class="field"><label>Email đã đăng ký</label><input name="email" type="email" required autocomplete="email"></div>
          <button>Tra cứu hồ sơ</button>
        </form>
        <div id="subResult"></div>
      </div>
    </div>
  </section>`;

  certLookup.onsubmit=async e=>{
    e.preventDefault();
    const form=e.target,f=new FormData(form),button=form.querySelector("button");
    button.disabled=true;button.textContent="Đang xác thực…";certResult.innerHTML="";
    try{
      const d=await api("/api/lookup/certificate?code="+encodeURIComponent(f.get("code")));
      const x=d.item||{};
      certResult.innerHTML=`<div class="notice good" style="margin-top:16px">
        <div class="small muted">MÃ GCN/GXN</div>
        <h2 style="margin:4px 0 8px">${fmt(x.code)}</h2>
        <p><span class="muted">Trạng thái</span><br><b>${fmt(x.status_text||x.status)}</b></p>
        <p><span class="muted">Loại văn bản</span><br><b>${fmt(x.type)}</b></p>
        <p><span class="muted">Người được cấp</span><br><b>${fmt(x.full_name)}</b></p>
        ${x.unit_name?`<p><span class="muted">Đơn vị ghi nhận</span><br><b>${fmt(x.unit_name)}</b></p>`:""}
        ${x.program?`<p><span class="muted">Chương trình / Hoạt động</span><br>${fmt(x.program)}</p>`:""}
        ${x.role?`<p><span class="muted">Vai trò / Tư cách tham gia</span><br>${fmt(x.role)}</p>`:""}
        ${x.content?`<p><span class="muted">Nội dung được ghi nhận</span><br>${fmt(x.content)}</p>`:""}
        <p><span class="muted">Ngày cấp</span><br>${fmt(x.issued_at)}</p>
      </div>`;
    }catch(err){
      certResult.innerHTML='<div class="notice bad" style="margin-top:16px">Không tìm thấy GCN/GXN tương ứng với mã đã nhập.</div>';
    }finally{
      button.disabled=false;button.textContent="Xác thực";
    }
  };

  subLookup.onsubmit=async e=>{
    e.preventDefault();
    const form=e.target,f=new FormData(form),button=form.querySelector("button");
    button.disabled=true;button.textContent="Đang tra cứu…";subResult.innerHTML="";
    try{
      const d=await api(`/api/lookup/submission?code=${encodeURIComponent(f.get("code"))}&email=${encodeURIComponent(f.get("email"))}`);
      const x=d.item||{};
      subResult.innerHTML=`<div class="notice good" style="margin-top:16px">
        <div class="small muted">MÃ HỒ SƠ</div>
        <h2 style="margin:4px 0 8px">${fmt(x.code)}</h2>
        ${x.full_name?`<p><span class="muted">Người đăng ký</span><br><b>${fmt(x.full_name)}</b></p>`:""}
        <p><span class="muted">Biểu mẫu</span><br><b>${fmt(x.form_name||x.form_id)}</b></p>
        <p><span class="muted">Trạng thái hồ sơ</span><br><b>${fmt(submissionStatusText(x.status))}</b></p>
        <p><span class="muted">Thời điểm tiếp nhận</span><br>${fmt(x.submitted_at)}</p>
        <p><span class="muted">Cập nhật gần nhất</span><br>${fmt(x.updated_at)}</p>
      </div>`;
    }catch(err){
      subResult.innerHTML='<div class="notice bad" style="margin-top:16px">Không tìm thấy hồ sơ khớp với mã và email đã nhập.</div>';
    }finally{
      button.disabled=false;button.textContent="Tra cứu hồ sơ";
    }
  };
}

async function participate(){
  const forms=state.config?.forms||[];

  app.innerHTML=`<section class="section">
    <h1>Tham gia Nhà Hán Ngữ</h1>
    <div class="grid">
      ${forms.map(f=>`<article class="card">
        <h3>${fmt(f.name)}</h3>
        <p>${fmt(f.description)}</p>
        <a class="btn" href="#form/${encodeURIComponent(f.id)}">Mở biểu mẫu</a>
      </article>`).join("")}
    </div>
  </section>`;
}

function field(f){
  if(f.type==="textarea")
    return `<div class="field"><label>${E(f.label)}</label><textarea name="${E(f.key)}" ${f.required?"required":""}></textarea></div>`;

  if(f.type==="select")
    return `<div class="field"><label>${E(f.label)}</label><select name="${E(f.key)}" ${f.required?"required":""}>
      <option value="">-- Chọn --</option>
      ${(f.options||[]).map(x=>`<option value="${E(x)}">${E(x)}</option>`).join("")}
    </select></div>`;

  if(f.type==="checkbox")
    return `<div class="field"><label><input type="checkbox" name="${E(f.key)}" ${f.required?"required":""}> ${E(f.label)}</label></div>`;

  return `<div class="field"><label>${E(f.label)}</label><input type="${f.type==="email"?"email":f.type==="date"?"date":"text"}" name="${E(f.key)}" ${f.required?"required":""}></div>`;
}

async function form(id){
  const d=await api("/api/forms/"+encodeURIComponent(id));
  const c=d.form.config;

  app.innerHTML=`<section class="form-wrap">
    <h1>${fmt(c.name)}</h1>
    <p>${fmt(c.description)}</p>
    <form id="dynamicForm">
      ${c.sections.map(s=>`<div class="card"><h2>${fmt(s.title)}</h2>${s.fields.map(field).join("")}</div>`).join("")}
      <button>Gửi hồ sơ</button>
    </form>
  </section>`;

  dynamicForm.onsubmit=async e=>{
    e.preventDefault();
    const fd=new FormData(e.target),answers={};
    for(const [k,v] of fd) answers[k]=v==="on"?true:v;

    try{
      const r=await api(`/api/forms/${encodeURIComponent(id)}/submit`,{method:"POST",body:{answers}});
      e.target.innerHTML=`<div class="notice good"><h2>Đã tiếp nhận</h2><p>Mã hồ sơ: <b>${fmt(r.code)}</b></p></div>`;
    }catch(err){alert(err.message)}
  };
}

/* =========================
   LOGIN
========================= */

function login(){
  modal(`<button onclick="closeModal()">Đóng</button>
  <h2>Đăng nhập Nhà Hán Ngữ</h2>
  <form id="loginForm">
    <div class="field"><label>Email</label><input name="email" type="email" required></div>
    <div class="field"><label>Mật khẩu</label><input name="password" type="password" required></div>
    <button>Đăng nhập</button>
  </form>`);

  loginForm.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);

    try{
      const d=await api("/api/auth/login",{
        method:"POST",
        body:{email:f.get("email"),password:f.get("password"),portal:"admin"}
      });

      state.user=d.user;
      closeModal();
      location.hash="admin/dashboard";
    }catch(err){alert(err.message)}
  };
}

accountBtn.onclick=()=>{
  if(state.user) location.hash="admin/dashboard";
  else login();
};

/* =========================
   ADMIN SHELL
========================= */

function adminNav(){
  return `<aside class="admin-nav">
    <a href="#admin/dashboard">Tổng quan</a>
    <a href="#admin/submissions">Hồ sơ đăng ký</a>
    <a href="#admin/users">Tài khoản & phân quyền</a>
    <a href="#admin/people">Nhân sự</a>
    <a href="#admin/forms">Biểu mẫu</a>
    <a href="#admin/news">Bảng tin</a>
    <a href="#admin/events">Sự kiện</a>
    <a href="#admin/classes">Lớp học</a>
    <a href="#admin/units">Đơn vị</a>
    <a href="#admin/documents">Văn bản</a>
    <a href="#admin/tasks">Công việc</a>
    <a href="#admin/certificates">GCN / GXN</a>
    <a href="#admin/approvals">Phê duyệt</a>
    <a href="#admin/tickets">Hỗ trợ</a>
    <a href="#admin/files">Tệp tin</a>
    <a href="#admin/audit">Nhật ký hệ thống</a>
    <a href="#admin/backups">Sao lưu</a>
  </aside>`;
}

function adminPage(title,body){
  app.innerHTML=`<section class="section admin-shell">
    <div class="admin-top">
      <div><div class="eyebrow">NHÀ HÁN NGỮ · QUẢN TRỊ</div><h1>${E(title)}</h1></div>
      <button id="logoutBtn" class="secondary">Đăng xuất</button>
    </div>
    <div class="admin-layout">
      ${adminNav()}
      <div class="admin-content">${body}</div>
    </div>
  </section>`;

  logoutBtn.onclick=logout;
}

async function logout(){
  try{await api("/api/auth/logout",{method:"POST"})}catch{}
  state.user=null;
  location.hash="home";
  location.reload();
}

/* =========================
   DASHBOARD
========================= */

async function dashboard(){
  const d=await api("/api/admin/dashboard");
  const c=d.counts||{};

  const stats=[
    ["Hồ sơ",c.submissions],
    ["Đang xử lý",c.pending],
    ["Nhân sự",c.people],
    ["GCN/GXN",c.certificates],
    ["Ticket mở",c.tickets],
    ["Chờ duyệt",c.approvals],
    ["Công việc",c.tasks]
  ];

  adminPage("Tổng quan",`
    <div class="grid">
      ${stats.map(([a,b])=>`<div class="card"><span class="pill">${E(a)}</span><h2 style="font-size:2rem">${Number(b||0)}</h2></div>`).join("")}
    </div>

    <div class="card" style="margin-top:20px">
      <h2>Thao tác nhanh</h2>
      <div class="actions">
        <button onclick="location.hash='admin/news'">Viết bản tin</button>
        <button onclick="location.hash='admin/certificates'">Cấp GCN/GXN</button>
        <button onclick="location.hash='admin/users'">Cấp tài khoản</button>
        <button onclick="location.hash='admin/events'">Tạo sự kiện</button>
      </div>
    </div>
  `);
}

/* =========================
   HỒ SƠ
========================= */

async function submissions(){
  const d=await api("/api/admin/submissions");

  adminPage("Hồ sơ đăng ký",`
    <div class="card">
      <div class="field"><label>Tìm hồ sơ</label><input id="searchSub" placeholder="Mã, họ tên hoặc email"></div>
      <button id="searchSubBtn">Tìm</button>
      <a class="btn secondary" href="/api/admin/export/submissions.csv" style="text-decoration:none">Xuất CSV</a>
    </div>

    <div id="subTable">
      ${renderSubmissions(d.items)}
    </div>
  `);

  searchSubBtn.onclick=async()=>{
    const r=await api("/api/admin/submissions?q="+encodeURIComponent(searchSub.value));
    subTable.innerHTML=renderSubmissions(r.items);
  };
}

function renderSubmissions(items){
  return table(
    ["Mã","Biểu mẫu","Họ tên","Email","Trạng thái","Điểm",""],
    (items||[]).map(x=>`<tr>
      <td>${fmt(x.code)}</td>
      <td>${fmt(x.form_id)}</td>
      <td>${fmt(x.full_name)}</td>
      <td>${fmt(x.email)}</td>
      <td>${fmt(x.status)}</td>
      <td>${fmt(x.score)}</td>
      <td><button onclick="openSubmission('${encodeURIComponent(x.code)}')">Xử lý</button></td>
    </tr>`)
  );
}

window.openSubmission=async code=>{
  code=decodeURIComponent(code);
  const d=await api("/api/admin/submissions/"+encodeURIComponent(code));
  const x=d.item;

  modal(`<button onclick="closeModal()">Đóng</button>
    <h2>Hồ sơ ${fmt(x.code)}</h2>
    <p><b>${fmt(x.full_name)}</b><br>${fmt(x.email)}</p>

    <form id="editSubForm">
      <div class="field">
        <label>Trạng thái</label>
        <select name="status">
          ${["Đã tiếp nhận","Cần bổ sung","Mời phỏng vấn","Đang đánh giá","Phù hợp","Không phù hợp","Đã lưu trữ"].map(s=>`<option ${x.status===s?"selected":""}>${s}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Phân công</label><input name="assigned_to" value="${E(x.assigned_to||"")}"></div>
      <div class="field"><label>Điểm</label><input name="score" type="number" value="${E(x.score||"")}"></div>
      <div class="field"><label>Ghi chú nội bộ</label><textarea name="internal_note">${E(x.internal_note||"")}</textarea></div>
      <button>Lưu xử lý</button>
      <button type="button" class="secondary" id="convertPerson">Tiếp nhận thành nhân sự</button>
    </form>

    <h3>Nội dung đăng ký</h3>
    ${table(["Trường","Nội dung"],Object.entries(x.answers||{}).map(([k,v])=>`<tr><td>${E(k)}</td><td>${E(typeof v==="object"?JSON.stringify(v):v)}</td></tr>`))}
  `);

  editSubForm.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    await api("/api/admin/submissions/"+encodeURIComponent(code),{
      method:"PATCH",
      body:Object.fromEntries(f)
    });
    closeModal();toast("Đã cập nhật hồ sơ");submissions();
  };

  convertPerson.onclick=async()=>{
    if(!confirm("Tiếp nhận hồ sơ này thành hồ sơ nhân sự?")) return;
    await api("/api/admin/submissions/"+encodeURIComponent(code)+"/convert-person",{method:"POST"});
    toast("Đã tiếp nhận thành nhân sự");
  };
};

/* =========================
   USERS
========================= */

async function users(){
  const d=await api("/api/admin/users");

  adminPage("Tài khoản & phân quyền",`
    <div class="card">
      <button id="createUserBtn">+ Cấp tài khoản</button>
    </div>

    ${table(["ID","Họ tên","Email","Trạng thái","Vai trò","2FA","Thao tác"],
      (d.items||[]).map(x=>`<tr>
        <td>${x.id}</td>
        <td>${fmt(x.full_name)}</td>
        <td>${fmt(x.email)}</td>
        <td>${fmt(x.status)}</td>
        <td>${E((x.roles||[]).map(r=>r.role_id).join(", ")||"—")}</td>
        <td>${x.totp_enabled?"Bật":"Tắt"}</td>
        <td>
          <button onclick="editUserRoles(${x.id},'${E(x.email)}','${encodeURIComponent(JSON.stringify(x.roles||[]))}')">Quyền</button>
          <button class="secondary" onclick="resetUserPassword(${x.id})">Reset MK</button>
          ${x.email.toLowerCase()!=="nhahanngu.vn@gmail.com"?`<button class="secondary" onclick="toggleUser(${x.id},'${x.status==="active"?"disabled":"active"}')">${x.status==="active"?"Khóa":"Mở"}</button>`:""}
        </td>
      </tr>`)
    )}
  `);

  createUserBtn.onclick=()=>{
    modal(`<button onclick="closeModal()">Đóng</button>
      <h2>Cấp tài khoản mới</h2>
      <p class="muted">Tạo tài khoản và nhận ngay thông tin đăng nhập để sao chép trên trình duyệt.</p>
      <form id="createUserForm">
        <div class="field"><label>Họ và tên</label><input name="full_name" required></div>
        <div class="field"><label>Email</label><input name="email" type="email" required></div>
        <div class="field"><label>Vai trò</label>
          <select name="role">
            <option value="member">Thành viên</option>
            <option value="club_staff">Nhân sự</option>
            <option value="club_secretary">Thư ký</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        <div class="field"><label>Phạm vi đơn vị (nếu có)</label><input name="scope_unit_code" placeholder="Để trống nếu áp dụng chung"></div>
        <button>Cấp tài khoản</button>
      </form>`);

    createUserForm.onsubmit=async e=>{
      e.preventDefault();
      const form=e.target,f=new FormData(form),button=form.querySelector("button");
      button.disabled=true;button.textContent="Đang cấp…";
      try{
        const email=String(f.get("email")||"").trim();
        const fullName=String(f.get("full_name")||"").trim();
        const role=String(f.get("role")||"").trim();
        const r=await api("/api/admin/users",{
          method:"POST",
          body:{
            full_name:fullName,
            email,
            roles:[role],
            scope_unit_code:String(f.get("scope_unit_code")||"").trim()
          }
        });
        const password=r.temp_password||"";
        const info=`Họ và tên: ${fullName}\nEmail: ${email}\nMật khẩu tạm: ${password}`;
        modal(`<button onclick="closeModal()">Đóng</button>
          <h2>Đã cấp tài khoản</h2>
          <div class="notice good">Tài khoản đã được tạo. Mật khẩu tạm chỉ nên được gửi cho đúng người sử dụng.</div>
          <div class="card" style="margin-top:12px">
            <p><b>Họ và tên</b><br>${E(fullName)}</p>
            <p><b>Email</b><br><code>${E(email)}</code> <button type="button" class="secondary" onclick='copyText(${JSON.stringify(email)})'>Sao chép</button></p>
            <p><b>Mật khẩu tạm</b><br><code>${E(password)}</code> <button type="button" class="secondary" onclick='copyText(${JSON.stringify(password)})'>Sao chép</button></p>
            <button type="button" onclick='copyText(${JSON.stringify(info)})'>Sao chép toàn bộ thông tin</button>
          </div>`);
        users();
      }catch(err){
        alert(err.message);
        button.disabled=false;button.textContent="Cấp tài khoản";
      }
    };
  };
}

window.editUserRoles=(id,email,encoded)=>{
  const roles=JSON.parse(decodeURIComponent(encoded));
  const current=roles.map(r=>r.role_id).join(",");

  modal(`<button onclick="closeModal()">Đóng</button>
    <h2>Phân quyền</h2>
    <p>${E(email)}</p>
    <form id="roleForm">
      <div class="field">
        <label>Role ID (nhiều quyền cách nhau bằng dấu phẩy)</label>
        <input name="roles" value="${E(current)}">
      </div>
      <button>Lưu quyền</button>
    </form>`);

  roleForm.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const rs=String(f.get("roles")||"").split(",").map(x=>x.trim()).filter(Boolean);
    await api(`/api/admin/users/${id}/roles`,{method:"PUT",body:{roles:rs}});
    closeModal();toast("Đã cập nhật quyền");users();
  };
};

window.resetUserPassword=async id=>{
  if(!confirm("Đặt lại mật khẩu tài khoản này?")) return;
  try{
    const r=await api(`/api/admin/users/${id}/reset-password`,{method:"POST"});
    const password=r.temp_password||"";
    modal(`<button onclick="closeModal()">Đóng</button>
      <h2>Đã đặt lại mật khẩu</h2>
      <div class="notice good">Mật khẩu tạm mới đã được tạo.</div>
      <div class="card" style="margin-top:12px">
        <p><b>Mật khẩu tạm</b></p>
        <p><code>${E(password)}</code></p>
        <button type="button" onclick='copyText(${JSON.stringify(password)})'>Sao chép mật khẩu</button>
      </div>`);
  }catch(err){alert(err.message)}
};

window.toggleUser=async(id,status)=>{
  await api(`/api/admin/users/${id}/status`,{method:"PATCH",body:{status}});
  toast("Đã cập nhật tài khoản");users();
};

/* =========================
   GENERIC CRUD
========================= */

const CRUD={
  news:{
    title:"Bảng tin",
    fields:[
      ["title","Tiêu đề","text"],
      ["slug","Slug","text"],
      ["body","Nội dung","textarea"],
      ["status","Trạng thái","select",["draft","published","archived"]],
      ["published_at","Ngày đăng","datetime-local"],
      ["tags_json","Tags JSON","text"]
    ],
    cols:[["Tiêu đề","title"],["Trạng thái","status"],["Ngày đăng","published_at"]]
  },

  events:{
    title:"Sự kiện",
    fields:[
      ["title","Tên sự kiện","text"],
      ["start_at","Bắt đầu","datetime-local"],
      ["end_at","Kết thúc","datetime-local"],
      ["status","Trạng thái","select",["Sắp diễn ra","Đang diễn ra","Đã kết thúc","Đã hủy"]],
      ["capacity","Sức chứa","number"]
    ],
    cols:[["Tên","title"],["Bắt đầu","start_at"],["Kết thúc","end_at"],["Trạng thái","status"]]
  },

  classes:{
    title:"Lớp học",
    fields:[
      ["title","Tên lớp","text"],
      ["level","Cấp độ","text"],
      ["status","Trạng thái","select",["Đang mở đăng ký","Đang học","Đã kết thúc","Tạm dừng"]],
      ["capacity","Sức chứa","number"],
      ["schedule_json","Lịch học JSON","textarea"]
    ],
    cols:[["Tên lớp","title"],["Cấp độ","level"],["Trạng thái","status"],["Sức chứa","capacity"]]
  },

  units:{
    title:"Đơn vị",
    idField:"code",
    fields:[
      ["code","Mã đơn vị","text"],
      ["name","Tên đơn vị","text"],
      ["unit_type","Loại đơn vị","text"],
      ["manager_name","Người phụ trách","text"],
      ["email","Email","email"],
      ["status","Trạng thái","select",["Đang hoạt động","Tạm dừng","Đã giải thể"]]
    ],
    cols:[["Mã","code"],["Tên","name"],["Loại","unit_type"],["Quản lý","manager_name"],["Trạng thái","status"]]
  },

  documents:{
    title:"Văn bản",
    fields:[
      ["code","Số/Ký hiệu","text"],
      ["doc_type","Loại văn bản","text"],
      ["title","Trích yếu / Tiêu đề","text"],
      ["visibility","Phạm vi","select",["internal","public"]],
      ["status","Trạng thái","select",["Có hiệu lực","Hết hiệu lực","Dự thảo"]],
      ["file_id","File ID","text"],
      ["issued_at","Ngày ban hành","date"]
    ],
    cols:[["Số/Ký hiệu","code"],["Tiêu đề","title"],["Loại","doc_type"],["Trạng thái","status"]]
  },

  tasks:{
    title:"Công việc",
    fields:[
      ["title","Tên công việc","text"],
      ["description","Mô tả","textarea"],
      ["assigned_to","Người phụ trách","text"],
      ["unit_code","Đơn vị","text"],
      ["status","Trạng thái","select",["Cần làm","Đang thực hiện","Hoàn thành","Đã hủy"]],
      ["priority","Ưu tiên","select",["Thấp","Bình thường","Cao","Khẩn cấp"]],
      ["due_at","Hạn hoàn thành","datetime-local"]
    ],
    cols:[["Công việc","title"],["Phụ trách","assigned_to"],["Ưu tiên","priority"],["Trạng thái","status"],["Hạn","due_at"]]
  }
};

function inputField(def,value=""){
  const [key,label,type,options]=def;

  if(type==="textarea")
    return `<div class="field"><label>${E(label)}</label><textarea name="${E(key)}" style="min-height:${key==="body"?"240px":"140px"};line-height:1.6" ${key==="body"?'placeholder="Mỗi ý có thể xuống dòng riêng để bản tin hiển thị rõ ràng, ngăn nắp."':""}>${E(value||"")}</textarea></div>`;

  if(type==="select")
    return `<div class="field"><label>${E(label)}</label><select name="${E(key)}">
      ${(options||[]).map(x=>`<option value="${E(x)}" ${String(value)===String(x)?"selected":""}>${E(x)}</option>`).join("")}
    </select></div>`;

  return `<div class="field"><label>${E(label)}</label><input type="${type}" name="${E(key)}" value="${E(value||"")}"></div>`;
}

async function crudPage(type){
  const cfg=CRUD[type];
  const d=await api("/api/admin/content/"+type);

  adminPage(cfg.title,`
    <div class="card"><button onclick="openCrud('${type}')">+ Tạo mới</button></div>

    ${table(
      [...cfg.cols.map(x=>x[0]),"Thao tác"],
      (d.items||[]).map(x=>{
        const id=x[cfg.idField||"id"];
        return `<tr>
          ${cfg.cols.map(c=>`<td>${fmt(x[c[1]])}</td>`).join("")}
          <td>
            <button onclick='openCrud("${type}","${encodeURIComponent(String(id))}")'>Sửa</button>
            <button class="secondary" onclick='deleteCrud("${type}","${encodeURIComponent(String(id))}")'>Xóa</button>
          </td>
        </tr>`;
      })
    )}
  `);
}

window.openCrud=async(type,id="")=>{
  const cfg=CRUD[type];
  let item={};

  if(id){
    id=decodeURIComponent(id);
    const d=await api("/api/admin/content/"+type);
    item=(d.items||[]).find(x=>String(x[cfg.idField||"id"])===String(id))||{};
  }

  modal(`<button onclick="closeModal()">Đóng</button>
    <h2>${id?"Sửa":"Tạo"} ${E(cfg.title)}</h2>
    <form id="crudForm">
      ${cfg.fields.map(f=>inputField(f,item[f[0]])).join("")}
      <button>${id?"Lưu thay đổi":"Tạo mới"}</button>
    </form>`);

  crudForm.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const body=Object.fromEntries(f);

    if(body.capacity!=="") body.capacity=Number(body.capacity);

    try{
      await api(
        id?`/api/admin/content/${type}/${encodeURIComponent(id)}`:`/api/admin/content/${type}`,
        {method:id?"PUT":"POST",body}
      );
      closeModal();toast(id?"Đã cập nhật":"Đã tạo mới");crudPage(type);
    }catch(err){alert(err.message)}
  };
};

window.deleteCrud=async(type,id)=>{
  if(!confirm("Xóa mục này?")) return;
  try{
    await api(`/api/admin/content/${type}/${encodeURIComponent(decodeURIComponent(id))}`,{method:"DELETE"});
    toast("Đã xóa");crudPage(type);
  }catch(err){alert(err.message)}
};

/* =========================
   PEOPLE
========================= */

async function people(){
  const d=await api("/api/admin/people");

  adminPage("Nhân sự",table(
    ["ID","Họ tên","Email","Điện thoại","Đơn vị","Vị trí","Trạng thái"],
    (d.items||[]).map(x=>`<tr>
      <td>${fmt(x.id)}</td>
      <td>${fmt(x.full_name)}</td>
      <td>${fmt(x.email)}</td>
      <td>${fmt(x.phone)}</td>
      <td>${fmt(x.unit_code)}</td>
      <td>${fmt(x.position)}</td>
      <td>${fmt(x.status)}</td>
    </tr>`)
  ));
}

/* =========================
   FORMS
========================= */

async function forms(){
  const d=await api("/api/admin/forms");

  adminPage("Biểu mẫu",`
    <div class="card"><button id="newFormBtn">+ Tạo biểu mẫu</button></div>

    ${table(["ID","Tên","Prefix","Đối tượng","Bật","Phiên bản",""],
      (d.items||[]).map(x=>`<tr>
        <td>${fmt(x.id)}</td>
        <td>${fmt(x.name)}</td>
        <td>${fmt(x.prefix)}</td>
        <td>${fmt(x.audience)}</td>
        <td>${x.enabled?"Có":"Không"}</td>
        <td>${fmt(x.version)}</td>
        <td><button onclick="editForm('${encodeURIComponent(x.id)}')">Sửa</button></td>
      </tr>`)
    )}
  `);

  newFormBtn.onclick=()=>formEditor();
}

function formEditor(item=null){
  modal(`<button onclick="closeModal()">Đóng</button>
    <h2>${item?"Sửa":"Tạo"} biểu mẫu</h2>
    <form id="adminFormEditor">
      ${!item?'<div class="field"><label>ID biểu mẫu</label><input name="id" placeholder="member-application"></div>':""}
      <div class="field"><label>Tên</label><input name="name" value="${E(item?.name||"")}" required></div>
      <div class="field"><label>Prefix mã hồ sơ</label><input name="prefix" value="${E(item?.prefix||"NHN")}" required></div>
      <div class="field"><label>Mô tả</label><textarea name="description">${E(item?.description||"")}</textarea></div>
      <div class="field"><label>Đối tượng</label><input name="audience" value="${E(item?.audience||"public")}"></div>
      <div class="field"><label>Tuổi tối thiểu</label><input name="min_age" type="number" value="${E(item?.min_age||"")}"></div>
      <div class="field"><label>Email nhận</label><input name="recipient_email" type="email" value="${E(item?.recipient_email||"nhahanngu.vn@gmail.com")}"></div>
      <div class="field"><label>Cấu hình JSON</label><textarea name="config" style="min-height:250px">${E(JSON.stringify(item?.config||{name:item?.name||"",description:item?.description||"",sections:[]},null,2))}</textarea></div>
      <button>Lưu biểu mẫu</button>
    </form>`);

  adminFormEditor.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    try{
      const body={
        id:f.get("id"),
        name:f.get("name"),
        prefix:f.get("prefix"),
        description:f.get("description"),
        audience:f.get("audience"),
        min_age:f.get("min_age")?Number(f.get("min_age")):null,
        recipient_email:f.get("recipient_email"),
        config:JSON.parse(f.get("config"))
      };

      await api(item?"/api/admin/forms/"+encodeURIComponent(item.id):"/api/admin/forms",{
        method:item?"PUT":"POST",body
      });

      closeModal();toast("Đã lưu biểu mẫu");forms();
    }catch(err){alert("Không thể lưu: "+err.message)}
  };
}

window.editForm=async id=>{
  id=decodeURIComponent(id);
  const d=await api("/api/admin/forms");
  const item=d.items.find(x=>x.id===id);
  if(item) formEditor(item);
};

/* =========================
   CERTIFICATES
========================= */

async function certificates(){
  const d=await api("/api/admin/certificates");

  adminPage("GCN / GXN",`
    <div class="card"><button id="newCertBtn">+ Đề nghị cấp GCN/GXN</button></div>

    ${table(["Mã","Họ tên","Email","Loại","Nội dung","Trạng thái","Thao tác"],
      (d.items||[]).map(x=>`<tr>
        <td>${fmt(x.code||x.id)}</td>
        <td>${fmt(x.full_name)}</td>
        <td>${fmt(x.email)}</td>
        <td>${fmt(x.cert_type)}</td>
        <td>${fmt(x.content)}</td>
        <td>${fmt(x.status)}</td>
        <td>
          ${x.status==="approved"?`<button onclick="certAction('${encodeURIComponent(x.id)}','issue')">Phát hành</button>`:""}
          ${x.status==="issued"?`<button class="secondary" onclick="certAction('${encodeURIComponent(x.id)}','revoke')">Thu hồi</button>`:""}
        </td>
      </tr>`)
    )}
  `);

  newCertBtn.onclick=()=>{
    modal(`<button onclick="closeModal()">Đóng</button>
      <h2>Đề nghị cấp GCN/GXN</h2>
      <p class="muted">Thông tin này sẽ được lưu để phê duyệt, phát hành và tra cứu GCN/GXN của Nhà Hán Ngữ.</p>
      <form id="certForm">
        <div class="field"><label>Họ và tên người được cấp</label><input name="full_name" required></div>
        <div class="field"><label>Email</label><input name="email" type="email"></div>
        <div class="field"><label>Loại</label>
          <select name="cert_type">
            <option>Giấy chứng nhận</option>
            <option>Giấy xác nhận</option>
          </select>
        </div>
        <div class="field"><label>Đơn vị ghi nhận</label><input name="unit_name" required placeholder="Ví dụ: Cộng đồng Nhà Hán Ngữ"></div>
        <div class="field"><label>Chương trình / Hoạt động</label><input name="program" placeholder="Tên chương trình, sự kiện, lớp học hoặc hoạt động"></div>
        <div class="field"><label>Vai trò / Tư cách tham gia</label><input name="role" placeholder="Ví dụ: Thành viên, Tình nguyện viên, Ban Tổ chức..."></div>
        <div class="field"><label>Nội dung ghi nhận</label><textarea name="content" required style="min-height:140px"></textarea></div>
        <button>Gửi đề nghị cấp</button>
      </form>`);

    certForm.onsubmit=async e=>{
      e.preventDefault();
      const form=e.target,f=new FormData(form),button=form.querySelector("button");
      button.disabled=true;button.textContent="Đang gửi…";
      try{
        await api("/api/admin/certificates",{
          method:"POST",
          body:{
            full_name:String(f.get("full_name")||"").trim(),
            email:String(f.get("email")||"").trim(),
            cert_type:String(f.get("cert_type")||"").trim(),
            content:String(f.get("content")||"").trim(),
            metadata:{
              unit_name:String(f.get("unit_name")||"").trim(),
              program:String(f.get("program")||"").trim(),
              role:String(f.get("role")||"").trim()
            }
          }
        });
        closeModal();
        toast("Đã tạo đề nghị và chuyển phê duyệt");
        certificates();
      }catch(err){
        alert(err.message);
        button.disabled=false;button.textContent="Gửi đề nghị cấp";
      }
    };
  };
}

window.certAction=async(id,action)=>{
  id=decodeURIComponent(id);

  if(!confirm(action==="issue"?"Phát hành GCN/GXN này?":"Thu hồi GCN/GXN này?")) return;

  try{
    const r=await api("/api/admin/certificates/"+encodeURIComponent(id),{
      method:"PATCH",body:{action}
    });

    alert(action==="issue"?"Đã phát hành.\nMã: "+r.code:"Đã thu hồi.");
    certificates();
  }catch(err){alert(err.message)}
};

/* =========================
   APPROVALS
========================= */

async function approvals(){
  const d=await api("/api/admin/approvals");

  adminPage("Phê duyệt",table(
    ["ID","Đối tượng","Hành động","Người yêu cầu","Trạng thái","Ghi chú","Thao tác"],
    (d.items||[]).map(x=>`<tr>
      <td>${fmt(x.id)}</td>
      <td>${fmt(x.entity_type)} / ${fmt(x.entity_id)}</td>
      <td>${fmt(x.action)}</td>
      <td>${fmt(x.requester)}</td>
      <td>${fmt(x.status)}</td>
      <td>${fmt(x.note)}</td>
      <td>
        ${x.status==="pending"?`
          <button onclick="decideApproval('${encodeURIComponent(x.id)}','approved')">Duyệt</button>
          <button class="secondary" onclick="decideApproval('${encodeURIComponent(x.id)}','rejected')">Từ chối</button>
          <button class="secondary" onclick="decideApproval('${encodeURIComponent(x.id)}','needs_more_info')">Bổ sung</button>
        `:""}
      </td>
    </tr>`)
  ));
}

window.decideApproval=async(id,status)=>{
  const note=prompt("Ghi chú quyết định:")||"";

  try{
    await api("/api/admin/approvals/"+encodeURIComponent(decodeURIComponent(id)),{
      method:"PATCH",body:{status,note}
    });
    toast("Đã xử lý phê duyệt");approvals();
  }catch(err){alert(err.message)}
};

/* =========================
   TICKETS
========================= */

async function tickets(){
  const d=await api("/api/admin/tickets");

  adminPage("Hỗ trợ",table(
    ["Mã","Chủ đề","Người gửi","Ưu tiên","Trạng thái",""],
    (d.items||[]).map(x=>`<tr>
      <td>${fmt(x.code||x.id)}</td>
      <td>${fmt(x.subject)}</td>
      <td>${fmt(x.submitter_name)}</td>
      <td>${fmt(x.priority)}</td>
      <td>${fmt(x.status)}</td>
      <td><button onclick="editTicket('${encodeURIComponent(x.id)}')">Xử lý</button></td>
    </tr>`)
  ));
}

window.editTicket=id=>{
  id=decodeURIComponent(id);

  modal(`<button onclick="closeModal()">Đóng</button>
    <h2>Xử lý yêu cầu hỗ trợ</h2>
    <form id="ticketForm">
      <div class="field"><label>Ưu tiên</label><select name="priority"><option>Thấp</option><option>Bình thường</option><option>Cao</option><option>Khẩn cấp</option></select></div>
      <div class="field"><label>Trạng thái</label><select name="status"><option>Đang xử lý</option><option>Đã giải quyết</option><option>Đã đóng</option></select></div>
      <div class="field"><label>Phân công</label><input name="assigned_to"></div>
      <div class="field"><label>Phản hồi</label><textarea name="message"></textarea></div>
      <button>Lưu</button>
    </form>`);

  ticketForm.onsubmit=async e=>{
    e.preventDefault();
    await api("/api/admin/tickets/"+encodeURIComponent(id),{
      method:"PATCH",body:Object.fromEntries(new FormData(e.target))
    });
    closeModal();toast("Đã xử lý yêu cầu");tickets();
  };
};

/* =========================
   FILES
========================= */

async function filesPage(){
  const d=await api("/api/admin/files");

  adminPage("Tệp tin",`
    <div class="card">
      <h2>Tải tệp lên</h2>
      <form id="uploadForm">
        <div class="field"><input name="file" type="file" required></div>
        <div class="field"><label><input type="checkbox" name="public"> Công khai</label></div>
        <button>Tải lên</button>
      </form>
    </div>

    ${table(["Tên","Loại","Dung lượng","Quyền xem","Ngày tải",""],
      (d.items||[]).map(x=>`<tr>
        <td><a href="/api/files/${encodeURIComponent(x.id)}" target="_blank">${fmt(x.filename)}</a></td>
        <td>${fmt(x.mime)}</td>
        <td>${fmt(x.size)}</td>
        <td>${fmt(x.visibility)}</td>
        <td>${fmt(x.created_at)}</td>
        <td><button class="secondary" onclick="deleteFile('${encodeURIComponent(x.id)}')">Xóa</button></td>
      </tr>`)
    )}
  `);

  uploadForm.onsubmit=async e=>{
    e.preventDefault();
    const f=new FormData(e.target);
    const fd=new FormData();
    fd.append("file",f.get("file"));
    fd.append("visibility",f.get("public")?"public":"private");

    try{
      await api("/api/admin/upload",{method:"POST",body:fd});
      toast("Đã tải tệp lên");filesPage();
    }catch(err){alert(err.message)}
  };
}

window.deleteFile=async id=>{
  if(!confirm("Xóa tệp này?")) return;
  await api("/api/admin/files/"+encodeURIComponent(decodeURIComponent(id)),{method:"DELETE"});
  toast("Đã xóa tệp");filesPage();
};

/* =========================
   AUDIT
========================= */

async function auditPage(){
  const d=await api("/api/admin/audit");

  adminPage("Nhật ký hệ thống",table(
    ["Tài khoản","Hành động","Đối tượng","ID","Thời gian"],
    (d.items||[]).map(x=>`<tr>
      <td>${fmt(x.actor_email)}</td>
      <td>${fmt(x.action)}</td>
      <td>${fmt(x.entity_type)}</td>
      <td>${fmt(x.entity_id)}</td>
      <td>${fmt(x.created_at)}</td>
    </tr>`)
  ));
}

/* =========================
   BACKUP
========================= */

async function backups(){
  const d=await api("/api/admin/backups");

  adminPage("Sao lưu dữ liệu",`
    <div class="card"><button id="backupNow">+ Tạo bản sao ngay</button></div>

    ${table(["ID","R2 key","Dung lượng","Ngày tạo",""],
      (d.items||[]).map(x=>`<tr>
        <td>${fmt(x.id)}</td>
        <td>${fmt(x.r2_key)}</td>
        <td>${fmt(x.size)}</td>
        <td>${fmt(x.created_at)}</td>
        <td><button class="secondary" onclick="restoreBackup('${encodeURIComponent(x.id)}')">Phục hồi</button></td>
      </tr>`)
    )}
  `);

  backupNow.onclick=async()=>{
    try{
      await api("/api/admin/backup",{method:"POST"});
      toast("Đã tạo bản sao");backups();
    }catch(err){alert(err.message)}
  };
}

window.restoreBackup=async id=>{
  if(!confirm("CẢNH BÁO: Phục hồi sẽ thay dữ liệu hiện tại bằng bản sao này. Tiếp tục?")) return;
  if(!confirm("Xác nhận lần cuối: PHỤC HỒI DỮ LIỆU?")) return;

  try{
    await api(`/api/admin/backups/${encodeURIComponent(decodeURIComponent(id))}/restore`,{method:"POST"});
    alert("Đã phục hồi dữ liệu.");
    location.reload();
  }catch(err){alert(err.message)}
};

/* =========================
   ADMIN ROUTER
========================= */

async function adminRoute(h){
  const me=await api("/api/auth/me").catch(()=>({user:null}));
  state.user=me.user;

  if(!state.user){
    login();
    return;
  }

  accountBtn.textContent=state.user.full_name||state.user.email||"Tài khoản";

  try{
    if(h==="admin/dashboard") return dashboard();
    if(h==="admin/submissions") return submissions();
    if(h==="admin/users") return users();
    if(h==="admin/people") return people();
    if(h==="admin/forms") return forms();

    if(h==="admin/news") return crudPage("news");
    if(h==="admin/events") return crudPage("events");
    if(h==="admin/classes") return crudPage("classes");
    if(h==="admin/units") return crudPage("units");
    if(h==="admin/documents") return crudPage("documents");
    if(h==="admin/tasks") return crudPage("tasks");

    if(h==="admin/certificates") return certificates();
    if(h==="admin/approvals") return approvals();
    if(h==="admin/tickets") return tickets();
    if(h==="admin/files") return filesPage();
    if(h==="admin/audit") return auditPage();
    if(h==="admin/backups") return backups();

    return dashboard();

  }catch(err){
    adminPage("Không thể tải dữ liệu",`
      <div class="notice bad">
        <b>${E(err.message)}</b>
        <p>Module này có thể chưa được cấp quyền cho tài khoản hiện tại.</p>
      </div>
    `);
  }
}

/* =========================
   ROUTER
========================= */

async function route(){
  const h=location.hash.slice(1)||"home";

  try{
    if(h==="home") return home();
    if(h==="activities") return activities();
    if(h==="news") return news();
    if(h==="lookup") return lookup();
    if(h==="participate") return participate();

    if(h.startsWith("form/"))
      return form(decodeURIComponent(h.slice(5)));

    if(h.startsWith("admin/"))
      return adminRoute(h);

    return home();

  }catch(err){
    app.innerHTML=`<section class="section">
      <div class="notice bad">
        <h2>Không thể tải trang</h2>
        <p>${E(err.message)}</p>
      </div>
    </section>`;
  }
}

/* =========================
   INIT
========================= */

async function init(){
  state.config=await api("/api/config").catch(()=>({forms:[]}));

  const me=await api("/api/auth/me").catch(()=>({user:null}));
  state.user=me.user||null;

  if(state.user)
    accountBtn.textContent=state.user.full_name||state.user.email||"Tài khoản";

  route();
}

window.addEventListener("hashchange",route);
init();
