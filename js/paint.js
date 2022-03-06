const tempCanvas = document.getElementById("canvas");
const tempCtx = tempCanvas.getContext("2d");

// elements
const lineColors = document.querySelectorAll(".line-color");
const bgColors = document.querySelectorAll(".bg-color");
const reset = document.getElementById("reset-canvas");
const drawRect = document.getElementById("rectangle");
const drawLine = document.getElementById("pencil");

// Create Temp canvas
// 실제 그림은 여기서 그려짐
const container = tempCanvas.parentNode; // .canvas-wrapper
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.id = "imageTemp";
canvas.width = tempCanvas.width;
canvas.height = tempCanvas.height;
container.appendChild(canvas);

// canvas
tempCanvas.width = 640;
tempCanvas.height = 400;

// default style
ctx.strokeStyle = "#000000";
ctx.fillStyle = "#ffffff";
ctx.lineWidth = 2.5;
ctx.lineCap = "round";

// status
let painting = false;
let tool = "pencil";

// w, y
let startX = 0;
let startY = 0;

const imgUpdate = () => {
    // 보여지는 tempCtx에 canvas를 update
    tempCtx.drawImage(canvas, 0, 0);
    // clearRect를 하지 않으면 선이 2개로 겹쳐보임
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const changeLineColor = (e) => {
    console.log(e.target.value);
    ctx.strokeStyle = e.target.value;
};

const changeBgColor = (e) => {
    console.log(e.target.value);
    ctx.fillStyle = e.target.value;
};

const notPaint = (e) => {
    painting = false;
    imgUpdate();
    console.log("imgUpdate");
};

const nowPaint = (e) => {
    painting = true;
    startX = e.offsetX;
    startY = e.offsetY;
};

const convasMouseMove = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (!painting) {
        ctx.beginPath(); // 새로운 경로 생성
        ctx.moveTo(x, y); // 시작 위치를 명확히 지정
    } else {
        if (tool === "pencil") {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (tool === "rectangle") {
            const recX = Math.min(startX, x),
                recY = Math.min(startY, y),
                w = Math.max(startX, x) - recX,
                h = Math.max(startY, y) - recY;
            // console.log(recX, recY, w, h, ctx.strokeStyle, ctx.fillStyle);
            ctx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.strokeRect(recX, recY, w, h);
            ctx.fillRect(recX + ctx.lineWidth / 2, recY + ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
        } else {
            alert("아직 제공하지 않는 도구입니다.");
            tool = "pencil"; // pencil로 초기화
        }
    }
};

const resetCanvas = () => {
    const confirmReset = confirm("진행중인 작업이 전부 사라집니다.");
    if (confirmReset) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else return;
};

const drawingRect = () => {
    tool = "rectangle";
};

const drawingLine = () => {
    tool = "pencil";
};

// Add Event Listener
if (tempCanvas) {
    // mouse event
    canvas.addEventListener("mousemove", convasMouseMove);
    canvas.addEventListener("mousedown", nowPaint);
    canvas.addEventListener("mouseup", notPaint);
    canvas.addEventListener("mouseleave", notPaint);
} else {
    console.log("오잉 캔버스가 없네요??");
}

lineColors.forEach((color) => color.addEventListener("click", changeLineColor));
bgColors.forEach((color) => color.addEventListener("click", changeBgColor));
reset.addEventListener("click", resetCanvas);
drawRect.addEventListener("click", drawingRect);
drawLine.addEventListener("click", drawingLine);
