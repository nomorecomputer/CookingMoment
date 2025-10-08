const Direction = { Left: "Left", Right: "Right" };
const SupportOrNot = { Support: "Support", NotSupport: "NotSupport" };

const Category_Names = {
  MenuContainerId: "category-menu",
  MenuItemClassname: "category-item",
  CategoryEllipsisId: "category-ellipsis",
  RecipeContainerId: "category-cards",
  RecipeClassname: "category-card",
  RecipeReposityId: "recipe-repository",
  Meat: "meat",
  Seafood: "seafood",
  Vegetable: "vegetable",
  Vegetarian: "vegetarian",
  Ketogenic: "ketogenic",
  All: "all",
  BtnLeft: "category-left",
  BtnRight: "category-right",
};
const Banner_Names = {
  BannerId: "index_banner",
  Btn_left_s: "banner_left_s",
  Btn_right_s: "banner_right_s",
  Btn_left_l: "banner_left_l",
  Btn_right_l: "banner_right_l",
};
const Banner_Images = ["banner1_large.jpg", "about_bg.jpg", "banner2.jpg"];
const Banner_Titles = ["本周主打食譜", "蔬果入菜有益健康", "生酮飲食好處多"];
let BannerImageIndex = 0;

const SwipeContainerIds = [];
const SwipeCardClassnames = [];
let category_ellipsis_toggle = "show front";

const cards = [];
let touch_startX = 0;
let touch_lastX = 0;
let touch_startTime;
let isSwiping = false;

export function add_listener_for_index() {
  // #region 0. 註冊 demoPage 關閉按鈕
  document.getElementById("bannerTitle").addEventListener("click", () => {
    document.getElementById("demoPage").classList.toggle("d-none");
    document.getElementById("demoPage").classList.toggle("d-block");
  });
  // #endregion
  // #region 1. 註冊 Banner background-image 向左、向右 切換 按鈕
  const arr = [
    { Id: Banner_Names.Btn_left_s, dir: Direction.Left },
    { Id: Banner_Names.Btn_right_s, dir: Direction.Right },
    { Id: Banner_Names.Btn_left_l, dir: Direction.Left },
    { Id: Banner_Names.Btn_right_l, dir: Direction.Right },
  ];

  arr.forEach((obj) => {
    const elem = document.getElementById(obj.Id);
    if (!elem) return;
    elem.addEventListener("click", () => handle_banner_rotate(obj.dir));
  });
  // #endregion
  // #region 2-0 以類別篩選食譜  預設先 載入 疏食類 食譜
  Load_in_recipe(Category_Names.Vegetable);
  //#endregion
  // #region 2-1.以類別篩選食譜 註冊 menu (Category)Icon 篩選、swipe
  registry_categoryMenu(
    Category_Names.MenuContainerId,
    Category_Names.MenuItemClassname,
    Category_Names.CategoryEllipsisId,
    Category_Names.RecipeContainerId
  );
  // #endregion
  // #region 2-2.以類別篩選食譜 註冊 向左、向右
  registry_buttons({
    containerId: Category_Names.RecipeContainerId,
    cardClassName: Category_Names.RecipeClassname,
    supportBtn: SupportOrNot.Support,
    supportSwipe: SupportOrNot.Support,
    buttons: [
      { buttonId: "category-left", direction: Direction.Left },
      { buttonId: "category-right", direction: Direction.Right },
    ],
  });
  //#endregion
  // #region 3.人氣精選 註冊 向左、向右
  registry_buttons({
    containerId: "selection-cards",
    cardClassName: "selection-card",
    supportBtn: SupportOrNot.Support,
    supportSwipe: SupportOrNot.Support,
    buttons: [
      { buttonId: "selection-left", direction: Direction.Left },
      { buttonId: "selection-right", direction: Direction.Right },
    ],
  });
  //#endregion
  // #region 5.餐桌故事 註冊 向左、向右
  registry_buttons({
    containerId: "tableStory-cards",
    cardClassName: "tableStory-card",
    supportBtn: SupportOrNot.Support,
    supportSwipe: SupportOrNot.Support,
    buttons: [
      { buttonId: "tableStory_left", direction: Direction.Left },
      { buttonId: "tableStory_right", direction: Direction.Right },
    ],
  });
  //#endregion

  //#region 當所有 containerId、cardClassname 都註冊過後 跨不同container、card 註冊 card的 touchstart、touchmove
  for (let i = 0; i < SwipeCardClassnames.length; i++) {
    cards.push(document.getElementsByClassName(SwipeCardClassnames[i]));
    for (let j = 0; j < cards[i].length; j++) {
      cards[i][j].addEventListener("touchstart", handle_touch_start);
      cards[i][j].addEventListener("touchmove", handle_touch_move);
      cards[i][j].addEventListener("touchend", () => endSwipe(i));

      cards[i][j].addEventListener("mousedown", handleMouseDown);
      cards[i][j].addEventListener("mouseup", function (e) {
        handleMouseUp(e, i);
      });
      cards[i][j].addEventListener("mouseleave", function (e) {
        handleMouseUp(e, i);
      });
    }
  }
  // #endregion
}

function registry_categoryMenu(
  menuContainerId,
  itemClassName,
  ellipsisId,
  cardContainerId
) {
  const menuItems2 = document
    .getElementById("category-slider")
    .querySelectorAll(".category-item");

  menuItems2.forEach((menuItem) => {
    menuItem.addEventListener("click", () =>
      handle_category_change(
        "category-slider",
        "category-item",
        menuItem,
        cardContainerId
      )
    );
  });
}
// ************************************************************
function handle_touch_start(event) {
  startSwipe(event.touches[0].clientX);
}
function handle_touch_move(event) {
  if (!isSwiping) return;
  touch_lastX = event.touches[0].clientX;
}

function handleMouseDown(event) {
  startSwipe(event.clientX);
}
function handleMouseUp(event, idx) {
  if (!isSwiping) return;
  touch_lastX = event.clientX;
  endSwipe(idx);
}
function startSwipe(currentX) {
  touch_startTime = Date.now();
  touch_startX = currentX;
  isSwiping = true;
}
function endSwipe(idx) {
  const diff = touch_lastX - touch_startX;

  if (diff > 20) {
    handle_header_rotate(
      SwipeContainerIds[idx],
      SwipeCardClassnames[idx],
      Direction.Right
    );
  } else if (diff < -20) {
    handle_header_rotate(
      SwipeContainerIds[idx],
      SwipeCardClassnames[idx],
      Direction.Left
    );
  }
  isSwiping = false;
}
// ************************************************************
// ************************************************************
function handle_header_rotate(containerId, cardClassName, direction) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (direction == Direction.Right) {
    const lastCard = container.lastElementChild;
    if (!lastCard) return;
    container.insertBefore(lastCard, container.firstChild);
  } else if (direction == Direction.Left) {
    const firstCard = container.firstElementChild;
    if (!firstCard) return;
    container.appendChild(firstCard);
  }
}

function registry_buttons({
  containerId,
  cardClassName,
  supportBtn = SupportOrNot.NotSupport,
  supportSwipe = SupportOrNot.NotSupport,
  buttons = [],
}) {
  if (supportBtn == SupportOrNot.Support) {
    if (!buttons || !Array.isArray(buttons)) return;
    for (let i = 0; i < buttons.length; i++) {
      let buttonElement = document.getElementById(buttons[i].buttonId);
      if (!buttonElement) return;

      buttonElement.removeEventListener("click", () => {
        handle_header_rotate(containerId, cardClassName, buttons[i].direction);
      });
      buttonElement.addEventListener("click", () => {
        handle_header_rotate(containerId, cardClassName, buttons[i].direction);
      });
    }
  }

  if (supportSwipe == SupportOrNot.Support) {
    SwipeContainerIds.push(containerId);
    SwipeCardClassnames.push(cardClassName);
  }
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

function handle_category_change(
  menuContainerId,
  itemClassName,
  menuItem,
  cardContainerId
) {
  const menuContainer = document.getElementById(menuContainerId);
  const cardContainer = document.getElementById(cardContainerId);
  const category = menuItem.dataset.category;
  const recipes = document.getElementById(category);

  Load_in_recipe(menuItem.dataset.category);
  // cardContainer.innerHTML = "";
  // while (recipes.firstChild) cardContainer.appendChild(recipes.firstChild);

  const menuItems = menuContainer.querySelectorAll("." + itemClassName);

  menuItems.forEach((x) => {
    x.classList.remove("selected");
    x.style.border = "2px solid transparent";
    x.offsetHeight;
  });
  menuItem.classList.add("selected");
  menuItem.style.border = "2px solid #5c7c5f";
}

function Load_in_recipe(recipeCategory) {
  const repositoryElement = document.getElementById(
    Category_Names.RecipeReposityId
  );
  const cards = document.getElementById(Category_Names.RecipeContainerId);
  Array.from(cards.children).forEach((elem) => {
    repositoryElement.appendChild(elem);
  });

  const recipes =
    recipeCategory == Category_Names.All
      ? repositoryElement.children
      : repositoryElement.getElementsByClassName(recipeCategory);

  Array.from(recipes).forEach((elem) => {
    cards.appendChild(elem);
  });
}

function handle_banner_rotate(direction) {
  if (direction == Direction.Left) {
    BannerImageIndex--;
  } else {
    BannerImageIndex++;
  }
  BannerImageIndex =
    (BannerImageIndex + Banner_Images.length) % Banner_Images.length;
  const imageName = Banner_Images[BannerImageIndex];
  const bannerElem = document.getElementById(Banner_Names.BannerId);
  const titleElem = document.querySelectorAll(".banner_title");
  titleElem.forEach(
    (elem) => (elem.innerText = Banner_Titles[BannerImageIndex])
  );

  const imagePath = `url("/CookingMoment/images/index/${imageName}")`;

  bannerElem.style.backgroundImage = imagePath;
}
