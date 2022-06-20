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
  for (let i = 0; i < 4; i++) {
    shapeArray.push(
      new Shape(
        {
          x: Math.random() * canvas.width,
          y: (-1 * (Math.random() * canvas.height)) / 4,
        },
        arrayShapeSides[Math.floor(Math.random() * arrayShapeSides.length)],
        40
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

generateRandomShapes();

setInterval(generateRandomShapes, 4000);

window.requestAnimationFrame(animate);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRandomShapes();
  //for animation loop
  window.requestAnimationFrame(animate);
}
