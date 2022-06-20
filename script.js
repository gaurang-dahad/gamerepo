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
