const express = require("express");
const cors = require("cors");
const {User, Session, Statblock, Creature, Encounter} = require("./model");
const {parse} = require('key-value-parser')
const app = express();
const mongoose = require('mongoose')


// utility

async function assembleObjectRecursive(data, model=User) {
  let save = async (data, model) => {
    let finalData = []
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      let dataModel = new model(item)
      await dataModel.save()
      finalData.push(dataModel)
    }
    return finalData
  }

  if (!("children" in model)) {
    return await save(data, model)
  }

  let children = model.children;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < children.length; j++) {
      let child = children[j]
      if (!(child.name in data[i])) {
        continue
      }
      let newdata = data[i][child.name]
      newdata = await assembleObjectRecursive(newdata, child.model)
      for (let k = 0; k < newdata.length; k++) {
        data[i][child.name][k] = newdata[k]._id
      }
    }
  }
  let finalData = await save(data, model)
  return finalData
}

async function populateRecursive(data, model) {
  if (!("children" in model)) return;
  let children = model.children
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    if (!(child.name in data)) continue;
    let childData = await child.model.findOne({_id: data[child.name]}).lean()
    if (childData == null) continue;
    data[child.name] = childData
    await populateRecursive(childData, child.model)
  }
}

// middleware
function validate(req, res, next) {
  // code here  
  next()
}

app.use(function(req, res, next) {
  console.log("request to " + req.url + " with ip " + req.ip)
  next()
})
app.use(cors());
app.use(express.json());

// This is where the general endpoints are defined

app.post("/users", async (req, res) => {
  let user = await assembleObjectRecursive([req.body])
  user = user[0]
  res.status(200).json(user);
})

app.get("/users/:username", async (req, res) => {
  let username = req.params.username
  let user = await User.findOne({username}).lean()
  await populateRecursive(user, User);
  console.log(user);
  res.json(user);
})

app.get("/

// This is where the server is listening
app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});


// This is where test code goes
async function test() {
  data = await User.findOne({username: "don"}).lean()
  await populateRecursive(data, User);
  console.log(data)
}
