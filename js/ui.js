const lineColorBtns = document.querySelectorAll(".line-color");
const bgColorBtns = document.querySelectorAll(".bg-color");
const toolsBtns = document.querySelectorAll(".tools-item");

const addActiveClass = (e) => {
    const targetLength = e.target.parentNode.children.length;
    for (let i = 0; i < targetLength; i++) {
        e.target.parentNode.children[i].classList.remove("active");
    }
    e.target.classList.add("active");
};

lineColorBtns.forEach((item) => item.addEventListener("click", addActiveClass));
bgColorBtns.forEach((item) => item.addEventListener("click", addActiveClass));
toolsBtns.forEach((item) => item.addEventListener("click", addActiveClass));
