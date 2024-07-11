// Initialize PIXI.js application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
});
document.getElementById("game-container").appendChild(app.view);

// Create a container for the map
const mapContainer = new PIXI.Container();
app.stage.addChild(mapContainer);

const texture = PIXI.Texture.from("GridPNG.png");
const gridContainer = new PIXI.Container();
mapContainer.addChild(gridContainer);

mapContainer.interactive = true;
mapContainer.buttonMode = true;
mapContainer.sortableChildren = true;
let isPanning = false;

addEventListener("keydown", (event) => {});

onkeydown = (event) => {
  if (event.code === "Space") {
    isPanning = true;
  }
};
addEventListener("keyup", (event) => {});

onkeyup = (event) => {
  if (event.code === "Space") {
    isPanning = false;
  }
};

let isMapDragging = false;
let isDragging = false;
let lastMapX = 0;
let lastMapY = 0;
let lastX = 0;
let lastY = 0;

mapContainer.on("pointerdown", (event) => {
  if (isPanning) {
    isMapDragging = true;
    lastMapX = event.data.global.x;
    lastMapY = event.data.global.y;
  }
});

mapContainer.on("pointermove", (event) => {
  if (isMapDragging && isPanning) {
    console.log(isDragging);
    const deltaX = event.data.global.x - lastMapX;
    const deltaY = event.data.global.y - lastMapY;
    mapContainer.x += deltaX;
    mapContainer.y += deltaY;
    lastMapX = event.data.global.x;
    lastMapY = event.data.global.y;
  }
});

mapContainer.on("pointerup", () => {
  isMapDragging = false;
});

mapContainer.on("pointerupoutside", () => {
  isMapDragging = false;
});
let counter = 0;
function createSprite(texture, x, y) {
  const sprite = new PIXI.Sprite(texture);
  sprite.position.set(x, y);
  sprite.interactive = true;
  sprite.buttonMode = true;

  let isDragging = false;
  let dragData = null;

  sprite.on("mousedown", (event) => {
    if (!isPanning) {
      console.log(mapContainer.children);
      mapContainer.setChildIndex(sprite, mapContainer.children.length - 1);
      isDragging = true;
      isMapDragging = false;
      dragData = event.data;
      lastX = event.data.global.x;
      lastY = event.data.global.y;
    }
  });
  sprite.on("rightclick", (event) => {
    console.log(sprite);
  });

  sprite.on("pointermove", (event) => {
    if (isDragging) {
      const deltaSX = event.data.global.x - lastX;
      const deltaSY = event.data.global.y - lastY;
      sprite.x += deltaSX;
      sprite.y += deltaSY;
      lastX = event.data.global.x;
      lastY = event.data.global.y;
    }
  });

  sprite.on("pointerup", () => {
    isDragging = false;
    dragData = null;
  });

  sprite.on("pointerupoutside", () => {
    isDragging = false;
    dragData = null;
  });
  if (counter !== 1) {
    sprite.zIndex = 100;
    console.log(sprite);
  }
  counter = 1;
  mapContainer.addChild(sprite);
  return sprite;
}

const spriteTexture = PIXI.Texture.from("sample.png");

createSprite(spriteTexture, 200, 200);
createSprite(spriteTexture, 300, 300);
createSprite(spriteTexture, 700, 700);

// Load the texture using PIXI loader
const loader = PIXI.Loader.shared;
loader.add("tile", "GridONE.png");
loader.load(setup);

function setup(loader, resources) {
  const tileSize = 64;
  const viewportWidth = app.screen.width;
  const viewportHeight = app.screen.height;

  const texture = resources.tile.texture;
  const tiles = [];

  // Function to create a tile
  function createTile(x, y) {
    const tile = new PIXI.Sprite(texture);
    tile.anchor.set(0.5);
    tile.position.set(x, y);
    gridContainer.addChild(tile);
    gridContainer.setChildIndex(tile, 0);
    return tile;
  }

  app.ticker.add(() => {
    const cameraX = -mapContainer.x;
    const cameraY = -mapContainer.y;

    const gridX = Math.floor(cameraX / tileSize);
    console.log(cameraX, tileSize);
    const gridY = Math.floor(cameraY / tileSize);

    tiles.forEach((tile) => {
      let tileX = tile.position.x;
      let tileY = tile.position.y;
    });

    for (
      let row = gridY - 1;
      row <= gridY + Math.ceil(viewportHeight / tileSize);
      row++
    ) {
      for (
        let col = gridX - 1;
        col <= gridX + Math.ceil(viewportWidth / tileSize);
        col++
      ) {
        let tileExists = false;
        for (let tile of tiles) {
          if (
            tile.position.x === col * tileSize &&
            tile.position.y === row * tileSize
          ) {
            tileExists = true;
            break;
          }
        }
        if (!tileExists) {
          const newTile = createTile(col * tileSize, row * tileSize);
          tiles.push(newTile);
        }
      }
    }
  });
}

window.addEventListener("resize", () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});
