const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("color-palette-item");

ctx.strokeStyle = "#000000";
ctx.lineWidth = 2.5;
canvas.width = 640;
canvas.height = 400;

let paint = false;

const changeColor = (e) => {
    console.log(e.target.value);
    ctx.strokeStyle = e.target.value || "#000000";
};

Array.from(colors).forEach((color) => color.addEventListener("click", changeColor));

const notPaint = () => {
    paint = false;
};

const nowPaint = () => {
    paint = true;
};

const convasMouseMove = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (!paint) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
};

if (canvas) {
    // mouse event
    canvas.addEventListener("mousemove", convasMouseMove);
    canvas.addEventListener("mousedown", nowPaint);
    canvas.addEventListener("mouseup", notPaint);
    canvas.addEventListener("mouseleave", notPaint);
} else {
    console.log("오잉 캔버스가 없네요??");
}
