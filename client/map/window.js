function getHtmlHeight(element) {
  return element.
}

function Window(root) {
  let members = {
  }
  
  let methods = {
  }

  let tick = function() {
    console.log("hello world");
  }

  let tickInterval = 100

  let obj = {
    ...members,
    ...methods,
    tick: setInterval(tick, tickInterval)
  };
  return obj;
}


let w = Window();
