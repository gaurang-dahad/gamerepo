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

class Ball {
  constructor(x = canvas.width / 2, y = 0.4 * canvas.height) {
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.radius = 30;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = '#f5e1fd';
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2,
      false
    );
    ctx.fill();
    ctx.closePath();
  }
  move() {
    this.groundCollide();
    this.position.y += this.velocity.y;
    this.velocity.y += 0.1;
  }
  groundCollide() {
    if (this.radius + this.position.y >= canvas.height) {
      //console.log(this.velocity.y);
      this.velocity.y -= 0.1;
      this.velocity.y *= -1;
    }
  }
}

const ball1 = new Ball();
ball1.draw();
/* 
requestAnimationFrame(ballfall);

function ballfall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball1.draw();
  ball1.move();

  requestAnimationFrame(ballfall);
} */
