function initApp() {
  // Initialize PIXI.js application

  let gameWindow = document.getElementById("game-container");
  let html = document.documentElement;

  var state = GameState(gameWindow, html, []);

  let app = new PIXI.Application({
    width: state.getWidth(),
    height: state.getHeight(),
    backgroundColor: 0x1099bb,
  });

  // I would like to initialize all the variables 'state' needs in one function rather than spreading them out here.

  state.app = app;

  state.window.appendChild(state.app.view); // app.view is a canvas element

  state.tileSize = 128;

  state.isResizing = false;

  state.isPanning = false;

  state.dragTarget = null;

  state.rotateTarget = null;

  dragAndDropInit(state.window, state);
  return state;
}
function createSprite(texture, x, y, state) {
  const sprite = new PIXI.Sprite(texture);
  // sprite.position.set(x, y);
  sprite.anchor.set(0.5);
  sprite.interactiveChildren = true;
  let isDragging = false;
  let dragData = null;

  const outline = new PIXI.Graphics();
  outline.lineStyle(2, 0x00ffff); // Green border, 2px thick
  outline.drawRect(
    -sprite.width / 2,
    -sprite.height / 2,
    sprite.width,
    sprite.height
  ); // x, y, width, height\
  // outline.visible = false;
  outline.width = sprite.width;
  outline.height = sprite.height;
  const rotateHandle = new PIXI.Graphics();
  rotateHandle.interactive = true;
  rotateHandle.buttonMode = true;
  rotateHandle.lineStyle(2, 0x00ffff);
  rotateHandle.beginFill(0x00ffff);
  rotateHandle.drawCircle(0, -outline.height / 2 - 10, 10, 10);
  rotateHandle.endFill();
  rotateHandle.on("mousedown", (event) => {
    state.rotateTarget = sprite;
    lastSizeX = event.data.global.x;
    lastSizeY = event.data.global.y;
    mouseOffsetX = event.global.x;
    mouseOffsetY = event.global.y;
  });
  let vars = {
    0: {
      x: -outline.width / 2 - 10,
      y: -outline.height / 2 - 10,
      directionx: -1,
      directiony: -1,
    },
    1: {
      x: outline.width / 2,
      y: -outline.height / 2 - 10,
      directionx: 1,
      directiony: -1,
    },
    2: {
      x: -outline.width / 2 - 10,
      y: outline.height / 2,
      directionx: -1,
      directiony: 1,
    },
    3: {
      x: outline.width / 2,
      y: outline.height / 2,
      directionx: 1,
      directiony: 1,
    },
  };

  for (let i = 0; i < 4; i++) {
    const resizeHandle = new PIXI.Graphics();
    resizeHandle.interactive = true;
    resizeHandle.buttonMode = true;
    resizeHandle.lineStyle(2, 0x00ffff);
    resizeHandle.beginFill(0x00ffff);

    let { x, y, directionx, directiony } = vars[i];

    resizeHandle.drawRect(x, y, 10, 10);
    resizeHandle.on("mousedown", () => {
      state.directionx = directionx;
      state.directiony = directiony;
    });

    resizeHandle.endFill();
    resizeHandle.addEventListener("mousedown", (event) => {
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
  outline.addChild(rotateHandle);
  // Rectangle with fill and border
  const spriteCont = new PIXI.Container();
  const core = new PIXI.Container();
  core.interactive = true;
  spriteCont.interactiveChildren = true;
  spriteCont.x = x;
  spriteCont.y = y;
  console.log(spriteCont.width);
  const outline_rect = new PIXI.Graphics();
  outline_rect.lineStyle(2, 0x00ff00); // Green border, 2px thick
  outline_rect.drawRect(0, 0, spriteCont.width, spriteCont.height); // x, y, width, height
  spriteCont.addChild(outline_rect);
  const node = new PIXI.Graphics();
  node.lineStyle(2, 0x00ff00); // Green border, 2px thick
  node.drawCircle(0, 0, state.tileSize / 2, state.tileSize / 2); // x, y, width, height
  node.hitArea = new PIXI.Circle(0, 0, state.tileSize / 2, state.tileSize / 2);
  node.visible = true;
  node.interactive = true;
  node.buttonMode = true;
  node.on("mousedown", (event) => {
    if (true) {
      state.dragTarget = spriteCont;
      actualX = spriteCont.x;
      actualY = spriteCont.y;
      isDragging = true;
      console.log(state.mapContainer.children);
      state.mapContainer.setChildIndex(
        spriteCont,
        state.mapContainer.children.length - 1
      );
      spriteCont.alpha = 0.5;
      dragData = event.data;
      state.lastX = event.data.global.x;
      state.lastY = event.data.global.y;
    }
  });
  spriteCont.addChild(sprite);
  spriteCont.addChild(node);
  spriteCont.addChild(core);
  sprite.addChild(outline);
  core.on("globalpointermove", (event) => {
    if (spriteCont.getBounds().contains(event.global.x, event.global.y)) {
      node.visible = true;
    } else {
      node.visible = false;
    }
  });

  spriteCont.on("pointerup", () => {
    if (isDragging) {
      spriteCont.x = state.tieSize * Math.round(spriteCont.x / state.tieSize);
      spriteCont.y = state.tieSize * Math.round(spriteCont.y / state.tieSize);
      spriteCont.alpha = 1;
      isDragging = false;
      dragData = null;
    }
  });

  sprite.on("pointerupoutside", () => {
    isDragging = false;
    dragData = null;
  });
  sprite.on("wheel", (event) => {
    console.log(event);
  });
  // spriteCont.hitArea = new PIXI.Circle(0, 0, 32, 32);
  state.mapContainer.addChild(spriteCont);
}
async function initMapContainer(state) {
  let mapContainer = new PIXI.Container();
  state.app.stage.addChild(mapContainer);

  let gridContainer = new PIXI.Container();

  gridContainer.tileTexture = await PIXI.Assets.load("GridONE.png");

  gridContainer.tiles = [];

  gridContainer.createTile = function (x, y) {
    const tile = new PIXI.Sprite(this.tileTexture);
    tile.anchor.set(0.5);
    tile.position.set(x, y);
    tile.width = state.tileSize;
    tile.height = state.tileSize;
    this.addChild(tile);
    this.setChildIndex(tile, 0);
    return tile;
  };

  mapContainer.addChild(gridContainer);
  mapContainer.interactive = true;
  mapContainer.buttonMode = true;
  mapContainer.sortableChildren = true;
  mapContainer.isDragging = false;

  mapContainer.gridContainer = gridContainer;
  mapContainer.on("pointerdown", (event) => {
    if (state.isPanning) {
      mapContainer.isDragging = true;
      lastMapX = event.data.global.x;
      lastMapY = event.data.global.y;
    }
  });

  mapContainer.on("pointermove", (event) => {
    if (mapContainer.isDragging && state.isPanning) {
      const deltaX = event.data.global.x - lastMapX;
      const deltaY = event.data.global.y - lastMapY;
      mapContainer.x += deltaX;
      mapContainer.y += deltaY;
      lastMapX = event.data.global.x;
      lastMapY = event.data.global.y;
    }
  });
  mapContainer.on("mousemove", (event) => {
    if (state.isResizing) {
      const deltaSX = event.data.global.x - lastSizeX;
      const deltaSY = event.data.global.y - lastSizeY;
      if (Math.abs(deltaSX) > Math.abs(deltaSY)) {
        resizeTarget.width =
          resizeTarget.width + deltaSX * 1.2 * state.directionx;
        resizeTarget.height =
          resizeTarget.height + deltaSX * 1.2 * state.directionx;
      } else if (Math.abs(deltaSX) < Math.abs(deltaSY)) {
        resizeTarget.width =
          resizeTarget.width + deltaSY * 1.2 * state.directiony;
        resizeTarget.height =
          resizeTarget.height + deltaSY * 1.2 * state.directiony;
      }
      lastSizeX = event.data.global.x;
      lastSizeY = event.data.global.y;
    }
    if (state.dragTarget) {
      const deltaSX = event.data.global.x - state.lastX;
      const deltaSY = event.data.global.y - state.lastY;
      state.dragTarget.x = state.dragTarget.x + deltaSX;
      state.dragTarget.y = state.dragTarget.y + deltaSY;
      actualX = actualX + deltaSX;
      actualY = actualY + deltaSY;
      state.dragTarget.x =
        state.tileSize * Math.round(actualX / state.tileSize);
      state.dragTarget.y =
        state.tileSize * Math.round(actualY / state.tileSize);
      state.lastX = event.data.global.x;
      state.lastY = event.data.global.y;
    }
    if (state.rotateTarget) {
      state.rotateTarget.rotation =
        Math.atan2(
          event.global.y - state.rotateTarget.getGlobalPosition().y,
          event.global.x - state.rotateTarget.getGlobalPosition().x
        ) +
        Math.PI / 2;
    }
  });

  mapContainer.on("pointerup", () => {
    mapContainer.isDragging = false;
    isMapDragging = false;
    if (state.dragTarget) {
      state.dragTarget.x =
        state.tileSize * Math.round(state.dragTarget.x / state.tileSize);
      state.dragTarget.y =
        state.tileSize * Math.round(state.dragTarget.y / state.tileSize);
      didMove = false;
      state.dragTarget.alpha = 1;
      state.isDragging = false;
      state.dragTarget = null;
      dragData = null;
    }
    if (state.rotateTarget) {
      state.rotateTarget = null;
    }
  });

  mapContainer.on("pointerupoutside", () => {
    mapContainer.isDragging = false;
  });

  state.mapContainer = mapContainer;
}

function dragAndDropInit(element, state) {
  function dropHandler(event) {
    event.preventDefault();
    console.log("File(s) dropped");
    console.log(event);
    file = event.dataTransfer.items[0].getAsFile();
    console.log(file);
    const reader = new FileReader();

    reader.onload = async function (e) {
      let fileContent = e.target.result;
      let dragTexture = await PIXI.Assets.load(String(fileContent));
      console.log(
        createSprite(
          dragTexture,
          event.x - state.mapContainer.x,
          event.y - state.mapContainer.y,
          state
        )
      );
    };

    reader.readAsDataURL(file);
  }

  function dragOverHandler(ev) {
    console.log("File(s) in drop zone");

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }

  element.addEventListener("drop", dropHandler);
  element.addEventListener("dragover", dragOverHandler);
}

async function main() {
  var state = initApp();
  await initMapContainer(state);
  console.log(state.mapContainer);

  addEventListener("keydown", (event) => {});

  onkeydown = (event) => {
    if (event.code === "Space") {
      state.isPanning = true;
    }
  };
  addEventListener("keyup", (event) => {});

  onkeyup = (event) => {
    if (event.code === "Space") {
      state.isPanning = false;
    }
  };

  state.window.addEventListener(
    "contextmenu",
    function (ev) {
      ev.preventDefault();
      return false;
    },
    false
  );

  const spriteTexture = await PIXI.Assets.load("sample.png");
  // const asset = PIXI.Loader.load("sample.png");
  // console.log(asset);
  createSprite(spriteTexture, 200, 200, state);
  createSprite(spriteTexture, 300, 300, state);
  createSprite(spriteTexture, 700, 700, state);

  // Function to create a tile

  state.app.ticker.add(() => {
    let mapContainer = state.mapContainer;
    let gridContainer = mapContainer.gridContainer;

    const cameraX = -mapContainer.x;
    const cameraY = -mapContainer.y;

    const gridX = Math.floor(cameraX / state.tileSize);
    const gridY = Math.floor(cameraY / state.tileSize) + 1;

    // gridContainer.height = state.getHeight();
    // gridContainer.width = state.getWidth();

    gridContainer.children.forEach((tile) => {
      let tileX = tile.position.x;
      let tileY = tile.position.y;
      if (
        tileX < cameraX - 2 * state.tileSize ||
        tileX > cameraX + state.getWidth() ||
        tileY > cameraY + state.getHeight() ||
        tileY < cameraY - 2 * state.tileSize
      ) {
        gridContainer.removeChild(tile);
        // tile.visible = false;
      }
    });

    for (
      let row = gridY - 1;
      row <= gridY + Math.ceil(state.getHeight() / state.tileSize);
      row++
    ) {
      for (
        let col = gridX - 1;
        col <= gridX + Math.ceil(state.getWidth() / state.tileSize);
        col++
      ) {
        let tileExists = false;
        for (let tile of gridContainer.children) {
          if (
            tile.position.x === col * state.tileSize &&
            tile.position.y === row * state.tileSize
          ) {
            tileExists = true;
            // tile.visible = true;
            break;
          }
        }
        if (!tileExists) {
          gridContainer.createTile(col * state.tileSize, row * state.tileSize);
        }
      }
    }
  });

  window.addEventListener("resize", () => {
    // state.app.renderer.resize(window.innerWidth, window.innerHeight);
  });
}

main();
