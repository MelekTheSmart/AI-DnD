function Template() {
  let members = {
  }
  
  let methods = {
  }

  let obj = {
    ...members,
    ...methods,
  };
  return obj;
}

// Class definition

function Html(element) {

  let members = {
  }
  
  let methods = {

    getHeight: function() {
      return this.offsetHeight;
    },
    
    getWidth: function() {
      return this.offsetWidth;
    },
  }

  tick = function() {
  }

  let obj = {
    ...members,
    ...methods,
    tick,
  };

  Object.assign(element, obj);
  
  setInterval(obj.tick.bind(obj), 100);

  return element;
}

function GameState(bindTo, root, creatures) {
  let members = {
    window: Html(bindTo),
    root,
    creatures,
    app: null,
    mapContainer: null
  }
  
  let methods = {
    getWidth: function() {
      return this.window.getWidth();
    },
    getHeight: function() {
      return this.window.getHeight();
    }
  }

  let obj = {
    ...members,
    ...methods,
  };
  return obj;
}

