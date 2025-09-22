import "./assets/scss/all.scss";

console.log("Hello world");

import {
  gen_star,
  cart_order_number,
  Add_toggle_login_logout,
} from "/assets/js/tools.js";

let clickTimeout;
document.addEventListener("DOMContentLoaded", (event) => {
  gen_star();
  Add_toggle_login_logout();
  cart_order_number();
});
