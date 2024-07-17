const express = require('express');
const {User, Campaign, Session, Encounter, Statblock, Creature, Map, MODELS} = require('../resource/model');

const jsonFn = express.json();


// utility

function getIds(data) {
  ids = []
  for (let i = 0; i < data.length; i++) {
    ids.push(data[i]._id)
  }
  return ids;
}

async function appendChild(data, childname, parentId, ownerId, model) {
  let child = await assembleObjectRecursive([data], model, ownerId);
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
        console.log(child.name);
        console.log(data[i]);
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
  if (model.children == null) return;
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

// endpoint functions

async function template(req, res) {
  jsonFn(req, res, async () => {
  })
}

async function postUser(req, res) {
  jsonFn(req, res, async () => {
    let user = new User(req.body);
    if (req.body.campaigns !== null) user.campaigns = await assembleObjectRecursive(req.body.campaigns, Campaign, user._id);
    else user.campaigns = [];
    await user.save();
    res.status(200).json(user);
  })
}

async function getUser(req, res) {
  jsonFn(req, res, async () => {
    let username = req.params.username
    let user = await User.findOne({username}).lean()
    await populateRecursive(user, User);
    res.json(user);
  })
}

async function postObj(req, res) {
  jsonFn(req, res, async () => {
    let type = MODELS[req.params.type];
    let obj = await appendChild(req.body, req.params.type, req.params.parentId, req.params.ownerId, type)
    res.status(200).json(obj);
  })
}

module.exports = {
  postUser,
  getUser,
  postObj,
}
