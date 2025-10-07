export function add_listener_for_index_category() {
  const myConst = {
    cardContainerId: "category-slider",
    ellipsisId: "category-indicator-container",
    ellipsisDotClassName: "indicator",
  };
  let currentIndex = 0;
  let isDragging = false;
  let startPos = 0;
  let prevTranslate = 0;
  let currentTranslate = 0;

  const category_menu = document.getElementById(myConst.cardContainerId);
  const category_indicator = document.getElementById(myConst.ellipsisId);

  function updateCategoryMenu() {
    // call by
    // 1. click  indicator
    prevTranslate = currentIndex * countShiftX();
    category_menu.style.transform = `translateX( -${prevTranslate}px)`;

    document
      .querySelectorAll(`.${myConst.ellipsisDotClassName}`)
      .forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
      });
  }
  function countShiftX() {
    return (
      category_menu.children[1].offsetLeft -
      category_menu.children[0].offsetLeft
    );
  }
  const categoryCards = [
    {
      src: "category1_meat.png",
      type: "meat",
    },
    {
      src: "category2_seafood.png",
      type: "seafood",
    },
    {
      src: "category3_vegetable.png",
      type: "vegetable",
    },
    {
      src: "category4_vegetarian.png",
      type: "vegetarian",
    },
    {
      src: "category5_Ketogenic.png",
      type: "ketogenic",
    },
    {
      src: "category6_all.png",
      type: "all",
    },
  ];
  categoryCards.forEach((card, index) => {
    const newElem = document.createElement("div");
    newElem.innerHTML = `<img
      src="/CookingMoment/images/index/${card.src}"  
      data-category="${card.type}"
      class =  "category-item"
      alt="${card.type}.png" /> `;
    category_menu.appendChild(newElem);
  });
  //以蔬食類別(vegetable)為預設類型
  category_menu
    .querySelector('[data-category="vegetable"]')
    .classList.add("selected");

  // Add indicator
  categoryCards.forEach((_, index) => {
    const indicatorElem = document.createElement("div");
    indicatorElem.className = myConst.ellipsisDotClassName;
    if (index == 0) indicatorElem.classList.add("active");
    indicatorElem.addEventListener("click", () => {
      currentIndex = index;
      updateCategoryMenu();
    });
    category_indicator.appendChild(indicatorElem);
  });

  function dragStart(e) {
    startPos = e.type == "touchstart" ? e.touches[0].clientX : e.clientX;
    isDragging = true;
    category_menu.style.transition = "none"; //原本的transition若設有動畫效果 將會有卡頓，所以拖拉過程先關掉
  }

  function drag(e) {
    if (!isDragging) return;
    const currentPosition =
      e.type == "touchmove" ? e.touches[0].clientX : e.clientX;
    const diff = currentPosition - startPos;

    //滑動的限制 1. index已經最左，還向右拉 2.想向左拉時，應該填滿container 不要拉出空位
    if (currentIndex === 0 && diff > 0) return;
    if (currentIndex + 2 >= categoryCards.length && diff < 0) return;

    currentTranslate = prevTranslate + diff;
    category_menu.style.transform = `translateX(${
      currentTranslate - currentIndex * countShiftX()
    }px)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    category_menu.style.transition = "transform 0.4s ease";

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -100 && currentIndex < categoryCards.length - 1) {
      let shiftN = Math.floor((movedBy * -1) / countShiftX()) + 1;
      currentIndex =
        currentIndex + shiftN >= categoryCards.length
          ? categoryCards.length - 1
          : currentIndex + shiftN;
    }

    if (movedBy > 100 && currentIndex > 0) {
      let shiftN = Math.floor(movedBy / countShiftX()) + 1;
      currentIndex = currentIndex - shiftN < 0 ? 0 : currentIndex - shiftN;
    }

    updateCategoryMenu();
  }

  category_menu.addEventListener("mousedown", (e) => {
    e.preventDefault();
    dragStart(e);
  });
  category_menu.addEventListener("touchstart", dragStart);

  category_menu.addEventListener("mousemove", drag);
  category_menu.addEventListener("touchmove", drag);

  category_menu.addEventListener("mouseup", dragEnd);
  category_menu.addEventListener("touchend", dragEnd);
  category_menu.addEventListener("mouseleave", dragEnd);
}
