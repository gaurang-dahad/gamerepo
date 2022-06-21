const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const dpi = window.devicePixelRatio;

const height = Number(
  getComputedStyle(canvas).getPropertyValue('height').slice(0, -2)
);
const width = Number(
  getComputedStyle(canvas).getPropertyValue('width').slice(0, -2)
);

canvas.setAttribute('height', height * dpi);
canvas.setAttribute('width', width * dpi);

// Code about the game starts below this

//BACKGROUND EFFECT SCRIPT STARTS

//here all the angles are stored in an array first. then these angles are used to create an array of points using trigonometry, where each point is stored as an object with 2 parameters x and y

class Shape {
  constructor(centre, sides, sideLength) {
    this.centre = centre;
    this.sides = sides;
    this.sideLength = sideLength;
    this.angles = [];
    //pushes the required angles (in radians) of vertices from the centre into the array
    for (let i = 0; i < sides; i++) {
      this.angles.push((i * 2 * Math.PI) / sides);
    }
  }

  //this function draws the element Shape (object) as required
  draw(sideLength) {
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    this.points = [];

    //defines the points which are to be connected in an object (one for each point) which are all stored in an array
    this.angles.forEach((angle) => {
      this.points.push({
        x: this.centre.x + sideLength * Math.sin(angle),
        y: this.centre.y + sideLength * Math.cos(angle),
      });
    });
    ctx.strokeStyle = 'white';
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let j = 1; j < this.points.length; j++) {
      ctx.lineTo(this.points[j].x, this.points[j].y);
    }
    ctx.closePath();
    ctx.stroke();
    this.fall();

    ctx.globalAlpha = 1;
  }

  //this function adds the rolling as well as the falling effect to the shapes
  fall() {
    let randomAngle = Math.random();
    //increases each angle by 1 degree, hence the effect of rotation
    for (let i = 0; i < this.angles.length; i++) {
      this.angles[i] += randomAngle / (10 * Math.PI);
      //for the falling effect
      this.centre.y += 0.25;
    }
  }
}

let shapeArray = [];

//this function generates random centre points, for each along with no. of sides (4 shapes each time) and then draws them by calling draw method on each
function generateRandomShapes() {
  const arrayShapeSides = [3, 4, 5, 6, 7];
  for (let i = 0; i < 6; i++) {
    shapeArray.push(
      new Shape(
        {
          x: Math.random() * canvas.width,
          y: (-1 * (Math.random() * canvas.height)) / 4,
        },
        arrayShapeSides[Math.floor(Math.random() * arrayShapeSides.length)],
        20
      )
    );
  }
  for (let i = 0; i < shapeArray.length; i++) {
    if (shapeArray[i].centre.y >= 1.2 * canvas.width) {
      shapeArray.slice(i);
    }
  }
}

function drawRandomShapes() {
  //this loop draws all the elements of the shapeArray
  shapeArray.forEach((shape) => {
    //console.log(shape);
    shape.draw(shape.sideLength);
  });
}

//END OF BACKGROUND EFFECT

//START OF THE BALL SCRIPT
class Ball {
  constructor(x = canvas.width / 2, y = 0.4 * canvas.height) {
    this.position = { x: x, y: y };
    this.velocity = { x: 0, y: 0 };
    this.radius = 12;
    this.score = 0;
  }
  draw() {
    //Text things: score and the death message is here
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 15px sans-serif';
    this.score = Math.max(this.score, 0);
    ctx.fillText(`Score: ${this.score}`, 15, 30);
    if (this.death()) {
      ctx.fillText(
        'You Died! Press Ctrl+R or F5 key to restart the game.',
        canvas.width / 2,
        canvas.height / 2
      );
    }

    //The drawing of the ball is below this
    ctx.beginPath();
    ctx.fillStyle = '#0f0';
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

  //conditions and result when the ball touches the ground
  groundCollide() {
    if (this.radius + this.position.y >= canvas.height) {
      //console.log(this.velocity.y);
      this.velocity.y -= 0.1;
      this.velocity.y *= -1;
    }
  }

  //checks collide between lines and the ball
  checkCollision(pos1, pos2, posball) {
    const length = Math.sqrt(
      (pos1.x - pos2.x) * (pos1.x - pos2.x) +
        (pos1.y - pos2.y) * (pos1.y - pos2.y)
    );
    const t =
      -(
        (pos1.x - posball.x) * (pos2.x - pos1.x) +
        (pos1.y - posball.y) * (pos2.y - pos1.y)
      ) /
      (length * length);
    if (0 <= t && t <= 1) {
      var d = Math.abs(
        (pos2.x - pos1.x) * (pos1.y - posball.y) -
          (pos2.y - pos1.y) * (pos1.x - posball.x)
      );
      d = d / length;
      if (d <= 20) {
        if (ball.velocity.y > 0) {
          ball.velocity.y = -1;
          var m = (pos2.y - pos1.y) / (pos2.x - pos1.x);
          m = Math.min(m, 100);
          ball.velocity.x = m;
          ball.velocity = this.unit(ball.vel);
          ball.velocity = this.mult(9, ball.vel);
          //Bounce_sound.play()
        }
      }
    }
  }

  //returns the unit vector of the input vector in form {x,y}
  unit(vector) {
    var magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    return this.mult(1 / magnitude, n);
  }

  //returns the multiplication of a scalar and a vector
  multiplication(scalar, vector) {
    return { x: scalar * vector.x, y: scalar * vector.y };
  }

  //returns vector1 - vector2 in {x,y}
  sub(vector1, vector2) {
    return { x: vector1.x - vector2.x, y: vector1.y - vector2.y };
  }

  //returns the dot product of vector1 and vector2
  dot(vector1, vector2) {
    return vector1.x * vector2.x + vector1.y * vector2.y;
  }

  //checks if the death has occured or not. NOTE -> only checks for condition
  death() {
    if (this.position.x < 0 || this.position.x > canvas.width) {
      return true;
    } else {
      return false;
    }
  }
}

const ball1 = new Ball();
ball1.draw();

/* requestAnimationFrame(ballfall);

function ballfall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball1.draw();
  ball1.move();

  requestAnimationFrame(ballfall);
} */

//END OF THE BALL SCRIPT

//THE SCRIPT FROM THE LINE STARTS HERE

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

//THE SCRIPT FOR LINE ENDS HERE

//ANIMATION SCRIPTS RUN HERE AS WELL AS THE MOUSE FUNCTIONS (HOVER AND CLICK)

generateRandomShapes();

setInterval(generateRandomShapes, 4000);

//window.requestAnimationFrame(animate);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRandomShapes();
  ball1.draw();
  ball1.move();
  //for animation loop
  window.requestAnimationFrame(animate);
}

//NEED TO CHECK HOW TO MAKE THE MOUSE FUNCTIONS AND THE ANIMATION WORK TOGETHER AT THE SAME TIME

canvas.addEventListener('mousemove', function (e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //console.log(e);
  coordinates = mousePosition(canvas, e);
  //console.log(coordinates);
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

//animate();
