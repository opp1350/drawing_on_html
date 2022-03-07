// convas w, h
const canvasWidth = 640;
const canvasHeight = 400;

// canvas
const tempCanvas = document.getElementById("canvas");
const tempCtx = tempCanvas.getContext("2d");
tempCanvas.width = canvasWidth;
tempCanvas.height = canvasHeight;

// elements
const lineColors = document.querySelectorAll(".line-color");
const bgColors = document.querySelectorAll(".bg-color");
const reset = document.getElementById("reset-canvas");
const downloadCanvas = document.getElementById("save-canvas");
const tools = document.querySelectorAll(".tools-item");
// controller
const widthController = document.getElementById("width-controller");

// Temp canvas
// 실제 그림은 여기서 그려짐
const canvas = document.getElementById("tempCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// default style
ctx.strokeStyle = "#000000";
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.lineWidth = 2.5;
ctx.lineCap = "round";

// Temp canvas default style
// 지우개 용도
tempCtx.lineWidth = 2.5;
tempCtx.lineCap = "round";

// status
let painting = false;
let tool = "pencil";

// Mousedown Event Start Point
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
    document.querySelector(".selected-color.line").style.backgroundColor = e.target.value;
};

const changeBgColor = (e) => {
    console.log(e.target.value);
    ctx.fillStyle = e.target.value;
    document.querySelector(".selected-color.bg").style.backgroundColor = e.target.value;
};

const notPaint = (e) => {
    painting = false;
    ctx.globalCompositeOperation = "source-over";
    tempCtx.globalCompositeOperation = "source-over";
    imgUpdate();
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
        tempCtx.beginPath(); // 새로운 경로 생성 (지우개용)
        ctx.moveTo(x, y); // 시작 위치를 명확히 지정
    } else {
        // 도형 그리기용 정보
        const figureX = Math.min(startX, x),
            figureY = Math.min(startY, y),
            w = Math.max(startX, x) - figureX,
            h = Math.max(startY, y) - figureY;
        // tools
        if (tool === "pencil") {
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (tool === "eraser") {
            tempCtx.globalCompositeOperation = "destination-out";
            tempCtx.lineTo(x, y);
            tempCtx.stroke();
        } else if (tool === "rectangle") {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeRect(figureX, figureY, w, h);
            ctx.fillRect(figureX + ctx.lineWidth / 2, figureY + ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
        } else if (tool === "ellipse") {
            ctx.beginPath(); // 없으면 마우스를 따라 원이 중첩되며 출력
            ctx.ellipse(figureX, figureY, w, h, Math.PI * 2, 0, Math.PI * 2);
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.stroke();
            ctx.fill();
        } else if (tool === "triangle") {
            console.log("triangle");
        } else {
            alert("아직 제공하지 않는 도구입니다.");
            tool = "pencil"; // pencil로 초기화
        }
    }
};

const download = () => {
    const img = tempCanvas.toDataURL("image/jpeg", 1);
    const link = document.createElement("a");
    link.href = img;
    link.download = "my_awesome_painting";
    link.click();
};

const resetCanvas = () => {
    const confirmReset = confirm("진행중인 작업이 전부 사라집니다.");
    if (confirmReset) {
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else return;
};

const changeTools = (e) => {
    console.log(e.target.value);
    tool = e.target.value;
    if (tool === "eraser") {
        document.getElementById("controller-target").innerHTML = "지우개";
        document.getElementById("width-value").innerHTML = tempCtx.lineWidth;
    } else {
        document.getElementById("controller-target").innerHTML = "선";
        document.getElementById("width-value").innerHTML = ctx.lineWidth;
    }
};

const changeLineWidth = () => {
    if (tool === "eraser") {
        tempCtx.lineWidth = widthController.value;
        document.getElementById("width-value").innerHTML = widthController.value;
    } else {
        ctx.lineWidth = widthController.value;
        document.getElementById("width-value").innerHTML = widthController.value;
    }
};

// Add Event Listener
if (tempCanvas && canvas) {
    // mouse event
    canvas.addEventListener("mousemove", convasMouseMove);
    canvas.addEventListener("mousedown", nowPaint);
    canvas.addEventListener("mouseup", notPaint);
    canvas.addEventListener("mouseleave", notPaint);
    //touch event
    canvas.addEventListener("touchstart", notPaint);
    canvas.addEventListener("touchmove", convasMouseMove);
    canvas.addEventListener("touchend", notPaint);
} else {
    alert("생성된 캔버스가 없습니다.");
}

lineColors.forEach((color) => color.addEventListener("click", changeLineColor));
bgColors.forEach((color) => color.addEventListener("click", changeBgColor));
tools.forEach((tool) => tool.addEventListener("click", changeTools));
reset.addEventListener("click", resetCanvas);
downloadCanvas.addEventListener("click", download);
widthController.addEventListener("change", changeLineWidth);
