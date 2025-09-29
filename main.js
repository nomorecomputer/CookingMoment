import "./assets/scss/all.scss";

console.log("Hello world");

import { gen_star, Add_toggle_login_logout } from "/assets/js/tools.js";

import { add_listener_for_index } from "/assets/js/index.js";

let clickTimeout;
document.addEventListener("DOMContentLoaded", (event) => {
  gen_star();
  Add_toggle_login_logout();
  add_listener_for_index();
});
