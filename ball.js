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
    this.radius = 20;
    this.score = 0;
  }
  draw() {
    //Text things: score and the death message is here
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 15px sans-serif';
    this.score = Math.max(this.score, 0);
    ctx.fillText(`Score: ${this.score}`, 20, 40);
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

requestAnimationFrame(ballfall);

function ballfall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball1.draw();
  ball1.move();

  requestAnimationFrame(ballfall);
}
