// convas w, h
const canvasWidth = 640;
const canvasHeight = 400;

// elements
const lineColors = document.querySelectorAll(".line-color");
const bgColors = document.querySelectorAll(".bg-color");
const reset = document.getElementById("reset-canvas");
const downloadCanvas = document.getElementById("save-canvas");
const loadImg = document.getElementById("load-image");
const tools = document.querySelectorAll(".tools-item");
// controller
const widthController = document.getElementById("width-controller");

// Canvas
// 그림이 나타나는 캔버스
const tempCanvas = document.getElementById("canvas");
const tempCtx = tempCanvas.getContext("2d");
tempCanvas.width = canvasWidth;
tempCanvas.height = canvasHeight;
// Canvas : eraser style
tempCtx.lineWidth = 2.5;
tempCtx.lineCap = "round";

// Temp Canvas
// 실제 그림이 그려지는 캔버스
const canvas = document.getElementById("tempCanvas");
const ctx = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
// Temp canvas : default style
ctx.strokeStyle = "#000000";
ctx.fillStyle = "#ffffff";
ctx.lineWidth = 2.5;
ctx.lineCap = "round";

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
    ctx.strokeStyle = e.target.value;
    document.querySelector(".selected-color.line").style.backgroundColor = e.target.value;
};

const changeBgColor = (e) => {
    ctx.fillStyle = e.target.value;
    document.querySelector(".selected-color.bg").style.backgroundColor = e.target.value;
};

const notPaint = () => {
    painting = false;
    tempCtx.globalCompositeOperation = "source-over";
    imgUpdate();
};

const nowPaint = (e) => {
    painting = true;
    startX = e.offsetX;
    startY = e.offsetY;
    if (tool === "pencil") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX, startY);
        ctx.stroke();
    }
};

const convasMouseMove = (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    if (!painting) {
        ctx.beginPath(); // 새로운 경로 생성
        ctx.moveTo(x, y); // 시작 위치를 명확히 지정
        if (tool === "eraser") {
            tempCtx.beginPath(); // 새로운 경로 생성 (지우개용)
            tempCtx.moveTo(x, y);
        }
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
            console.log("convasMouseMove");
        } else if (tool === "eraser") {
            tempCtx.globalCompositeOperation = "destination-out";
            tempCtx.lineTo(x, y);
            tempCtx.stroke();
        } else if (tool === "rectangle") {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.strokeRect(figureX, figureY, w, h);
            ctx.fillRect(figureX + ctx.lineWidth / 2, figureY + ctx.lineWidth / 2, w - ctx.lineWidth, h - ctx.lineWidth);
        } else if (tool === "ellipse") {
            ctx.beginPath();
            ctx.ellipse(figureX, figureY, w, h, Math.PI * 2, 0, Math.PI * 2);
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.stroke();
            ctx.fill();
        } else {
            alert("아직 제공하지 않는 도구입니다.");
            tool = "pencil";
        }
    }
};

const download = () => {
    const newCanvas = canvas.cloneNode(true);
    const newCanvasCtx = newCanvas.getContext("2d");
    newCanvasCtx.fillStyle = "#FFF";
    newCanvasCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    newCanvasCtx.drawImage(tempCanvas, 0, 0);
    const img = newCanvas.toDataURL("image/jpeg", 1);
    const link = document.createElement("a");
    link.href = img;
    link.download = "my_awesome_painting";
    link.click();
};

const resetCanvas = () => {
    const confirmReset = confirm("진행중인 작업이 전부 사라집니다.");
    if (confirmReset) {
        tempCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    } else return;
};

const changeTools = (e) => {
    tool = e.target.value;
    if (tool === "eraser") {
        document.getElementById("controller-target").innerHTML = "지우개";
        document.getElementById("width-value").innerHTML = tempCtx.lineWidth;
        widthController.value = tempCtx.lineWidth;
    } else {
        document.getElementById("controller-target").innerHTML = "선";
        document.getElementById("width-value").innerHTML = ctx.lineWidth;
        widthController.value = ctx.lineWidth;
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

const resettingImg = (e) => {
    e.target.value = null;
};

const loadingImg = (e) => {
    if (e.target.files[0] !== null) {
        const reader = new FileReader(); // 파일 읽어오기
        const img = new Image(); // 이미지 Base64

        reader.readAsDataURL(e.target.files[0]); // 파일 arr로 저장되기 때문에 [0]
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                if (img.width >= canvasWidth && img.height >= canvasHeight) {
                    if (img.height >= img.width) {
                        img.width = canvasHeight * (img.width / img.height);
                        img.height = canvasHeight;
                        ctx.drawImage(img, canvasWidth / 2 - img.width / 2, canvasHeight / 2 - img.height / 2, img.width, img.height);
                    } else {
                        img.height = canvasWidth * (img.height / img.width);
                        img.width = canvasWidth;
                        ctx.drawImage(img, canvasWidth / 2 - img.width / 2, canvasHeight / 2 - img.height / 2, img.width, img.height);
                    }
                } else {
                    ctx.drawImage(img, canvasWidth / 2 - img.width / 2, canvasHeight / 2 - img.height / 2);
                }
            };
        };
    } else return;
};

// Add Event Listener
if (tempCanvas && canvas) {
    // mouse event
    canvas.addEventListener("mousemove", convasMouseMove);
    canvas.addEventListener("mousedown", nowPaint);
    canvas.addEventListener("mouseup", notPaint);
    canvas.addEventListener("mouseleave", notPaint);
} else {
    alert("생성된 캔버스가 없습니다.");
}
lineColors.forEach((color) => color.addEventListener("click", changeLineColor));
bgColors.forEach((color) => color.addEventListener("click", changeBgColor));
tools.forEach((tool) => tool.addEventListener("click", changeTools));
loadImg.addEventListener("change", loadingImg);
loadImg.addEventListener("click", resettingImg);
reset.addEventListener("click", resetCanvas);
downloadCanvas.addEventListener("click", download);
widthController.addEventListener("change", changeLineWidth);
