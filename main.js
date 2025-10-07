import "./assets/scss/all.scss";

console.log("【此食此刻 讚!】");

import { gen_star, Add_toggle_login_logout } from "/assets/js/tools.js";

import { add_listener_for_index } from "/assets/js/index.js";
import { add_listener_for_index_category } from "/assets/js/index_category.js";

window.appConfig = {
  categoryCardSpace: 234,
  categoryCardLimit: 1,
};
let clickTimeout;
document.addEventListener("DOMContentLoaded", (event) => {
  gen_star();
  Add_toggle_login_logout();
  add_listener_for_index_category();
  add_listener_for_index();
});
