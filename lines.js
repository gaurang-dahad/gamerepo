const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

//required stuff below this. delete the code that lies above later
const dpi = window.devicePixelRatio;

const screenHeight = Number(
  getComputedStyle(canvas).getPropertyValue('height').slice(0, -2)
);
const screenWidth = Number(
  getComputedStyle(canvas).getPropertyValue('width').slice(0, -2)
);

canvas.setAttribute('height', screenHeight * dpi);
canvas.setAttribute('width', screenWidth * dpi);

// Code about the game starts below this

class Lines {
  constructor() {
    this.points = [
      { x: 0, y: canvas.height },
      { x: 0, y: canvas.width },
      { x: canvas.width / 2, y: canvas.height },
    ];
    this.currentPoint = { x: canvas.width / 2, y: canvas.height };
  }

  hoverLine(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 0.75;
    ctx.moveTo(this.currentPoint.x, this.currentPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  //draws lines between points that have been previously clicked
  drawLines() {
    ctx.beginPath();
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2;
    //ctx.moveTo(0, canvas.height);
    //ctx.lineTo(canvas.width, canvas.height / 2);
    for (let i = 0; i < this.points.length - 1; i++) {
      //ctx.strokeStyle = '#1b0324';
      //ctx.lineWidth = 2.5;
      //ctx.moveTo(this.points[i].x, this.points[i].y);
      ctx.lineTo(this.points[i + 1].x, this.points[i + 1].y);
      ctx.stroke();
    }
  }

  //corner decorations
  drawCorners() {
    for (let i = 2; i < this.points.length; i++) {
      //ctx.moveTo(this.points[i].x, this.points[i].y);
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.linewidth = 10;
      ctx.arc(this.points[i].x, this.points[i].y, 10, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#1B0324';
      ctx.arc(this.points[i].x, this.points[i].y, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

let line1 = new Lines();

canvas.addEventListener('mousemove', function (e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //console.log(e);
  coordinates = mousePosition(canvas, e);
  line1.hoverLine(coordinates.x, coordinates.y);
  line1.drawLines();
  line1.drawCorners();
});

function mousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  //console.log(x, y);
  return { x: x, y: y };
}

canvas.addEventListener('click', function (event) {
  let rect = canvas.getBoundingClientRect();
  let clickX = event.clientX - rect.left;
  let clickY = event.clientY - rect.top;
  line1.currentPoint.x = clickX;
  line1.currentPoint.y = clickY;
  line1.points.push({ x: clickX, y: clickY });

  //console.log(line1.points);
  line1.drawLines();
  line1.drawCorners();
});
