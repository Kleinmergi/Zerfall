import {Wuerfel, Balken} from "./classes.js";

let wuerfel = [];
let balken1, balken2;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('canvas-container');
background(0);
  for (let i = 0; i < 100; i++) {
    wuerfel.push(new Wuerfel(width / 10 * (i % 10), height / 10 * int(i / 10)));
  }
  balken1 = new Balken(width / 2, height / 3, width - 20, height / 3);
  balken2 = new Balken(width / 2, height * 2 / 3, width - 20, height / 3, true);
}

function draw() {
  background(0);
  for (let i = 0; i < wuerfel.length; i++) {
    wuerfel[i].show();
  }
  if (frameCount % 60 === 0) {
    for (let i = wuerfel.length - 1; i >= 0; i--) {
      if (wuerfel[i].wuerfeln() === 6) {
        wuerfel.splice(i, 1);
      }
    }
    balken1.addValue(wuerfel.length);
    let sechsen = 0;
    for (let i = 0; i < 100 - wuerfel.length; i++) {
      if (random(6) < 1) {
        sechsen++;
      }
    }
    balken2.addValue(sechsen);
  }
  balken1.show();
  balken2.show();
}
