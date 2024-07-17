// ==== ends a section

function Window() {
  let members = {
  }
  
  let methods = {
  }

  let tick = function() {
  }

  let tickInterval = 100

  let obj = {
    ...members,
    ...methods,
    tick: setInterval(tick(), tickInterval);
  };
}

function Canvas() {
}

// import { Transformer } from "node_modules/@pixi-essentials/transformer";
let main = (async () => {

  // Initialize PIXI.js application
  const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x1099bb,
  });
  console.log(app);

  // set camera

  var CAMERA = Camera(app.view, window)
  setInterval(() => {CAMERA.tick()}, 100);

  // ====

  document.getElementById("game-container").appendChild(app.view);
  let GameMap = document.getElementById("game-container");
  // Create a container for the map
  const mapContainer = new PIXI.Container();
  app.stage.addChild(mapContainer);

  const gridContainer = new PIXI.Container();
  mapContainer.addChild(gridContainer);

  mapContainer.interactive = true;
  mapContainer.buttonMode = true;
  mapContainer.sortableChildren = true;
  let isPanning = false;
  let isResizing;

  GameMap.addEventListener("drop", dropHandler);
  GameMap.addEventListener("dragover", dragOverHandler);

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
          event.x - mapContainer.x,
          event.y - mapContainer.y
        )
      );
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

  let isMapDragging = false;
  let isDragging = false;
  let resizeTarget = null;
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
  mapContainer.on("mousemove", (event) => {
    if (isResizing) {
      console.log(directionx);
      const deltaSX = event.data.global.x - lastSizeX;
      const deltaSY = event.data.global.y - lastSizeY;
      if (Math.abs(deltaSX) > Math.abs(deltaSY)) {
        resizeTarget.width = resizeTarget.width + deltaSX * 1.2 * directionx;
        resizeTarget.height = resizeTarget.height + deltaSX * 1.2 * directionx;
        resizeTarget.width = resizeTarget.width + deltaSY * 1.2 * directiony;
        resizeTarget.height = resizeTarget.height + deltaSY * 1.2 * directiony;
      }
      lastSizeX = event.data.global.x;
      lastSizeY = event.data.global.y;
    }
  });

  mapContainer.on("pointerup", () => {
    isMapDragging = false;
  });

  mapContainer.on("pointerupoutside", () => {
    isMapDragging = false;
  });
  function createSprite(texture, x, y) {
    const sprite = new PIXI.Sprite(texture);
    // sprite.position.set(x, y);
    sprite.anchor.set(0.5);
    sprite.interactive = true;
    sprite.buttonMode = true;

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
    outline.interactive = true;
    outline.buttonMode = true;
    outline.width = sprite.width;
    outline.height = sprite.width;
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

    for (let i = 0; i < 4; i++) {
      const topLeft = new PIXI.Graphics();
      topLeft.interactive = true;
      topLeft.buttonMode = true;
      topLeft.lineStyle(2, 0x00ffff);
      topLeft.beginFill(0x00ffff);
      if (i === 0) {
        topLeft.drawRect(
          -outline.width / 2 - 10,
          -outline.height / 2 - 10,
          10,
          10
        );
        topLeft.on("mousedown", () => {
          directionx = -1;
          directiony = -1;
        });
      }
      if (i === 1) {
        topLeft.drawRect(
          outline.width / 2 - 5,
          -outline.height / 2 - 5,
          10,
          10
        );
        topLeft.on("mousedown", () => {
          directionx = 1;
          directiony = -1;
        });
      }
      if (i === 2) {
        topLeft.drawRect(-outline.width / 2, outline.height / 2 - 5, 10, 10);
        topLeft.on("mousedown", () => {
          directionx = -1;
          directiony = 1;
        });
      }
      if (i === 3) {
        topLeft.drawRect(
          outline.width / 2 - 10,
          outline.height / 2 - 10,
          10,
          10
        );
        topLeft.on("mousedown", () => {
          directionx = 1;
          directiony = 1;
        });
      }

      topLeft.endFill();
      topLeft.on("mousedown", (event) => {
        resizeTarget = sprite;
        lastSizeX = event.data.global.x;
        lastSizeY = event.data.global.y;
        isResizing = true;
        mouseOffsetX = event.global.x;
        mouseOffsetY = event.global.y;
      });
      topLeft.on("mouseup", (event) => {
        isResizing = false;
        console.log("disabled");
      });
      topLeft.on("mouseupoutside", (event) => {
        isResizing = false;
      });

      outline.addChild(topLeft);
    }
    outline.addChild(rotateHandle);
    // Rectangle with fill and border
    const spriteCont = new PIXI.Container();
    spriteCont.interactive = true;
    spriteCont.buttonMode = true;
    spriteCont.x = x;
    spriteCont.y = y;
    // console.log(sprite.texture.width);
    console.log(spriteCont.width);
    const outline_rect = new PIXI.Graphics();
    outline_rect.lineStyle(2, 0x00ff00); // Green border, 2px thick
    outline_rect.drawRect(0, 0, spriteCont.width, spriteCont.height); // x, y, width, height
    spriteCont.addChild(outline_rect);
    const node = new PIXI.Graphics();
    node.lineStyle(2, 0x00ff00); // Green border, 2px thick
    node.drawCircle(0, 0, 32, 32); // x, y, width, height
    node.hitArea = new PIXI.Circle(0, 0, 32, 32);
    node.visible = true;
    node.interactive = true;
    node.buttonMode = true;
    node.on("mousedown", (event) => {
      actualX = spriteCont.x;
      actualY = spriteCont.y;
      isDragging = true;
      console.log(mapContainer.children);
      mapContainer.setChildIndex(spriteCont, mapContainer.children.length - 1);
      spriteCont.alpha = 0.5;
      isMapDragging = false;
      dragData = event.data;
      lastX = event.data.global.x;
      lastY = event.data.global.y;
    });
    spriteCont.addChild(sprite);
    spriteCont.addChild(node);
    sprite.addChild(outline);

    spriteCont.on("rightclick", (event) => {
      console.log(spriteCont);
    });
    spriteCont.on("pointerover", (event) => {
      node.visible = true;
    });
    spriteCont.on("pointerout", (event) => {
      node.visible = false;
    });

    spriteCont.on("pointermove", (event) => {
      if (isDragging) {
        const deltaSX = event.data.global.x - lastX;
        const deltaSY = event.data.global.y - lastY;
        spriteCont.x = spriteCont.x + deltaSX;
        spriteCont.y = spriteCont.y + deltaSY;
        actualX = actualX + deltaSX;
        actualY = actualY + deltaSY;
        spriteCont.x = 64 * Math.round(actualX / 64);
        spriteCont.y = 64 * Math.round(actualY / 64);
        lastX = event.data.global.x;
        lastY = event.data.global.y;
      }
    });

    spriteCont.on("pointerup", () => {
      if (isDragging) {
        spriteCont.x = 64 * Math.round(spriteCont.x / 64);
        spriteCont.y = 64 * Math.round(spriteCont.y / 64);
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
    mapContainer.addChild(spriteCont);
  }

  const spriteTexture = await PIXI.Assets.load("sample.png");
  // const asset = PIXI.Loader.load("sample.png");
  // console.log(asset);
  createSprite(spriteTexture, 200, 200);
  createSprite(spriteTexture, 300, 300);
  createSprite(spriteTexture, 700, 700);

  // Load the texture using PIXI loader
  const texture = await PIXI.Assets.load("GridONE.png");
  console.log(await PIXI.Assets.load("GridONE.png"));

  const tileSize = 64;
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

    gridContainer.height = CAMERA.getHeight();
    gridContainer.width = CAMERA.getWidth();

    tiles.forEach((tile) => {
      let tileX = tile.position.x;
      let tileY = tile.position.y;
      if (
        tileX < cameraX - 2 * tileSize ||
        tileX > cameraX + CAMERA.getWidth() ||
        tileY > cameraY + CAMERA.getHeight() ||
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
      row <= gridY + Math.ceil(CAMERA.getHeight() / tileSize);
      row++
    ) {
      for (
        let col = gridX - 1;
        col <= gridX + Math.ceil(CAMERA.getWidth() / tileSize);
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

  window.addEventListener("resize", () => {
    // app.renderer.resize(window.innerWidth, window.innerHeight);
  });
});

main();
