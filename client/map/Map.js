// Initialize PIXI.js application
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
});
document.getElementById("game-container").appendChild(app.view);
let GameMap = document.getElementById("game-container");
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
let isResizing = true;

addEventListener("keydown", (event) => {});

onkeydown = (event) => {
  if (event.code === "Space") {
    isPanning = true;
  }
  if (event.code == "Shift") {
    isResizing = true;
  }
};
addEventListener("keyup", (event) => {});

onkeyup = (event) => {
  if (event.code === "Space") {
    isPanning = false;
  }
  if (event.code == "Shift") {
    isResizing = false;
  }
};

GameMap.addEventListener(
  "contextmenu",
  function (ev) {
    ev.preventDefault();
    return false;
  },
  false
);

function dropHandler(ev) {
  ev.preventDefault();
  console.log("File(s) dropped");
  console.log(ev);
  file = ev.dataTransfer.items[0].getAsFile();
  const reader = new FileReader();

  reader.onload = function (e) {
    let fileContent = e.target.result;
    let dragTexture = PIXI.Texture.from(String(fileContent));
    createSprite(dragTexture, ev.x - mapContainer.x, ev.y - mapContainer.y);
  };

  reader.readAsDataURL(file);
  // console.log(reader.result);
  // let dragTexture = PIXI.Texture.from(String(reader.result));
  // createSprite(dragTexture, ev.screenX, ev.screenY);
  // console.log("created");
}

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

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
  // sprite.anchor = (0.5, 0.5);
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
      sprite.x = sprite.x + deltaSX;
      sprite.y = sprite.y + deltaSY;
      lastX = event.data.global.x;
      lastY = event.data.global.y;
    }
  });

  sprite.on("pointerup", () => {
    sprite.x = 64 * Math.round(sprite.x / 64);
    sprite.y = 64 * Math.round(sprite.y / 64);
    isDragging = false;
    dragData = null;
  });

  sprite.on("pointerupoutside", () => {
    isDragging = false;
    dragData = null;
  });
  sprite.on("wheel", (event) => {
    console.log(event);
  });
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
  let tiles = [];

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
    const gridY = Math.floor(cameraY / tileSize) + 1;

    tiles.forEach((tile) => {
      let tileX = tile.position.x;
      let tileY = tile.position.y;
      if (
        tileX < cameraX - 2 * tileSize ||
        tileX > cameraX + viewportWidth ||
        tileY > cameraY + viewportHeight + tileSize ||
        tileY < cameraY - 2 * tileSize
      ) {
        gridContainer.removeChild(tile);
        const index = tiles.indexOf(tile);
        tiles.splice(index, 1);
        // tile.visible = false;
      }
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
            // tile.visible = true;
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

// window.addEventListener("resize", () => {
//   app.renderer.resize(window.innerWidth, window.innerHeight);
// });
