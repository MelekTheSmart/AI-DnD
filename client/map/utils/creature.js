// UTILITY FUNCTIONS ====================

function setInteractive(obj, mode, cursor) {
  if (mode == 'static' && !cursor) {
    cursor = 'pointer'
  }
  obj.eventMode = mode;
  obj.cursor = cursor;
}

function rasterizeRect(rect, interval, padding) {
  let points = [];

}

function addHandles(target, size) {
  let rect = target.getBounds();
  let handles = {resize: [], rotate: null};
  for (let i = 3; i >= 0; i--) {
    // when [top|bottom], [left|right] is represented as two booleans (in other words, a two-bit number),
    // the pattern "top left", "top right", "bottom left", "bottom right"; is 11, 10, 01, 00.
    // since this is a binary counting sequence, I can get each combination of values by counting and masking the proper bits.

    let left = i & 1; // mask for the twos place bit
    let up = i & 2; // mask for the ones place bit
    left = !!left // coerce to bool
    up = !!up
    let handle = createResizeHandle(rect, size, left, up);
    handle.orientation = {left, up};

    setInteractive(handle, 'static');
    handle
      .on("pointerdown", function(event) {
        this.parent.setResizing(true, this.orientation, event.data.global);
      })
      .on("pointerup", function() {this.parent.setResizing(false);})
      .on("pointerupoutside", function() {this.parent.setResizing(false);})
      .on("globalpointermove", function(event) {
        this.parent.updateScale(event.data.global);
      })
    target.addChild(handle);
    handles.resize.push(handle);
  }
  console.log(size);
  let rotateHandle = createRotateHandle(rect, size.width * 2);
  setInteractive(rotateHandle, 'static');
  rotateHandle
    .on("pointerdown", function(event) {
      this.parent.setRotating(true)
    })
    .on("pointerup", function() {
      this.parent.setRotating(false);
    })
    .on("pointerupoutside", function() {this.parent.setRotating(false);})
    .on("globalpointermove", function(event) {
      this.parent.updateRotate(event.data.global);
    })
  target.addChild(rotateHandle);
  handles.rotate = rotateHandle;
  target.handles = handles;
  return handles;
}

function addNode(target, diameter) {
  let node = createNode(diameter, 'dynamic')
    .on("pointerdown", function(event) {
      let initialPosition = event.data.global;
      this.parent.setDragging(bool=true, initialPosition=initialPosition);
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
      this.parent.updateDragging(event.data.global);
    })
  target.node = node;
  target.addChild(node);
  return node;
}

async function addSprite(target, textureLocation) {
  let sprite = await createSprite(textureLocation);

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

function App(element) {
  // init app

  let app = new PIXI.Application({
    backgroundColor: 0xccccff, 
    resizeTo: element
  });

  // define additional members and methods

  let members = {
    creatures: [],
    zoom: 1,
    loadedSprites: {},
    map: WorldMap([], 1000),
  }
  
  let methods = {
    addCreature: function(creature) {
      this.creatures.push(creature);
      this.stage.addChild(creature);
    },
    removeCreature: function(creature) {
      let index = this.creatures.indexOf(creature);
      this.creatures.splice(index, 1);
      this.stage.removeChild(creature);
    },
  }

  // merge object with new members

  Object.assign(app, {...members, ...methods});

  // add to the DOM

  element.appendChild(app.view);

  // add events
  
  setInteractive(app.stage, 'static', 'arrow');
  app.stage.on("globalpointermove", function(event) {
    let mousePos = event.data.global;
    app.creatures.forEach(function(creature) {
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
  app.stage.on("pointerdown", function(event) {
    let mousePos = event.data.global;
    app.creatures.forEach(function(creature) {
      if (creature.contains(mousePos)) {
        if (!creature.selected) {
          creature.select();
        }
      }
      else if (creature.selected) {
        creature.deselect();
      }
    })
  })
  let s = app.map.drawChunk(0, 0);
  app.stage.addChild(s);
  return app;
}

function WorldMap(data, chunkSize) {
  let members = {
    chunkSize: chunkSize,
    tileSize: chunkSize/16,
    rowCount: 16,
    data: data,
    chunks: [],
  };

  let methods = {
    getChunk: function(x, y) {
      x = Math.floor(x / 16);
      y = Math.floor(y / 16);
      if (!(y in this.chunks)) {
        return undefined;
      }
      let row = this.chunks[y];
      if (!(x in row)) {
        return undefined;
      }
      let column = row[x];

    },
    drawChunk: function(x, y) {
      let chunk = this.getChunk(x, y);
      if (!chunk) {
        chunk = []
      }
      var sprite = new PIXI.Graphics();

      for (let i = 0; i < (this.rowCount**2); i++) {
        sprite.lineStyle(2, 0xeeeeee);
        let tile = chunk[i];
        if (!tile) {
          tile = {color: 'white'};
        }
        let [chunkY, chunkX] = [Math.floor(i / this.rowCount), Math.floor(i % this.rowCount)]
        let {color} = tile;
        sprite.drawRect(chunkX*this.tileSize, chunkY*this.tileSize, this.tileSize, this.tileSize); 
        sprite.beginFill(color);
        sprite.drawRect(chunkX*this.tileSize, chunkY*this.tileSize, this.tileSize, this.tileSize); 
        sprite.endFill();
      }
      return sprite;
    }
  }
  return {...members, ...methods};
}

async function createSprite(textureLocation='/images/default', eventMode='none', cached=true) {
  if ((!(textureLocation in APP.loadedSprites)) || (!cached)) {
    var spriteTexture = await PIXI.Assets.load(textureLocation);
    APP.loadedSprites[textureLocation] = spriteTexture;
  }
  else {
    var spriteTexture = APP.loadedSprites[textureLocation];
  }
  let sprite = new PIXI.Sprite(spriteTexture);
  sprite.anchor.set(0.5);
  setInteractive(sprite, eventMode);
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

async function Creature(creature, state) {
  // base templates for objects should be done with function `create[objectname]`
  // adding specific attributes to objects should be done with `add[objectname]`
  let spriteContainer = new PIXI.Container()
  spriteContainer.creatureRef = creature;
  spriteContainer.position = new PIXI.Point(...creature.position);

  let texture = creature.sprite;

  let sprite = await addSprite(spriteContainer, texture);

  let node = addNode(spriteContainer, 30);

  let handleSize = {width: 10, height: 10};
  addHandles(spriteContainer, handleSize);

  let members = {
    sprite: sprite,
    node: node,
    handleSize: handleSize,
    hovered: false,
    creatureRef: creature,
    isMoving: {
      bool: false,
      initialPosition: [undefined, undefined],
    },
    isResizing: {
      bool: false, 
      orientation: [undefined, undefined],
      initialPosition: [undefined, undefined],
    },
    isRotating: {
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
      this.isResizing = {bool, orientation, initialPosition: {x, y}, initialSize}
    },
    updateScale: function(newPos) {
      let {bool, initialPosition, orientation, initialSize} = this.isResizing;
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
      this.resize(initialSize.width + xDifference, initialSize.height - yDifference)
    },
    setDragging: function(bool, initialPosition) {
      this.isMoving = {bool, initialPosition};
    },
    updateDragging: function(newPos) {
      let {bool, initialPosition} = this.isMoving;
      if (!bool)
        return;
      this.position = new PIXI.Point(newPos.x, newPos.y);
    },
    setRotating: function(bool) {
      this.isRotating = {bool};
    },
    updateRotate: function(newPos) {
      let {bool} = this.isRotating;
      if (!bool)
        return;
      this.rotation = Math.atan2(this.y - newPos.y, this.x - newPos.x) - (Math.PI/2);
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
    }
  }

  Object.assign(spriteContainer, {...members, ...methods});
  spriteContainer.drawOutline();

  return spriteContainer;
}

let APP = App(document.body);

async function test() {
  let creature = {position: [400, 400], sprite: "https://png.pngtree.com/png-vector/20191126/ourmid/pngtree-image-of-cute-radish-vector-or-color-illustration-png-image_2040180.jpg"}
  let creature2 = {position: [300, 300], sprite: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/640px-PNG_transparency_demonstration_1.png"}
  let c = await Creature(creature);
  APP.addCreature(c);
  let d = await Creature(creature2);
  APP.addCreature(d);
}
test()

