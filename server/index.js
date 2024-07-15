const express = require("express");
const cors = require("cors");
const {User, Campaign, Session, Statblock, Creature, Encounter} = require("./model");
const {parse} = require('key-value-parser')
const app = express();
const mongoose = require('mongoose');


// utility

function getIds(data) {
  ids = []
  for (let i = 0; i < data.length; i++) {
    ids.push(data[i]._id)
  }
  return ids;
}

async function appendChild(data, childname, parentId, ownerId, model) {
  let child = assembleObjectRecursive(data, model, ownerId)[0];
  console.log("model:", model.parent.model);
  console.log("find all:", await model.parent.model.find())
  console.log("query by id:", await model.parent.model.findOne({_id: parentId}));
  console.log("id:", parentId);
  let parentObj = await model.parent.model.findById(parentId);
  parentObj[childname].push(child);
  await parentObj.save()
  return child;
}

async function assembleObjectRecursive(data, model=User, owner=null) {
  let save = async (data, model) => {
    let finalData = []
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      if (owner) item.owner = owner;
      let dataModel = new model(item)
      await dataModel.save()
      finalData.push(dataModel)
    }
    return getIds(finalData);
  }

  if (model.children == null) {
    return await save(data, model)
  }

  let children = model.children;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < children.length; j++) {
      if (!["object", "mongodb"].includes(typeof(data[i]))) {
        continue
      }
      let child = children[j]
      if (!(child.name in data[i])) {
        continue
      }
      let newdata = data[i][child.name]
      ids = await assembleObjectRecursive(newdata, child.model, owner)
      data[i][child.name] = ids;
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
  let user = new User(req.body)
  user.campaigns = await assembleObjectRecursive(req.body.campaigns, Campaign, user._id)
  console.log(user);
  await user.save();
  res.status(200).json(user);
})

app.get("/users/:username", async (req, res) => {
  let username = req.params.username
  let user = await User.findOne({username}).lean()
  await populateRecursive(user, User);
  res.json(user);
})

app.post("/campaigns/:ownerId/:parentId", async (req, res) => {
  let parentId = req.params.parentId;
  let ownerId = req.params.ownerId;
  let campaign = await assembleObjectRecursive([req.body], Campaign, ownerId)[0]
  let user = await User.findOne({id: parentId});
  user.campaigns.push(campaign);
  await user.save()
  res.status(200).json(campaign);
})

app.post("/sessions/:ownerId/:parentId", async (req, res) => {
  let parentId = req.params.parentId;
  let ownerId = req.params.ownerId;
  let session = await appendChild(req.body, "sessions", parentId, ownerId, Session)
  res.status(200).json(session);
})


// This is where the server is listening
app.listen(8080, function () {
  console.log("server is running on http://localhost:8080...");
});


// This is where test code goes
async function test() {
  data = await User.findOne({username: "don"}).lean()
  await populateRecursive(data, User);

}
