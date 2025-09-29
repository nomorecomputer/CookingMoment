import "/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

// *************  global variables  ************************
//
let clickTimeout2;

// ********************* generate 評等星星 ********************************

// Handler of Document download completed
// Usage： classname: rating-stars    attribute: data-rating  (0~5)
export function gen_star() {
  const stars = document.querySelectorAll(".rating-stars");
  for (let i = 0; i < stars.length; i++) {
    const ratting = stars[i].dataset.rating;
    stars[i].innerHTML = "";
    for (let j = 0; j < ratting; j++) {
      const span = document.createElement("span");
      span.classList.add("icon-star-solid");
      span.classList.add("mx-1");
      span.classList.add("my-91");
      stars[i].appendChild(span);
    }
    for (let j = 0; j < 5 - ratting; j++) {
      const span = document.createElement("span");
      span.classList.add("icon-star-outline");
      span.classList.add("mx-1");
      span.classList.add("my-91");
      stars[i].appendChild(span);
    }
  }
}

// ***************** header.scss **********************

function redraw_login_icon() {
  const element = document.getElementById("header-login-status");
  const avatar = document.getElementById("header-avatar"); //取得 頭像 element
  const toLogin = document.getElementById("header-toLogin"); //取得 【會員登入】element

  const logined = element.dataset.logined;
  if (logined.toUpperCase() == "TRUE") {
    avatar.classList.replace("d-none", "d-block");
    toLogin.classList.replace("d-block", "d-none");
  } else if (logined.toUpperCase() == "FALSE") {
    avatar.classList.replace("d-block", "d-none");
    toLogin.classList.replace("d-none", "d-block");
  }
}

// Handler of Document download completed
export function Add_toggle_login_logout() {
  const avatar = document.getElementById("header-avatar"); //取得 頭像 element
  const toLogin = document.getElementById("header-toLogin"); //取得 【會員登入】element
  const toLogout = document.getElementById("user-logout"); //取得 會員登出 element
  const menuBtn = document.getElementById("header-menu-btn"); //取得 header最右端 漢堡按鈕 element
  const closeCanvasBtn = document.getElementById("header-close-usercanvas"); //取得 user OffCanvas 右上的關閉按鈕

  if (!avatar || !toLogin || !toLogout || !menuBtn || !closeUserOffCanvas)
    return;
  // 註冊 頭像 與 【會員登入】double click toggle功能
  avatar.removeEventListener("dblclick", (event) => toggle_login(event)); //清除原有event handler；避免重複
  avatar.addEventListener("dblclick", (event) => toggle_login(event));
  toLogin.removeEventListener("dblclick", (event) => toggle_login(event)); //清除原有event handler；避免重複
  toLogin.addEventListener("dblclick", (event) => toggle_login(event));

  //  註冊 頭像 click  顯示 user offcanvas
  avatar.removeEventListener("click", () => showUserOffCanvas()); //清除原有event handler；避免重複
  avatar.addEventListener("click", () => showUserOffCanvas());

  // 註冊 會員登出
  // toLogout.removeEventListener("click", logout); //清除原有event handler；避免重複
  // toLogout.addEventListener("click", logout);

  // 註冊 header 最右邊漢堡按鈕  toggle 下拉功能按鈕
  menuBtn.removeEventListener("click", expand_header_menu);
  menuBtn.addEventListener("click", expand_header_menu);

  //註冊  user OffCanvas 右上的關閉按鈕 click
  closeCanvasBtn.addEventListener("click", closeUserOffCanvas);

  redraw_login_icon();
}
function toggle_login(event) {
  if (clickTimeout2) {
    clearTimeout(clickTimeout2);
    clickTimeout2 = null;
  }
  event.preventDefault();
  const element = document.getElementById("header-login-status");
  element.dataset.logined =
    element.dataset.logined == "true" ? "false" : "true";
  redraw_login_icon();
}

function logout() {
  const element = document.getElementById("header-login-status");
  element.dataset.logined = "false";

  redraw_login_icon();
}

function closeUserOffCanvas() {
  document.getElementById("header-userOffCanvas").classList.remove("show");
}
function showUserOffCanvas() {
  if (clickTimeout2) {
    clearTimeout(clickTimeout2);
    clickTimeout2 = null;
    return;
  }
  clickTimeout2 = setTimeout(() => {
    const classList = document.getElementById("header-userOffCanvas").classList;
    if (classList.contains("show")) {
      classList.remove("show");
    } else {
      classList.add("show");
    }
    clearTimeout(clickTimeout2);
    clickTimeout2 = null;
  }, 300);
}

function expand_header_menu() {
  const classList = document.getElementById("header-menu-list").classList;
  if (!classList.contains("show")) {
    classList.remove("show");
  } else {
    classList.add("show");
  }
}
