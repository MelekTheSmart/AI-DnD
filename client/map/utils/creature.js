var LOADEDSPRITES = {};

function outlineSprite(sprite) {
  // this could still be improved, but that's okay
  const outline = new PIXI.Graphics();
  outline.lineStyle(2, 0x00ffff); // Green border, 2px thick
  outline.drawRect(
    -sprite.width / 2,
    -sprite.height / 2,
    sprite.width,
    sprite.height
  ); // x, y, width, height\
  // outline.visible = false;
  outline.interactive = true;
  outline.buttonMode = true;
  outline.width = sprite.width;
  outline.height = sprite.height;
  const rotateHandle = new PIXI.Graphics();
  rotateHandle.interactive = true;
  rotateHandle.buttonMode = true;
  rotateHandle.lineStyle(2, 0x00ffff);
  rotateHandle.beginFill(0x00ffff);
  rotateHandle.drawCircle(
    -outline.width / 4 + 100,
    -outline.height / 2 - 10,
    10,
    10
  );
  rotateHandle.endFill();
  let vars = {
    0: {
      x: -outline.width / 2 - 10,
      y: -outline.height /2 - 10,
      directionx: -1,
      directiony: -1
    },
    1: {
      x: outline.width / 2,
      y: -outline.height / 2 - 10,
      directionx: 1,
      directiony: -1
    },
    2: {
      x: -outline.width / 2 - 10,
      y: outline.height /2,
      directionx: -1,
      directiony: 1
    },
    3: {
      x: outline.width / 2,
      y: outline.height /2,
      directionx: 1,
      directiony: 1
    }
  }

  for (let i = 0; i < 4; i++) {
    const resizeHandle = new PIXI.Graphics();
    resizeHandle.interactive = true;
    resizeHandle.buttonMode = true;
    resizeHandle.lineStyle(2, 0x00ffff);
    resizeHandle.beginFill(0x00ffff);
    
    let { x, y, directionx, directiony } = vars[i];

    resizeHandle.drawRect(
      x,
      y,
      10,
      10
    );
    resizeHandle.on("mousedown", () => {
      state.directionx = directionx;
      state.directiony = directiony;
    });

    resizeHandle.endFill();
    resizeHandle.on("mousedown", (event) => {
      resizeTarget = sprite;
      lastSizeX = event.data.global.x;
      lastSizeY = event.data.global.y;
      state.isResizing = true;
      mouseOffsetX = event.global.x;
      mouseOffsetY = event.global.y;
    });
    resizeHandle.on("mouseup", (event) => {
      state.isResizing = false;
      console.log("disabled");
    });
    resizeHandle.on("mouseupoutside", (event) => {
      state.isResizing = false;
    });

    outline.addChild(resizeHandle);
  }
}

async function createSprite(textureLocation, eventMode, cached=true) {
  // uses eventmode instead of sprite.interactive and sprite.button
  if (!(textureLocation in LOADEDSPRITES) || (cached)) {
    var spriteTexture = await PIXI.Assets.load(textureLocation);
    LOADEDSPRITES[textureLocation] = spriteTexture;
  }
  else {
    var spriteTexture = LOADEDSPRITES[textureLocation];
  }
  console.log(spriteTexture);
  let sprite = new PIXI.Sprite(spriteTexture);
  sprite.anchor.set(0.5);
  return sprite;
}

function createNode(diameter) {
  let node = new PIXI.Graphics()
    .lineStyle(2, 0x004400) 
    .drawCircle(0, 0, diameter, diameter)
  return node;
}

async function Creature(creature, state) {
  // the job of createSprite and createNode is not to provide our sprites with the obj.on() functionalities they need.
  // that should be done here.
  let spriteContainer = new PIXI.Container()
  spriteContainer.creatureRef = creature;
  spriteContainer.position = creature.position;
  let texture = creature.sprite;
  let sprite = await createSprite(texture);
  let node = createNode();
  spriteContainer.addChild(sprite);
  spriteContainer.addChild(node);
  return spriteContainer;
}


let app = new PIXI.Application({
  width: 400, height: 400, backgroundColor: 0xccccff
})
let c = Creature({position: [0, 0], sprite: "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg" })
app.stage.addChild(c);
document.body.appendChild(app.view);
