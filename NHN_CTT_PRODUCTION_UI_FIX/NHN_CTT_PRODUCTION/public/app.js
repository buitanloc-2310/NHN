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

  const r=await fetch(url,opt);
  const d=await r.json().catch(()=>({}));

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

function card(x){
  return `
    <article class="card">
      <span class="pill">NHÀ HÁN NGỮ</span>
      <h3>${E(x.title)}</h3>
      <p>${E(x.body||x.status||"")}</p>
    </article>
  `;
}

/* =========================
   TRANG CHỦ
========================= */

async function home(){

  const n=await api("/api/public/news")
    .catch(()=>({items:[]}));

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
          <p>Theo dõi chương trình và đăng ký tham gia.</p>
        </div>

        <div class="card">
          <h3>Tra cứu GCN</h3>
          <p>Xác thực giấy chứng nhận bằng mã phát hành.</p>
        </div>

        <div class="card">
          <h3>Bảng tin</h3>
          <p>Cập nhật thông báo và hoạt động cộng đồng.</p>
        </div>

        <div class="card">
          <h3>Tham gia Nhà Hán Ngữ</h3>
          <p>Đăng ký thành viên, cộng tác viên hoặc hỗ trợ.</p>
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
   HOẠT ĐỘNG
========================= */

async function activities(){

  const d=await api("/api/public/events")
    .catch(()=>({items:[]}));

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
   BẢNG TIN
========================= */

async function news(){

  const d=await api("/api/public/news")
    .catch(()=>({items:[]}));

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
   TRA CỨU
========================= */

function lookup(){

  app.innerHTML=`
    <section class="form-wrap">

      <h1>Tra cứu & Xác thực</h1>

      <div class="grid">

        <div class="card">

          <h2>Giấy chứng nhận</h2>

          <form id="certForm">

            <div class="field">

              <label>Mã GCN</label>

              <input
                name="code"
                required
              >

            </div>

            <button>Tra cứu</button>

          </form>

          <div id="cr"></div>

        </div>

        <div class="card">

          <h2>Hồ sơ đăng ký</h2>

          <form id="subForm">

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

  document.getElementById("certForm").onsubmit=async e=>{

    e.preventDefault();

    const f=new FormData(e.target);

    try{

      const d=await api(
        "/api/lookup/certificate?code="+
        encodeURIComponent(f.get("code"))
      );

      const c=d.item;

      document.getElementById("cr").innerHTML=`
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

      document.getElementById("cr").innerHTML=`
        <div class="notice bad">
          Không tìm thấy Giấy chứng nhận.
        </div>
      `;
    }
  };

  document.getElementById("subForm").onsubmit=async e=>{

    e.preventDefault();

    const f=new FormData(e.target);

    try{

      const d=await api(
        `/api/lookup/submission?code=${
          encodeURIComponent(f.get("code"))
        }&email=${
          encodeURIComponent(f.get("email"))
        }`
      );

      document.getElementById("sr").innerHTML=`
        <div class="notice good">

          <b>${E(d.item.code)}</b><br>

          Trạng thái:
          ${E(d.item.status)}

        </div>
      `;

    }catch{

      document.getElementById("sr").innerHTML=`
        <div class="notice bad">
          Không tìm thấy hồ sơ.
        </div>
      `;
    }
  };
}

/* =========================
   THAM GIA
========================= */

async function participate(){

  const d=state.config?.forms||[];

  app.innerHTML=`
    <section class="section">

      <h1>Tham gia Nhà Hán Ngữ</h1>

      <div class="grid">

        ${
          d.map(f=>`
            <article class="card">

              <h3>${E(f.name)}</h3>

              <p>${E(f.description)}</p>

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
   BIỂU MẪU
========================= */

async function form(id){

  const d=await api(
    "/api/forms/"+encodeURIComponent(id)
  );

  const c=d.form.config;

  app.innerHTML=`
    <section class="form-wrap">

      <h1>${E(c.name)}</h1>

      <p>${E(c.description)}</p>

      <form id="dynForm">

        ${
          c.sections.map(s=>`
            <div class="card">

              <h2>${E(s.title)}</h2>

              ${
                s.fields.map(field).join("")
              }

            </div>
          `).join("")
        }

        <button>
          Gửi hồ sơ
        </button>

      </form>

    </section>
  `;

  document.getElementById("dynForm").onsubmit=async e=>{

    e.preventDefault();

    const fd=new FormData(e.target);
    const answers={};

    for(const [k,v] of fd){
      answers[k]=v==="on"?true:v;
    }

    try{

      const r=await api(
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
            (f.options||[])
            .map(x=>`
              <option>${E(x)}</option>
            `)
            .join("")
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

    <form id="loginForm">

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

      <button>
        Đăng nhập
      </button>

    </form>
  `);

  document.getElementById("loginForm").onsubmit=async e=>{

    e.preventDefault();

    const f=new FormData(e.target);

    try{

      const d=await api(
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

    }catch(err){

      alert(err.message);
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
   ADMIN MENU
========================= */

function adminNav(){

  return `
    <aside class="admin-nav">

      <a href="#admin/dashboard">
        Tổng quan
      </a>

      <a href="#admin/submissions">
        Hồ sơ đăng ký
      </a>

      <a href="#admin/users">
        Tài khoản
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

      <a href="#admin/audit">
        Nhật ký
      </a>

      <a href="#admin/backups">
        Sao lưu
      </a>

    </aside>
  `;
}

function adminPage(title,body){

  app.innerHTML=`
    <section class="section admin-shell">

      <div class="admin-top">

        <div>

          <div class="eyebrow">
            NHÀ HÁN NGỮ · QUẢN TRỊ
          </div>

          <h1>${E(title)}</h1>

        </div>

        <button
          id="logoutBtn"
          class="secondary"
        >
          Đăng xuất
        </button>

      </div>

      <div class="admin-layout">

        ${adminNav()}

        <div class="admin-content">
          ${body}
        </div>

      </div>

    </section>
  `;

  document.getElementById("logoutBtn")
    .onclick=logout;
}

async function logout(){

  try{
    await api(
      "/api/auth/logout",
      {method:"POST"}
    );
  }catch{}

  state.user=null;

  location.hash="home";

  location.reload();
}

/* =========================
   ADMIN TABLE
========================= */

function table(headers,rows){

  return `
    <div style="overflow:auto">

      <table class="admin-table">

        <thead>

          <tr>
            ${
              headers.map(x=>`
                <th>${E(x)}</th>
              `).join("")
            }
          </tr>

        </thead>

        <tbody>
          ${rows.join("")}
        </tbody>

      </table>

    </div>
  `;
}

function td(v){
  return `<td>${E(v??"—")}</td>`;
}

/* =========================
   DASHBOARD
========================= */

async function dashboard(){

  const d=await api(
    "/api/admin/dashboard"
  );

  const c=d.counts||{};

  const items=[
    ["Hồ sơ",c.submissions],
    ["Đang xử lý",c.pending],
    ["Nhân sự",c.people],
    ["GCN/GXN",c.certificates],
    ["Ticket mở",c.tickets],
    ["Chờ duyệt",c.approvals],
    ["Công việc",c.tasks]
  ];

  adminPage(
    "Tổng quan",
    `
      <div class="grid">

        ${
          items.map(([name,value])=>`
            <div class="card">

              <span class="pill">
                ${E(name)}
              </span>

              <h2 style="font-size:2rem">
                ${Number(value||0)}
              </h2>

            </div>
          `).join("")
        }

      </div>
    `
  );
}

/* =========================
   GENERIC LIST
========================= */

async function listPage(
  title,
  url,
  headers,
  keys
){

  const d=await api(url);

  adminPage(
    title,
    table(
      headers,
      (d.items||[]).map(x=>`
        <tr>
          ${
            keys.map(k=>td(x[k]))
            .join("")
          }
        </tr>
      `)
    )
  );
}

/* =========================
   HỒ SƠ
========================= */

async function submissions(){

  const d=await api(
    "/api/admin/submissions"
  );

  adminPage(
    "Hồ sơ đăng ký",
    table(
      [
        "Mã",
        "Biểu mẫu",
        "Họ tên",
        "Email",
        "Trạng thái",
        "Điểm"
      ],
      (d.items||[]).map(x=>`
        <tr>

          <td>
            <a
              href="#admin/submission/${
                encodeURIComponent(x.code)
              }"
            >
              ${E(x.code)}
            </a>
          </td>

          ${td(x.form_id)}
          ${td(x.full_name)}
          ${td(x.email)}
          ${td(x.status)}
          ${td(x.score)}

        </tr>
      `)
    )
  );
}

async function submission(code){

  const d=await api(
    "/api/admin/submissions/"+
    encodeURIComponent(code)
  );

  const x=d.item||{};

  adminPage(
    "Chi tiết hồ sơ",
    `
      <div class="card">

        <h2>
          ${E(x.code||"")}
        </h2>

        <p>
          <b>${E(x.full_name||"")}</b>
          ·
          ${E(x.email||"")}
        </p>

        <p>
          Trạng thái:
          ${E(x.status||"")}
        </p>

      </div>

      <div class="card">

        <h2>Nội dung hồ sơ</h2>

        ${
          table(
            [
              "Trường",
              "Nội dung"
            ],
            Object.entries(
              x.answers||{}
            ).map(([k,v])=>`
              <tr>
                ${td(k)}
                ${
                  td(
                    typeof v==="object"
                    ?JSON.stringify(v)
                    :v
                  )
                }
              </tr>
            `)
          )
        }

      </div>
    `
  );
}

async function adminContent(
  type,
  title,
  headers,
  keys
){

  return listPage(
    title,
    "/api/admin/content/"+type,
    headers,
    keys
  );
}

/* =========================
   ADMIN ROUTER
========================= */

async function adminRoute(h){

  const me=await api("/api/auth/me")
    .catch(()=>({user:null}));

  state.user=me.user;

  if(!state.user){
    login();
    return;
  }

  accountBtn.textContent=
    state.user.full_name
    ||
    state.user.email
    ||
    "Tài khoản";

  try{

    if(h==="admin/dashboard"){
      return dashboard();
    }

    if(h==="admin/submissions"){
      return submissions();
    }

    if(h.startsWith("admin/submission/")){
      return submission(
        decodeURIComponent(
          h.slice(17)
        )
      );
    }

    if(h==="admin/users"){
      return listPage(
        "Tài khoản & phân quyền",
        "/api/admin/users",
        [
          "ID",
          "Họ tên",
          "Email",
          "Trạng thái"
        ],
        [
          "id",
          "full_name",
          "email",
          "status"
        ]
      );
    }

    if(h==="admin/people"){
      return listPage(
        "Nhân sự",
        "/api/admin/people",
        [
          "ID",
          "Họ tên",
          "Email",
          "Đơn vị",
          "Vị trí",
          "Trạng thái"
        ],
        [
          "id",
          "full_name",
          "email",
          "unit_code",
          "position",
          "status"
        ]
      );
    }

    if(h==="admin/forms"){
      return listPage(
        "Biểu mẫu",
        "/api/admin/forms",
        [
          "ID",
          "Tên",
          "Đối tượng",
          "Phiên bản"
        ],
        [
          "id",
          "name",
          "audience",
          "version"
        ]
      );
    }

    if(h==="admin/news"){
      return adminContent(
        "news",
        "Bảng tin",
        [
          "Tiêu đề",
          "Trạng thái",
          "Ngày đăng"
        ],
        [
          "title",
          "status",
          "published_at"
        ]
      );
    }

    if(h==="admin/events"){
      return adminContent(
        "events",
        "Sự kiện",
        [
          "Tên",
          "Bắt đầu",
          "Trạng thái",
          "Sức chứa"
        ],
        [
          "title",
          "start_at",
          "status",
          "capacity"
        ]
      );
    }

    if(h==="admin/classes"){
      return adminContent(
        "classes",
        "Lớp học",
        [
          "Tên",
          "Cấp độ",
          "Trạng thái",
          "Sức chứa"
        ],
        [
          "title",
          "level",
          "status",
          "capacity"
        ]
      );
    }

    if(h==="admin/units"){
      return adminContent(
        "units",
        "Đơn vị",
        [
          "Mã",
          "Tên",
          "Loại",
          "Quản lý",
          "Trạng thái"
        ],
        [
          "code",
          "name",
          "unit_type",
          "manager_name",
          "status"
        ]
      );
    }

    if(h==="admin/documents"){
      return adminContent(
        "documents",
        "Văn bản",
        [
          "Mã",
          "Tiêu đề",
          "Loại",
          "Trạng thái"
        ],
        [
          "code",
          "title",
          "doc_type",
          "status"
        ]
      );
    }

    if(h==="admin/tasks"){
      return adminContent(
        "tasks",
        "Công việc",
        [
          "Tiêu đề",
          "Phụ trách",
          "Ưu tiên",
          "Trạng thái",
          "Hạn"
        ],
        [
          "title",
          "assigned_to",
          "priority",
          "status",
          "due_at"
        ]
      );
    }

    if(h==="admin/certificates"){
      return listPage(
        "GCN / GXN",
        "/api/admin/certificates",
        [
          "Mã",
          "Họ tên",
          "Loại",
          "Trạng thái",
          "Ngày cấp"
        ],
        [
          "code",
          "full_name",
          "cert_type",
          "status",
          "issued_at"
        ]
      );
    }

    if(h==="admin/approvals"){
      return listPage(
        "Phê duyệt",
        "/api/admin/approvals",
        [
          "ID",
          "Đối tượng",
          "Hành động",
          "Trạng thái",
          "Hạn"
        ],
        [
          "id",
          "entity_type",
          "action",
          "status",
          "due_at"
        ]
      );
    }

    if(h==="admin/tickets"){
      return listPage(
        "Hỗ trợ",
        "/api/admin/tickets",
        [
          "Mã",
          "Chủ đề",
          "Người gửi",
          "Ưu tiên",
          "Trạng thái"
        ],
        [
          "code",
          "subject",
          "submitter_name",
          "priority",
          "status"
        ]
      );
    }

    if(h==="admin/files"){
      return listPage(
        "Tệp tin",
        "/api/admin/files",
        [
          "Tên",
          "Loại",
          "Dung lượng",
          "Quyền xem",
          "Ngày tải"
        ],
        [
          "filename",
          "mime",
          "size",
          "visibility",
          "created_at"
        ]
      );
    }

    if(h==="admin/audit"){
      return listPage(
        "Nhật ký hệ thống",
        "/api/admin/audit",
        [
          "Tài khoản",
          "Hành động",
          "Đối tượng",
          "Thời gian"
        ],
        [
          "actor_email",
          "action",
          "entity_type",
          "created_at"
        ]
      );
    }

    if(h==="admin/backups"){
      return listPage(
        "Sao lưu",
        "/api/admin/backups",
        [
          "ID",
          "R2 key",
          "Dung lượng",
          "Ngày tạo"
        ],
        [
          "id",
          "r2_key",
          "size",
          "created_at"
        ]
      );
    }

    return dashboard();

  }catch(err){

    adminPage(
      "Không thể tải dữ liệu",
      `
        <div class="notice bad">

          <b>
            ${E(err.message)}
          </b>

          <p>
            API hoặc quyền truy cập của mục này đang có lỗi.
          </p>

        </div>
      `
    );
  }
}

/* =========================
   ROUTER
========================= */

async function route(){

  const h=
    location.hash.slice(1)
    ||
    "home";

  try{

    if(h==="home"){
      return home();
    }

    if(h==="activities"){
      return activities();
    }

    if(h==="news"){
      return news();
    }

    if(h==="lookup"){
      return lookup();
    }

    if(h==="participate"){
      return participate();
    }

    if(h.startsWith("form/")){
      return form(
        decodeURIComponent(
          h.slice(5)
        )
      );
    }

    if(h.startsWith("admin/")){
      return adminRoute(h);
    }

    return home();

  }catch(err){

    app.innerHTML=`
      <section class="section">

        <div class="notice bad">

          <b>
            Không thể tải trang.
          </b>

          <p>
            ${E(err.message)}
          </p>

        </div>

      </section>
    `;
  }
}

/* =========================
   KHỞI ĐỘNG
========================= */

async function init(){

  state.config=
    await api("/api/config")
    .catch(()=>({
      forms:[]
    }));

  const me=
    await api("/api/auth/me")
    .catch(()=>({
      user:null
    }));

  state.user=
    me.user||null;

  if(state.user){

    accountBtn.textContent=
      state.user.full_name
      ||
      state.user.email
      ||
      "Tài khoản";
  }

  route();
}

window.addEventListener(
  "hashchange",
  route
);

init();
