const { Application, Container, Sprite, Texture } = PIXI;

let app, isKeyDown;

app = new PIXI.Application({
  backgroundAlpha: 1,
  width: innerWidth,
  height: innerHeight,
  antialias: true,
  resolution: window.devicePixelRatio || 1,
  resizeTo: window,
  autoDensity: true,
});
document.body.appendChild(app.view);

const stage = new Container();
app.stage.addChild(stage);

for (let x = 0; x < 100; x++)
  for (let y = 0; y < 100; y++) {
    const box = Sprite.from(Texture.WHITE);
    box.position.set(x * 16, y * 16);
    if (x % 2) box.tint = 0xffff;
    if (y % 2) box.tint = 0xfff59;
    stage.addChild(box);
  }

let startPos, lastPos, delta;
addEventListener("pointerdown", onDown);
addEventListener("pointermove", onMove);
addEventListener("pointerup", onUP);
addEventListener("wheel", onWheel);

function onDown(e) {
  isKeyDown = true;
  startPos = { x: e.x, y: e.y };
  lastPos = null;
}
function onMove(e) {
  if (!isKeyDown) return;
  if (!lastPos) delta = { x: startPos.x - e.x, y: startPos.y - e.y };
  else delta = { x: e.x - lastPos.x, y: e.y - lastPos.y };
  lastPos = { x: e.x, y: e.y };
  stage.x += delta.x;
  stage.y += delta.y;
}
function onUP(e) {
  isKeyDown = false;
}

const scaleSpeed = 0.1;
function onWheel(e) {
  let s = stage.scale.x,
    tx = (e.x - stage.x) / s,
    ty = (e.y - stage.y) / s;
  s += -1 * Math.max(-1, Math.min(1, e.deltaY)) * scaleSpeed * s;
  debugger;
  stage.setTransform(-tx * s + e.x, -ty * s + e.y, s, s);
}
