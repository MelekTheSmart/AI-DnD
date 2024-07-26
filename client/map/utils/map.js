const SERVER = {
  url: "",
  saveImage: async function() {
  },

  getUser: async function(username, dest) {
    let user = await fetch(`${this.url}/user/users/${username}`);
    return await user.json();
  },
  getStatblock: async function(prompt) {
    let body = {
      input: prompt,
    };
    let headers = {
      "Content-Type": "application/json",
    }
    let response = await fetch(`${this.url}/ai/statblock`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    let statblock = await response.json();
    return statblock;
  },
   
}

function showRect(rect, color) {
  let {x, y, width, height} = rect;
  let graphic = new PIXI.Graphics();
  graphic.beginFill(color, 0.5);
  graphic.drawRect(x, y, width, height);
  graphic.endFill();
  try {
    APP.stage.addChild(graphic);
  }
  catch (err) {
  }
}

function rasterizeLine(point1, point2, interval) {
  let xSpan = point2.x - point1.x;
  let ySpan = point2.y - point1.y;
  let swap = false;
  let rate = ySpan / xSpan;
  let steps = xSpan / interval;
  let greater = xSpan;
  if (Math.abs(ySpan) > Math.abs(xSpan)) {
    swap = true;
    rate = xSpan / ySpan;
    steps = ySpan / interval;
    greater = ySpan;
  }
  let points = [];
  for (let i = 0; i <= Math.abs(steps); i++) {
    let val = i * Math.sign(greater);
    let {x, y} = {x: val * interval, y: val * rate * interval};
    let point = swap ? {x: y, y: x} : {x: x, y: y};
    point.x += point1.x;
    point.y += point1.y;
    points.push(point);
  }
  return points;
}

function rectContains(rect, point) {
  return (point.x >= rect.x && point.x <= (rect.x + rect.width) && point.y >= rect.y && point.y <= (rect.y + rect.height));
}

function rectOverlaps(rect2, rect1) {
  for (let i = 0; i < 4; i++) {
    let [up, left] = [i & 1, (i & 2) >> 1]
    let y = up ? rect1.y : rect1.y + rect1.height;
    let x = left ? rect1.x: rect1.x + rect1.width; 
    if (rectContains(rect2, {x, y})) {
      return true;
    }
  }
  return false;
}

function setInteractive(obj, mode, cursor) {
  if (mode == 'static' && !cursor) {
    cursor = 'pointer'
  }
  obj.eventMode = mode;
  obj.cursor = cursor;
}

function addHandles(target, size) {
  if (!size) {
    if ('handleSize' in target) {
      size = target.handleSize;
    }
  }
  let rect = target.getBounds();
  let handles = {resize: [], rotate: null};
  for (let i = 3; i >= 0; i--) {
    // when [top|bottom], [left|right] is represented as two booleans (in other words, a two-bit number),
    // the pattern "top left", "top right", "bottom left", "bottom right"; is 11, 10, 01, 00.
    // since this is a binary counting sequence, I can get each combination of values by counting down and masking the proper bits.

    let left = i & 1; // mask for the twos place bit
    let up = i & 2; // mask for the ones place bit
    left = !!left; // coerce to bool
    up = !!up;
    let handle = createResizeHandle(rect, size, left, up);

    handle.orientation = {left, up};

    setInteractive(handle, 'static');
    handle
      .on("pointerdown", function(event) {
        if (event.button !== 0) {
          return;
        }
        this.parent.setResizing(true, this.orientation, APP.getLocalCoords(event.data.global));
      })
      .on("pointerup", function() {
        this.parent.setResizing(false);
      })
      .on("pointerupoutside", function() {this.parent.setResizing(false);})
      .on("globalpointermove", function(event) {
        this.parent.updateScale(APP.getLocalCoords(event.data.global));
      })
    target.addChild(handle);
    handles.resize.push(handle);
  }
  let rotateHandle = createRotateHandle(rect, size.width * 2);
  setInteractive(rotateHandle, 'static');
  rotateHandle
    .on("pointerdown", function(event) {
      if (event.button !== 0) {
        return;
      }
      this.parent.setRotating(true);
    })
    .on("pointerup", function() {
      this.parent.setRotating(false);
    })
    .on("pointerupoutside", function() {this.parent.setRotating(false);})
    .on("globalpointermove", function(event) {
      this.parent.updateRotate(APP.getLocalCoords(event.data.global));
    })
  target.addChild(rotateHandle);
  handles.rotate = rotateHandle;
  target.handles = handles;
  return handles;
}

function addNode(target, diameter) {
  let node = createNode(diameter, 'dynamic')
    .on("pointerdown", function(event) {
      if (event.button !== 0) {
        return;
      }
      let initialPosition = APP.getLocalCoords(event.data.global);
      this.parent.setDragging(bool=true, initialPosition=initialPosition);
      this.parent.bringToFront();
      this.cursor = 'grabbing';
    })
    .on("pointerup", function(event) {
      this.parent.setDragging(bool=false);
      this.cursor = 'grab';
    })
    .on("pointerupoutside", function(event) {
      this.parent.setDragging(bool=false);
      this.cursor = 'grab';
    })
    .on("globalpointermove", function(event) {
      this.parent.updateDragging(APP.getLocalCoords(event.data.global));
    })
  target.node = node;
  target.addChild(node);
  return node;
}

async function addSprite(target, texture, textureMode = 'path') {
  let sprite = await createSprite(texture, {textureMode});

  let members = {
  }

  let methods = {
  }

  Object.assign(sprite, {...members, ...methods});

  target.sprite = sprite;

  target.addChild(sprite);

  return sprite;
}

// FACTORY FUNCTIONS ====================

function App(element, username, pathToEncounter) {
  let app = new PIXI.Application({
    backgroundColor: 0xccccff, 
    resizeTo: element
  });
  // init app
  async function _init() {
    element.appendChild(this.view);

    Object.assign(this, {...members, ...methods});
    
    await this.loadUser(username, pathToEncounter);
    
    this.stage.addChild(this.map);
    let rect = this.getRect();
    this.map.renderArea(rect, 16);
    setInteractive(this.stage, 'static', 'arrow');

    this.stage.on("globalpointermove", function(event) {
      let mousePos = {...event.data.global};
      APP.creatures.forEach(function(creature) {
        let isIn = creature.contains(mousePos);
        if (isIn) {
          if (!creature.hovered) {
            creature.hoverSprite();
          }
        }
        else if (creature.hovered) {
          creature.unhoverSprite();
        }
      })
    })
    this.stage.on("pointerdown", function(event) {
      if (event.button !== 0) {
        return;
      }
      var oneSelected = false;
      let mousePos = {...event.data.global};
      let creaturesCopy = [...APP.creatures.reverse()];
      APP.creatures.reverse();
      for (let creature of creaturesCopy) {
        if (creature.contains(mousePos) && !oneSelected) {
          oneSelected = true
          if (!creature.selected) {
            creature.select();
          }
        }
        else if (creature.selected) {
          creature.deselect();
        }
      }
    })

    this.element.addEventListener("dragover", function(event) {
      event.preventDefault();
    })
    this.element.addEventListener("drop", async function(event) {
      event.preventDefault();
      let file = event.dataTransfer.files[0];

      let reader = new FileReader();
      reader.onload = async function(content) {
        let data = content.target.result;
        let texture = await PIXI.Assets.load(String(data));
        let position = APP.getLocalCoords({x: event.clientX, y: event.clientY});
        let {x, y} = position;
        let stats = {hitpoints: 10}
        let creature = await Creature({position: [x, y], stats, hp: stats.hitpoints, sprite: await SERVER.saveImage(data)}, texture);
        APP.addCreature(creature);
      }
      await reader.readAsDataURL(file);
    })
    return this;
  }


  // define additional members and methods

  let members = {
    map: WorldMap({}, 1000, 16),
    creatures: [],
    contextMenu: null,
    zoom: 1,
    loadedSprites: {},
    mapRenderData: {
      lastRender: {x: 0, y: 0},
    },
    element: element,
    margin: 3,
    sections: {
      map: "single",
      creatures: "collection",
      contextMenu: "single",
    },
  }
  
  let methods = {
    loadUser: async function(username, path) {
      if (!username) {
        return;
      }
      let user = await SERVER.getUser(username);
      let [campaign, session, encounterId] = path;
      let encounter = user.campaigns.find(c => c._id === campaign).sessions[session].encounters[encounterId];
      this.map = encounter.map ? WorldMap(encounter.map) : WorldMap({}, 2000, 32);
      for (let creature of encounter.creatures) {
        this.creatures.push(await Creature(creature));
      }
    },
    getLocalCoords: function(coords) {
      let {x, y} = coords;
      x -= this.stage.x;
      y -= this.stage.y;
      x /= this.zoom;
      y /= this.zoom;
      return {x, y};
    },
    updateRender: function() {
      let {x, y} = this.getRect();
      let lastPosition = this.mapRenderData.lastRender;
      let xDistance = Math.abs(lastPosition.x - x);
      let yDistance = Math.abs(lastPosition.y - y);
      if (xDistance > this.map.chunkSize / 2 || yDistance > this.map.chunkSize / 2) {
        let rect = this.getRect()
        rect.x = -x;
        rect.y = -y;
        // this.map.renderArea(rect, 1);
        this.mapRenderData.lastRender = {x, y};
      }
    },
    getRect: function() {
      if ((Math.random()) < 0.0001) {
        console.log("pwned");
      }
      let {x, y} = this.stage;
      let {height, width} = {height: this.view.offsetHeight, width: this.view.offsetWidth};
      x *= -1;
      y *= -1;

      /*
      x /= this.zoom;
      y /= this.zoom;
      
      height /= this.zoom;
      width /= this.zoom;
      */

      return {x, y, width, height};
    },
    setZoom: function(value, scale = 1) {
      value /= scale;
      this.zoom = value;
      this.stage.scale.set(value);
    },
    setInteractionCase: function(clickCase) {
      this.map.setInteractionCase(clickCase);
    },
    pan: function(distance) {
      this.stage.x += distance.x;
      this.stage.y += distance.y;
    },
    addCreature: function(creature) {
      this.creatures.push(creature);
      this.stage.addChild(creature);
    },
    removeCreature: function(creature) {
      let index = this.creatures.indexOf(creature);
      this.creatures.splice(index, 1);
      this.stage.removeChild(creature);
    },
    bringToFront: function(creature) {
      var baseline = 0;
      for (let key in this.sections) {
        let value = this.sections[key];
        if (value === 'single') {
          baseline += this[key] ? 1 : 0;
        }
        else if (value === 'collection') {
          baseline += this[key] ? this[key].length : 0;
        }
        if (key === 'creatures') {
          break;
        }
      }
      this.stage.setChildIndex(creature, baseline - 1);
      let index = this.creatures.indexOf(creature);
      this.creatures.splice(index, 1);
      this.creatures.push(creature);
    },
  }


  app._init = _init; 

  return app;
}

function WorldMap(data, chunkSize, rowCount=16) {
  let map = new PIXI.Container();
  let members = {
    chunkSize: chunkSize,
    tileSize: chunkSize/rowCount,
    rowCount: rowCount,
    data: data,
    chunks: {},
    drawingData: {
      bool: false,
      lastPos: undefined, 
      color: "green",
    },
    panningData: {
      bool: false,
      lastPos: undefined,
    },
    clickCases: {
      select: function(bool, event) {
        if (!bool) return;
        let {x, y} = event.data.global;
        let width = 100;
        let height = 100;
        let rect = {x, y, width, height};
        APP.map.renderArea(rect, 1);
        return;
      },
      paint: function(bool, event) {
        let newPos = event ? APP.getLocalCoords(event.data.global) : undefined;
        this.drawingData = {...this.drawingData, ...{bool, lastPos: newPos}};
      },
      pan: function(bool, event) {
        let newPos = event ? {...event.data.global} : undefined;
        this.panningData = {bool, lastPos: newPos};
      },
    },
    moveMouseCases: {
      select: function(event) {
      },
      paint: function(event) {
        let newPos = APP.getLocalCoords(event.data.global);
        let {bool, lastPos, color} = this.drawingData;
        if (!bool)
          return;
        let tiles;
        if (JSON.stringify(newPos) === JSON.stringify(lastPos)) {
          tiles = [lastPos];
        }
        else {
          tiles = rasterizeLine(lastPos, newPos, this.tileSize);
        }
        for (let tile of tiles) {
          let chunk = this.getChunk(tile);
          chunk.setTileColorGlobal(tile, color);
          this.updateChunkData(chunk);
        }
        this.handleClick(bool, event);
      },
      pan: function(event) {
        let {bool, lastPos} = this.panningData;
        if (!bool) {
          return;
        }
        let newPos = {...event.data.global};
        let difference = {x: newPos.x - lastPos.x, y: newPos.y - lastPos.y};
        APP.pan(difference);
        APP.updateRender();
        this.handleClick(true, event);
      }
    },
  };

  let methods = {
    snap: function(point, scale=1) {
      for (let index in point) {
        point[index] = Math.floor(point[index] / (this.tileSize * scale));
        point[index] *= this.tileSize * scale;
        point[index] += this.tileSize * scale * 0.5;
      }
      return point;
    },
    setInteractionCase: function(interactionCase) {
      if (this.handleClick) {
        this.handleClick(false);
      }
      this.handleClick = this.clickCases[interactionCase];
      this.handleMouseMove = this.moveMouseCases[interactionCase];
    },
    getChunkData: function(position) {
      let {x, y} = position;
      let hashString = `${x}/${y}`;
      if (!(hashString in this.data)) {
        return null;
      }
      return this.data[hashString];
    },
    updateChunkData: function(chunk) {
      let data = chunk.export();
      this.data[chunk.hash] = data;
    },
    getChunk: function(position) {
      let {x, y} = this.getChunkPos(position);
      let hash = `${x}/${y}`
      return this.chunks[hash];
    },
    makeChunk: function(globalPos) {
      let [globalX, globalY] = [globalPos.x, globalPos.y];
      let {x, y} = this.getChunkPos(globalPos);
      let hash = `${x}/${y}`;
      let data = this.getChunkData({x, y});
      if (data === null) {
        data = []
      }
      let chunk = Chunk(this, data, {x: globalX, y: globalY}, this.chunkSize, this.rowCount);
      chunk.position = new PIXI.Point(x * chunk.chunkSize, y * chunk.chunkSize);
      return chunk;
    },
    addChunk: function(globalPos) {
      let chunk = this.makeChunk(globalPos);
      this.chunks[chunk.hash] = chunk;
      this.addChild(chunk);
    },
    removeChunk(chunk) {
      this.removeChild(chunk);
      delete this.chunks[chunk.hash];
    },
    getChunkPos: function(globalPos) {
      let {x, y} = globalPos;
      return {x: Math.floor(x / this.chunkSize), y: Math.floor(y / this.chunkSize)}
    },
    getHash: function(position) {
      let {x, y} = position;
      x /= this.chunkSize;
      y /= this.chunkSize;
      x = x | 0;
      y = y | 0;
      return `${x}/${y}`
    },
    rasterizeRect: function(rect, exclude={}, margin=0) {
      let unit = (margin * this.chunkSize);
      rect = {...rect};
      rect.x -= unit/2;
      rect.y -= unit/2;
      rect.width += unit;
      rect.height += unit;
      let units = {x: Math.ceil(rect.width / this.chunkSize), y: Math.ceil(rect.height / this.chunkSize)};
      let points = {};
      for (let y = 0; y < units.y; y++) {
        for (let x = 0; x < units.x; x++) {
          let point = {x: (x * this.chunkSize) + rect.x, y: (y * this.chunkSize) + rect.y};
          let hash = this.getHash(point);
          if (!(hash in exclude)) {
            points[hash] = point;
          }
        }
      }
      return points;
    },
    renderArea: async function(rect, margin) {
      let include = {};
      let points = this.rasterizeRect(rect, {}, margin);
      for (let chunkHash in this.chunks) {
        let chunk = this.chunks[chunkHash];
        if (chunkHash in points) {
          include[chunkHash] = chunk;
          delete points[chunkHash];
        }
      }
      for (let pointHash in points) {
        let point = points[pointHash];
        let chunk = this.makeChunk(point);
        this.addChild(chunk);
        include[pointHash] = chunk;
      }
      this.chunks = include;
      for (let child of this.children) {
        if (!(child.hash) in this.chunks) {
          delete child;
        }
      }
    },
    export: async function() {
      let data = JSON.stringify(this.data);
      await navigator.clipboard.writeText(data);
    },
    handleClick: null,
    handleMouseMove: null,
  }
  Object.assign(map, {...members, ...methods});
  map.setInteractionCase('pan');
  setInteractive(map, 'static', 'arrow');
  return map;
}

function Chunk(map, data, globalPosition, chunkSize, rowCount) {
  let chunk = new PIXI.Graphics();

  let members = {
    data: data,
    chunkPosition: map.getChunkPos(globalPosition),
    map: map,
    chunkSize: chunkSize,
    rowCount: rowCount,
    tileSize: chunkSize / rowCount,
  };

  let methods = {
    getColor: function(x, y) {
    },
    setTileColor: function(tilePosition, color) {
      let {x, y} = tilePosition;
      this.lineStyle(6, 0xcccccc);
      this.beginFill(color);
      this.drawRect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize); 
      this.endFill();
      this.data[y * this.rowCount + x] = {color: color};
    },
    setTileColorGlobal: function(globalPosition, color) {
      let {x, y} = globalPosition;
      let relative = this.getRelativeMouse(x, y);
      let tile = this.getTileCoords(relative.x, relative.y);
      this.setTileColor(tile, color);
    },
    export: function() {
      return this.data;
    },
    draw: function() {
      this.hitArea = new PIXI.Rectangle(0, 0, this.chunkSize, this.chunkSize);
      for (let i = 0; i < (this.rowCount**2); i++) {
        let tile = this.data[i];
        if (!tile) {
          tile = {color: 'white'};
        }
        let [chunkY, chunkX] = [Math.floor(i / this.rowCount), Math.floor(i % this.rowCount)]
        let {color} = tile;
        this.setTileColor({x: chunkX, y: chunkY}, color);
      }
    },
    getRelativeMouse(globalX, globalY) {
      let [x, y] = [globalX - this.position.x, globalY - this.position.y];
      return {x, y};
    },
    getTileCoords(localX, localY) {
      return {x: Math.floor(localX / this.tileSize), y: Math.floor(localY / this.tileSize)}
    },
  };

  let events = {
    pointerdown: function(event) {
      this.parent.handleClick(bool=true, event=event);
    },
    pointermove: function(event) {
      this.parent.handleMouseMove(event);
    },
    pointerup: function() {
      this.parent.handleClick(bool=false);
    },
    pointerleave: function() {
    },
    pointerover: function(event) {
      if (event.button === 0) {
        this.parent.handleClick(bool=true, event=event);
      }
    },
  }

  setInteractive(chunk, 'static', 'arrow');
  chunk.eventMode = 'static';
  for (let e in events) {
    chunk.on(e, events[e]);
  }

  Object.assign(chunk, {...members, ...methods});
  chunk.hash = `${chunk.chunkPosition.x}/${chunk.chunkPosition.y}`
  chunk.sprite = chunk.draw();
  return chunk;
}

async function createSprite(texture='/images/default', kwargs) {
  kwargs = {...{defaultSize: {width: 300, height: 300}, eventMode: 'none', textureMode: 'path'}, ...kwargs}
  let spriteTexture;
  if (kwargs.textureMode === 'path') {
    spriteTexture = await PIXI.Assets.load(texture);
  }
  else if (kwargs.textureMode === 'texture') {
    spriteTexture = texture;
  }
  let sprite = new PIXI.Sprite(spriteTexture);
  let {major, minor} = sprite.width > sprite.height ? {major: "width", minor: "height"} : {major: "height", minor: "width"}
  let scale = kwargs.defaultSize[major] / sprite[major];
  sprite[major] *= scale;
  sprite[minor] *= scale;
  sprite.anchor.set(0.5);
  setInteractive(sprite, kwargs.eventMode);
  return sprite;
}

function createNode(diameter, eventMode='none') {
  let node = new PIXI.Graphics()
    .beginFill(0x00ffff, 0.5)
    .lineStyle(2, 0x00ffff) 
    .drawCircle(0, 0, diameter, diameter)
    .endFill()
  setInteractive(node, eventMode, 'grab');
  node.hitArea = new PIXI.Circle(0, 0, diameter);
  node.visible = false;
  return node;
}

function createResizeHandle(targetBounds, size, left=true, up=true) {
  var x, y;
  if (left) {
    x = (-targetBounds.width/2) -size.width;
  }
  else {
    x = targetBounds.width/2;
  }
  if (up) {
    y = (-targetBounds.width/2) -size.height;
  }
  else {
    y = targetBounds.height/2;
  }
  let handle = new PIXI.Graphics();
  handle.anchor = 0.5;
  handle.lineStyle(2, 0x00ffff);
  handle.beginFill(0x00ffff);
  handle.drawRect(0, 0, size.width, size.height);
  handle.endFill();
  handle.position = new PIXI.Point(x, y);
  return handle;
}

function createRotateHandle(targetBounds, diameter) {
  let handle = new PIXI.Graphics();
  handle.anchor = 0.5;
  handle.lineStyle(2, 0x00ffff);
  handle.beginFill(0x00ffff);
  handle.drawCircle(0, 0, diameter/2);
  handle.endFill();
  handle.position = new PIXI.Point(0, -(targetBounds.height/2) - diameter/2);
  return handle;
}

async function Creature(creatureData, immediateSprite=null) {

  async function _init(creatureData, immediateSprite) {
    let spriteContainer = new PIXI.Container()

    Object.assign(spriteContainer, {...members, ...methods});
    spriteContainer.creatureRef = creatureData;
    spriteContainer.position = new PIXI.Point(...creatureData.position);

    let texture, textureMode;
    if (immediateSprite) {
      texture = immediateSprite;
      textureMode = 'texture';
    }
    else {
      texture = creatureData.sprite;
      textureMode = 'path';
    }
    let sprite = await addSprite(spriteContainer, texture, textureMode);
    let node = addNode(spriteContainer, 30);

    addHandles(spriteContainer);
    spriteContainer.drawOutline();
    spriteContainer.deselect();
    spriteContainer.placeHandles();

    return spriteContainer;
  }

  let members = {
    sprite: null,
    node: null,
    handleSize: {width: 10, height: 10},
    hovered: false,
    creatureRef: null,
    movingData: {
      bool: false,
      initialPosition: [undefined, undefined],
    },
    resizingData: {
      bool: false, 
      orientation: [undefined, undefined],
      initialPosition: [undefined, undefined],
    },
    rotatingData: {
      bool: false,
    },
  }

  let methods = {
    contains: function(point) {
      let rect = this.getBounds();
      return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
    },
    setResizing: function(bool, orientation, initialPosition) {
      if (initialPosition) {
        var {x, y} = initialPosition;
      }
      let initialSize = {width: this.sprite.width, height: this.sprite.height}
      this.resizingData = {bool, orientation, initialPosition: {x, y}, initialSize}
    },
    updateScale: function(newPos) {
      let {bool, initialPosition, orientation, initialSize} = this.resizingData;
      if (!bool)
        return;
      let xDifference = (newPos.x - initialPosition.x) * 2;
      let yDifference = (newPos.y - initialPosition.y) * 2;
      if (orientation.left) {
        xDifference *= -1;
      }
      if (!orientation.up) {
        yDifference *= -1;
      }
      let resize = APP.map.snap({x: initialSize.width + xDifference, y: initialSize.height - yDifference}, scale=0.25)
      this.resize(resize.x, resize.y)
    },
    setDragging: function(bool, initialPosition) {
      this.movingData = {bool, initialPosition};
    },
    updateDragging: function(newPos) {
      let {bool, initialPosition} = this.movingData;
      if (!bool)
        return;
      this.position = APP.map.snap(newPos, 1);
    },
    setRotating: function(bool) {
      this.rotatingData = {bool};
    },
    updateRotate: function(newPos) {
      let snapScale = 0.3; 
      let {bool} = this.rotatingData;
      if (!bool)
        return;
      let rotation = Math.atan2(this.y - newPos.y, this.x - newPos.x) - (Math.PI/2);
      rotation = Math.floor(rotation / snapScale);
      rotation *= snapScale;
      this.rotation = rotation;
    },
    resize: function(width, height) {
      this.sprite.width = width;
      this.sprite.height = height;
      this.drawOutline();
      this.placeHandles();
    },
    placeHandles: function() {
      let size = {width: this.sprite.width, height: this.sprite.height};
      let handleSize = this.handleSize;
      this.handles.resize.forEach(function(handle) {
        let {orientation} = handle;
        var x, y = [0, 0];
        if (orientation.left) {
          handle.x = -(size.width/2) - handleSize.width; 
        }
        else {
          handle.x = (size.width/2)
        }
        if (orientation.up) {
          handle.y = -(size.height/2) - handleSize.height;
        }
        else {
          handle.y = (size.height/2)
        }
      })
      this.handles.rotate.y = -(size.height/2) - handleSize.height;
    },
    setOutline: function(isHidden) {
      this.outline.visible = isHidden;
      this.handles.resize.forEach(function(handle) {
        handle.visible = isHidden;
      })
      this.handles.rotate.visible = isHidden;
    },
    drawOutline: function() {
      this.removeChild(this.outline);
      let outline = new PIXI.Graphics();
      outline.lineStyle(2, 0x00ffff);
      outline.drawRect(
        -this.sprite.width/2,
        -this.sprite.height/2,
        this.sprite.width,
        this.sprite.height
      );
      this.outline = outline;
      this.addChild(outline);
    },
    hoverSprite: function() {
      this.node.visible = true;
      this.hovered = true;
    },
    unhoverSprite: function() {
      this.node.visible = false;
      this.hovered = false;
    },
    select: function() {
      this.selected = true;
      this.setOutline(true);
    },
    deselect: function() {
      this.selected = false;
      this.setOutline(false);
    },
    bringToFront: function() {
      APP.bringToFront(this);
    }
  }

  
  let creature = _init(creatureData, immediateSprite);

  return creature;
}
const KEYBINDS = {
  KeyP: 'paint',
  KeyV: 'pan',
  KeyS: 'select'
}
document.addEventListener('keyup', function(event) {
  if (event.code in KEYBINDS) {
    APP.setInteractionCase(KEYBINDS[event.code]);
  }
  else if (event.code === 'Enter') {
  }
  else if (event.code === 'BracketRight') {
    APP.setZoom(APP.zoom * 1.1);
  }
  else if (event.code === 'BracketLeft') {
    APP.setZoom(APP.zoom * 0.9);
  }
})
document.addEventListener('scroll', function(event) {
})
