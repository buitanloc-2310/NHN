const app=document.getElementById("app"),
accountBtn=document.getElementById("accountBtn"),
modalEl=document.getElementById("modal"),
modalBody=document.getElementById("modalBody");

let state={config:null,user:null};

const E=s=>String(s??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;",
  "<":"&lt;",
  ">":"&gt;",
  '"':"&quot;",
  "'":"&#39;"
}[c]));

async function api(url,o={}){
  let opt={credentials:"include",...o};

  if(o.body&&!(o.body instanceof FormData)){
    opt.headers={
      "content-type":"application/json",
      ...(o.headers||{})
    };
    opt.body=JSON.stringify(o.body);
  }

  let r=await fetch(url,opt);
  let d=await r.json().catch(()=>({}));

  if(!r.ok) throw new Error(d.error||"REQUEST_FAILED");
  return d;
}

function modal(h){
  modalBody.innerHTML=h;
  modalEl.classList.remove("hidden");
}

window.closeModal=()=>modalEl.classList.add("hidden");

modalEl.onclick=e=>{
  if(e.target===modalEl) closeModal();
};

function toast(msg){
  const t=document.getElementById("toast");
  t.textContent=msg;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2500);
}

function card(x){
  return `
    <article class="card">
      <span class="pill">NHÀ HÁN NGỮ</span>
      <h3>${E(x.title)}</h3>
      <p>${E(x.body||x.status||"")}</p>
    </article>
  `;
}

function fmt(v){
  if(v===null||v===undefined||v==="") return "—";
  return E(v);
}

function table(headers,rows){
  return `
    <div style="overflow:auto">
      <table class="admin-table">
        <thead>
          <tr>
            ${headers.map(h=>`<th>${E(h)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.join("")}
        </tbody>
      </table>
    </div>
  `;
}

/* =========================
   ADMIN LAYOUT
========================= */

function adminShell(title,body){
  return `
    <section class="section admin-shell">

      <div class="admin-top">
        <div>
          <div class="eyebrow">NHÀ HÁN NGỮ · QUẢN TRỊ</div>
          <h1>${E(title)}</h1>
        </div>

        <button class="secondary" onclick="adminLogout()">
          Đăng xuất
        </button>
      </div>

      <div class="admin-layout">

        <aside class="admin-nav">

          <a href="#admin/dashboard">Tổng quan</a>

          <a href="#admin/submissions">
            Hồ sơ đăng ký
          </a>

          <a href="#admin/users">
            Tài khoản & phân quyền
          </a>

          <a href="#admin/people">
            Nhân sự
          </a>

          <a href="#admin/forms">
            Biểu mẫu
          </a>

          <a href="#admin/news">
            Bảng tin
          </a>

          <a href="#admin/events">
            Sự kiện
          </a>

          <a href="#admin/classes">
            Lớp học
          </a>

          <a href="#admin/units">
            Đơn vị
          </a>

          <a href="#admin/documents">
            Văn bản
          </a>

          <a href="#admin/tasks">
            Công việc
          </a>

          <a href="#admin/certificates">
            GCN / GXN
          </a>

          <a href="#admin/approvals">
            Phê duyệt
          </a>

          <a href="#admin/tickets">
            Hỗ trợ
          </a>

          <a href="#admin/files">
            Tệp tin
          </a>

          <a href="#admin/email">
            Email
          </a>

          <a href="#admin/audit">
            Nhật ký hệ thống
          </a>

          <a href="#admin/modules">
            Modules
          </a>

          <a href="#admin/settings">
            Cài đặt
          </a>

          <a href="#admin/backups">
            Sao lưu
          </a>

        </aside>

        <div class="admin-content">
          ${body}
        </div>

      </div>

    </section>
  `;
}

async function requireAdmin(){
  try{
    const d=await api("/api/auth/me");
    state.user=d.user;

    if(!state.user){
      login();
      return false;
    }

    accountBtn.textContent=
      state.user.full_name||
      state.user.email||
      "Tài khoản";

    return true;

  }catch{
    login();
    return false;
  }
}

window.adminLogout=async()=>{
  try{
    await api("/api/auth/logout",{method:"POST"});
  }catch{}

  state.user=null;
  location.hash="home";
  location.reload();
};

/* =========================
   PUBLIC HOME
========================= */

async function home(){

  let [n,e]=await Promise.all([
    api("/api/public/news").catch(()=>({items:[]})),
    api("/api/public/events").catch(()=>({items:[]}))
  ]);

  app.innerHTML=`
    <section class="hero">

      <div>

        <div class="eyebrow">
          CỔNG THÔNG TIN NHÀ HÁN NGỮ
        </div>

        <h1>
          Kết nối tri thức.<br>
          Mở lối tương lai.
        </h1>

        <p>
          Một không gian số dành cho hoạt động,
          bảng tin, đăng ký tham gia và xác thực
          Giấy chứng nhận của Nhà Hán Ngữ.
        </p>

        <div class="actions">

          <a class="btn" href="#activities">
            Khám phá hoạt động
          </a>

          <a class="btn secondary" href="#lookup">
            Tra cứu GCN
          </a>

        </div>

      </div>

      <img
        src="/assets/nhn-logo.jpg"
        alt="Nhà Hán Ngữ"
      >

    </section>

    <section class="section">

      <h2>Thông tin nổi bật</h2>

      <div class="grid">

        <div class="card">
          <h3>Hoạt động & Sự kiện</h3>
          <p>
            Theo dõi chương trình và đăng ký tham gia.
          </p>
        </div>

        <div class="card">
          <h3>Tra cứu GCN</h3>
          <p>
            Xác thực giấy chứng nhận bằng mã phát hành.
          </p>
        </div>

        <div class="card">
          <h3>Bảng tin</h3>
          <p>
            Cập nhật thông báo, nội dung
            và hoạt động cộng đồng.
          </p>
        </div>

        <div class="card">
          <h3>Tham gia Nhà Hán Ngữ</h3>
          <p>
            Đăng ký thành viên, cộng tác viên
            hoặc gửi yêu cầu hỗ trợ.
          </p>
        </div>

      </div>

    </section>

    <section class="section">

      <h2>Bảng tin mới</h2>

      <div class="grid">

        ${
          n.items.slice(0,3).map(card).join("")
          ||
          '<div class="card">Chưa có bản tin.</div>'
        }

      </div>

    </section>
  `;
}

/* =========================
   PUBLIC ACTIVITIES
========================= */

async function activities(){

  let d=await api("/api/public/events");

  app.innerHTML=`
    <section class="section">

      <h1>Hoạt động & Sự kiện</h1>

      <p class="muted">
        Các hoạt động cộng đồng của Nhà Hán Ngữ.
      </p>

      <div class="grid">

        ${
          d.items.map(x=>`
            <article class="card">

              <span class="pill">
                ${E(x.status)}
              </span>

              <h3>${E(x.title)}</h3>

              <p>
                ${E(x.start_at||"")}
              </p>

              <div class="actions">

                <a
                  class="btn"
                  href="#form/event"
                >
                  Đăng ký tham gia
                </a>

              </div>

            </article>
          `).join("")
          ||
          '<div class="card">Chưa có hoạt động được công bố.</div>'
        }

      </div>

    </section>
  `;
}

/* =========================
   PUBLIC NEWS
========================= */

async function news(){

  let d=await api("/api/public/news");

  app.innerHTML=`
    <section class="section">

      <h1>Bảng tin Nhà Hán Ngữ</h1>

      <div class="grid">

        ${
          d.items.map(card).join("")
          ||
          '<div class="card">Chưa có bản tin.</div>'
        }

      </div>

    </section>
  `;
}

/* =========================
   LOOKUP
========================= */

function lookup(){

  app.innerHTML=`
    <section class="form-wrap">

      <h1>Tra cứu & Xác thực</h1>

      <div class="grid">

        <div class="card">

          <h2>Giấy chứng nhận</h2>

          <form id="cert">

            <div class="field">

              <label>Mã GCN</label>

              <input
                name="code"
                placeholder="NHN-GCN-2026-0001"
                required
              >

            </div>

            <button>Tra cứu</button>

          </form>

          <div id="cr"></div>

        </div>

        <div class="card">

          <h2>Hồ sơ đăng ký</h2>

          <form id="sub">

            <div class="field">

              <label>Mã hồ sơ</label>

              <input
                name="code"
                required
              >

            </div>

            <div class="field">

              <label>Email</label>

              <input
                name="email"
                type="email"
                required
              >

            </div>

            <button>Tra cứu</button>

          </form>

          <div id="sr"></div>

        </div>

      </div>

    </section>
  `;

  cert.onsubmit=async e=>{

    e.preventDefault();

    let f=new FormData(e.target);

    try{

      let d=await api(
        "/api/lookup/certificate?code="+
        encodeURIComponent(f.get("code"))
      );

      let c=d.item;

      cr.innerHTML=`
        <div class="notice good">

          <b>${E(c.code)}</b><br>

          Người được cấp:
          <b>${E(c.full_name)}</b><br>

          ${E(c.content)}<br>

          Trạng thái:
          ${E(c.status)}

        </div>
      `;

    }catch{

      cr.innerHTML=`
        <div class="notice bad">
          Không tìm thấy Giấy chứng nhận.
        </div>
      `;
    }
  };

  sub.onsubmit=async e=>{

    e.preventDefault();

    let f=new FormData(e.target);

    try{

      let d=await api(
        `/api/lookup/submission?code=${
          encodeURIComponent(f.get("code"))
        }&email=${
          encodeURIComponent(f.get("email"))
        }`
      );

      sr.innerHTML=`
        <div class="notice good">

          <b>${E(d.item.code)}</b><br>

          Trạng thái:
          ${E(d.item.status)}

        </div>
      `;

    }catch{

      sr.innerHTML=`
        <div class="notice bad">
          Không tìm thấy hồ sơ.
        </div>
      `;
    }
  };
}

/* =========================
   PARTICIPATE
========================= */

async function participate(){

  let d=state.config?.forms||[];

  app.innerHTML=`
    <section class="section">

      <h1>Tham gia Nhà Hán Ngữ</h1>

      <div class="grid">

        ${
          d.map(f=>`
            <article class="card">

              <h3>${E(f.name)}</h3>

              <p>
                ${E(f.description)}
              </p>

              <a
                class="btn"
                href="#form/${encodeURIComponent(f.id)}"
              >
                Mở biểu mẫu
              </a>

            </article>
          `).join("")
        }

      </div>

    </section>
  `;
}

/* =========================
   DYNAMIC FORM
========================= */

async function form(id){

  let d=await api(
    "/api/forms/"+encodeURIComponent(id)
  );

  let c=d.form.config;

  app.innerHTML=`
    <section class="form-wrap">

      <h1>${E(c.name)}</h1>

      <p>${E(c.description)}</p>

      <form id="dyn">

        ${
          c.sections.map(s=>`

            <div class="card">

              <h2>${E(s.title)}</h2>

              ${
                s.fields.map(f=>field(f)).join("")
              }

            </div>

          `).join("")
        }

        <button>Gửi hồ sơ</button>

      </form>

    </section>
  `;

  dyn.onsubmit=async e=>{

    e.preventDefault();

    let fd=new FormData(e.target);
    let answers={};

    for(let [k,v] of fd){
      answers[k]=v==="on"?true:v;
    }

    try{

      let r=await api(
        `/api/forms/${encodeURIComponent(id)}/submit`,
        {
          method:"POST",
          body:{answers}
        }
      );

      e.target.innerHTML=`
        <div class="notice good">

          <h2>Đã tiếp nhận</h2>

          <p>
            Mã hồ sơ:
            <b>${E(r.code)}</b>
          </p>

        </div>
      `;

    }catch(err){
      alert(err.message);
    }
  };
}

function field(f){

  if(f.type==="textarea"){
    return `
      <div class="field">

        <label>${E(f.label)}</label>

        <textarea
          name="${E(f.key)}"
          ${f.required?"required":""}
        ></textarea>

      </div>
    `;
  }

  if(f.type==="select"){
    return `
      <div class="field">

        <label>${E(f.label)}</label>

        <select
          name="${E(f.key)}"
          ${f.required?"required":""}
        >

          <option value="">
            -- Chọn --
          </option>

          ${
            (f.options||[]).map(x=>`
              <option>${E(x)}</option>
            `).join("")
          }

        </select>

      </div>
    `;
  }

  if(f.type==="checkbox"){
    return `
      <div class="field">

        <label>

          <input
            type="checkbox"
            name="${E(f.key)}"
            ${f.required?"required":""}
          >

          ${E(f.label)}

        </label>

      </div>
    `;
  }

  return `
    <div class="field">

      <label>${E(f.label)}</label>

      <input
        type="${
          f.type==="email"
          ?"email"
          :f.type==="date"
          ?"date"
          :"text"
        }"
        name="${E(f.key)}"
        ${f.required?"required":""}
      >

    </div>
  `;
}

/* =========================
   LOGIN
========================= */

function login(){

  modal(`

    <button onclick="closeModal()">
      Đóng
    </button>

    <h2>
      Đăng nhập Nhà Hán Ngữ
    </h2>

    <form id="lf">

      <div class="field">

        <label>Email</label>

        <input
          name="email"
          type="email"
          required
        >

      </div>

      <div class="field">

        <label>Mật khẩu</label>

        <input
          name="password"
          type="password"
          required
        >

      </div>

      <button>Đăng nhập</button>

    </form>
  `);

  lf.onsubmit=async e=>{

    e.preventDefault();

    let f=new FormData(e.target);

    try{

      let d=await api(
        "/api/auth/login",
        {
          method:"POST",
          body:{
            email:f.get("email"),
            password:f.get("password"),
            portal:"admin"
          }
        }
      );

      state.user=d.user;

      closeModal();

      location.hash="admin/dashboard";

    }catch(x){
      alert(x.message);
    }
  };
}

accountBtn.onclick=()=>{
  if(state.user){
    location.hash="admin/dashboard";
  }else{
    login();
  }
};

/* =========================
   ADMIN DASHBOARD
========================= */

async function adminDashboard(){

  let d=await api("/api/admin/dashboard");
  let c=d.counts||{};

  const metrics=[
    ["Hồ sơ",c.submissions],
    ["Đang xử lý",c.pending],
    ["Nhân sự",c.people],
    ["GCN/GXN",c.certificates],
    ["Ticket mở",c.tickets],
    ["Chờ duyệt",c.approvals],
    ["Công việc",c.tasks]
  ];

  app.innerHTML=adminShell(
    "Tổng quan",
    `
      <div class="grid">

        ${
          metrics.map(x=>`
            <div class="card">

              <span class="pill">
                ${E(x[0])}
              </span>

              <h2 style="font-size:2rem">
                ${fmt(x[1]||0)}
              </h2>

            </div>
          `).join("")
        }

      </div>

      <div class="card">

        <h2>Truy cập nhanh</h2>

        <div class="actions">

          <a
            class="btn"
            href="#admin/submissions"
          >
            Hồ sơ
          </a>

          <a
            class="btn secondary"
            href="#admin/users"
          >
            Tài khoản
          </a>

          <a
            class="btn secondary"
            href="#admin/certificates"
          >
            GCN/GXN
          </a>

          <a
            class="btn secondary"
            href="#admin/approvals"
          >
            Phê duyệt
          </a>

        </div>

      </div>
    `
  );
}

/* =========================
   SUBMISSIONS
========================= */

async function adminSubmissions(){

  let d=await api("/api/admin/submissions");

  app.innerHTML=adminShell(
    "Hồ sơ đăng ký",
    `
      <div class="card">

        <div class="field">

          <label>Tìm hồ sơ</label>

          <input
            id="sq"
            placeholder="Mã hồ sơ, họ tên hoặc email"
          >

        </div>

        <button id="sbtn">
          Tìm
        </button>

      </div>

      <div id="stable">
        ${submissionTable(d.items)}
      </div>
    `
  );

  sbtn.onclick=async()=>{

    let q=sq.value.trim();

    let r=await api(
      "/api/admin/submissions?q="+
      encodeURIComponent(q)
    );

    stable.innerHTML=
      submissionTable(r.items);
  };
}

function submissionTable(items){

  return table(
    [
      "Mã",
      "Biểu mẫu",
      "Họ tên",
      "Email",
      "Trạng thái",
      "Điểm",
      "Cập nhật"
    ],
    items.map(x=>`
      <tr>

        <td>
          <a href="#admin/submission/${
            encodeURIComponent(x.code)
          }">
            ${E(x.code)}
          </a>
        </td>

        <td>${fmt(x.form_id)}</td>

        <td>${fmt(x.full_name)}</td>

        <td>${fmt(x.email)}</td>

        <td>${fmt(x.status)}</td>

        <td>${fmt(x.score)}</td>

        <td>${fmt(x.updated_at)}</td>

      </tr>
    `)
  );
}

async function adminSubmission(code){

  let d=await api(
    "/api/admin/submissions/"+
    encodeURIComponent(code)
  );

  let x=d.item;

  let answers=Object.entries(
    x.answers||{}
  ).map(([k,v])=>`

    <tr>

      <th>${E(k)}</th>

      <td>
        ${
          E(
            typeof v==="object"
            ?JSON.stringify(v)
            :v
          )
        }
      </td>

    </tr>

  `).join("");

  app.innerHTML=adminShell(
    "Chi tiết hồ sơ",
    `
      <div class="card">

        <h2>${E(x.code)}</h2>

        <p>
          <b>${fmt(x.full_name)}</b>
          ·
          ${fmt(x.email)}
        </p>

        <p>
          Biểu mẫu:
          ${fmt(x.form_id)}
        </p>

      </div>

      <div class="card">

        <h2>Cập nhật xử lý</h2>

        <form id="sf">

          <div class="field">

            <label>Trạng thái</label>

            <input
              name="status"
              value="${E(x.status||"")}"
            >

          </div>

          <div class="field">

            <label>Phân công</label>

            <input
              name="assigned_to"
              value="${E(x.assigned_to||"")}"
            >

          </div>

          <div class="field">

            <label>Điểm</label>

            <input
              name="score"
              value="${E(x.score||"")}"
            >

          </div>

          <div class="field">

            <label>Ghi chú nội bộ</label>

            <textarea
              name="internal_note"
            >${E(x.internal_note||"")}</textarea>

          </div>

          <button>
            Lưu thay đổi
          </button>

        </form>

      </div>

      <div class="card">

        <h2>Nội dung hồ sơ</h2>

        <div style="overflow:auto">

          <table class="admin-table">
            <tbody>
              ${answers}
            </tbody>
          </table>

        </div>

      </div>
    `
  );

  sf.onsubmit=async e=>{

    e.preventDefault();

    let f=new FormData(e.target);

    await api(
      "/api/admin/submissions/"+
      encodeURIComponent(code),
      {
        method:"PATCH",
        body:Object.fromEntries(f)
      }
    );

    toast("Đã cập nhật hồ sơ");
  };
}

/* =========================
   USERS
========================= */

async function adminUsers(){

  let d=await api("/api/admin/users");

  app.innerHTML=adminShell(
    "Tài khoản & phân quyền",
    `
      <div class="card">

        <button id="newUser">
          Tạo tài khoản
        </button>

      </div>

      ${
        table(
          [
            "ID",
            "Họ tên",
            "Email",
            "Trạng thái",
            "Quyền",
            "2FA"
          ],
          d.items.map(x=>`

            <tr>

              <td>${x.id}</td>

              <td>${fmt(x.full_name)}</td>

              <td>${fmt(x.email)}</td>

              <td>${fmt(x.status)}</td>

              <td>
                ${
                  E(
                    (x.roles||[])
                    .map(r=>r.role_id)
                    .join(", ")
                    ||
                    "—"
                  )
                }
              </td>

              <td>
                ${x.totp_enabled?"Bật":"Tắt"}
              </td>

            </tr>

          `)
        )
      }
    `
  );

  newUser.onclick=()=>{

    modal(`

      <button onclick="closeModal()">
        Đóng
      </button>

      <h2>Tạo tài khoản</h2>

      <form id="nuf">

        <div class="field">

          <label>Họ tên</label>

          <input
            name="full_name"
            required
          >

        </div>

        <div class="field">

          <label>Email</label>

          <input
            name="email"
            type="email"
            required
          >

        </div>

        <div class="field">

          <label>Role ID</label>

          <input
            name="role"
            placeholder="member"
          >

        </div>

        <button>
          Tạo tài khoản
        </button>

      </form>
    `);

    nuf.onsubmit=async e=>{

      e.preventDefault();

      let f=new FormData(e.target);

      try{

        let d=await api(
          "/api/admin/users",
          {
            method:"POST",
            body:{
              full_name:f.get("full_name"),
              email:f.get("email"),
              roles:[
                f.get("role")||"member"
              ]
            }
          }
        );

        closeModal();

        alert(
          "Đã tạo tài khoản."
          +
          (
            d.temp_password
            ?"\nMật khẩu tạm: "+d.temp_password
            :""
          )
        );

        await adminUsers();

      }catch(err){
        alert(err.message);
      }
    };
  };
}

/* =========================
   GENERIC ADMIN LIST
========================= */

async function adminSimpleList(
  title,
  url,
  cols
){

  let d=await api(url);

  app.innerHTML=adminShell(
    title,
    table(
      cols.map(c=>c[0]),
      d.items.map(x=>`

        <tr>

          ${
            cols.map(c=>`
              <td>
                ${fmt(x[c[1]])}
              </td>
            `).join("")
          }

        </tr>

      `)
    )
  );
}

async function adminForms(){

  let d=await api("/api/admin/forms");

  app.innerHTML=adminShell(
    "Biểu mẫu",
    table(
      [
        "ID",
        "Tên",
        "Đối tượng",
        "Tuổi tối thiểu",
        "Bật",
        "Phiên bản",
        "Email nhận"
      ],
      d.items.map(x=>`

        <tr>

          <td>${fmt(x.id)}</td>

          <td>${fmt(x.name)}</td>

          <td>${fmt(x.audience)}</td>

          <td>${fmt(x.min_age)}</td>

          <td>
            ${x.enabled?"Có":"Không"}
          </td>

          <td>${fmt(x.version)}</td>

          <td>${fmt(x.recipient_email)}</td>

        </tr>

      `)
    )
  );
}

async function adminContent(
  type,
  title,
  cols
){

  let d=await api(
    "/api/admin/content/"+type
  );

  app.innerHTML=adminShell(
    title,
    table(
      cols.map(c=>c[0]),
      d.items.map(x=>`

        <tr>

          ${
            cols.map(c=>`
              <td>
                ${fmt(x[c[1]])}
              </td>
            `).join("")
          }

        </tr>

      `)
    )
  );
}

/* =========================
   CERTIFICATES
========================= */

async function adminCertificates(){

  let d=await api(
    "/api/admin/certificates"
  );

  app.innerHTML=adminShell(
    "Giấy chứng nhận / Giấy xác nhận",
    table(
      [
        "Mã",
        "Họ tên",
        "Loại",
        "Nội dung",
        "Trạng thái",
        "Ngày cấp"
      ],
      d.items.map(x=>`

        <tr>

          <td>
            ${fmt(x.code||x.id)}
          </td>

          <td>${fmt(x.full_name)}</td>

          <td>${fmt(x.cert_type)}</td>

          <td>${fmt(x.content)}</td>

          <td>${fmt(x.status)}</td>

          <td>${fmt(x.issued_at)}</td>

        </tr>

      `)
    )
  );
}

/* =========================
   MODULES
========================= */

async function adminModules(){

  let d=await api(
    "/api/admin/modules"
  );

  app.innerHTML=adminShell(
    "Modules",
    table(
      [
        "Module",
        "Tên",
        "Trạng thái"
      ],
      d.items.map(x=>`

        <tr>

          <td>${fmt(x.key)}</td>

          <td>${fmt(x.name)}</td>

          <td>
            ${
              x.enabled
              ?"Đang bật"
              :"Đang tắt"
            }
          </td>

        </tr>

      `)
    )
  );
}
/* ==========================================
   NHÀ HÁN NGỮ — ADMIN DASHBOARD
========================================== */

.admin-top{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:16px;
  margin-bottom:20px;
}

.admin-layout{
  display:grid;
  grid-template-columns:230px minmax(0,1fr);
  gap:22px;
  align-items:start;
}

.admin-nav{
  position:sticky;
  top:90px;
  display:flex;
  flex-direction:column;
  gap:5px;
  padding:12px;
  border:1px solid rgba(0,0,0,.09);
  border-radius:16px;
  background:#fff;
}

.admin-nav a{
  display:block;
  padding:10px 12px;
  border-radius:10px;
  text-decoration:none;
  color:inherit;
  font-weight:600;
}

.admin-nav a:hover{
  background:rgba(143,16,24,.08);
  color:#8f1018;
}

.admin-content{
  min-width:0;
}

.admin-table{
  width:100%;
  border-collapse:collapse;
  font-size:14px;
}

.admin-table th,
.admin-table td{
  text-align:left;
  padding:11px 10px;
  border-bottom:1px solid rgba(0,0,0,.08);
  vertical-align:top;
}

.admin-table th{
  font-weight:700;
  white-space:nowrap;
}

.admin-table tr:hover td{
  background:rgba(0,0,0,.018);
}

.admin-table code{
  white-space:pre-wrap;
  word-break:break-word;
}

#toast.show{
  opacity:1;
  transform:translateY(0);
}

@media(max-width:850px){

  .admin-layout{
    grid-template-columns:1fr;
  }

  .admin-nav{
    position:static;
    display:grid;
    grid-template-columns:
      repeat(2,minmax(0,1fr));
  }

  .admin-top{
    flex-direction:column;
  }
}
