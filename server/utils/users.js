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
  let parentObj;
  try {
    parentObj = await model.parent.model.findById(parentId);
  }
  catch (error) {
    res.status(400).send("No parent matching id");
    return;
  }
  if (!parentObj) {
    res.status(400).send(`No ${model.parent.model} with ID ${parentId}`)
  }
  let child = await assembleObjectRecursive([data], model, ownerId);
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
      if (!["object",].includes(typeof(data[i]))) {
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
  console.log(model.children);
  if (model.children == null) {
    return;
  };
  let childrenGroups = model.children
  for (let i = 0; i < childrenGroups.length; i++) {
    let childrenGroup = childrenGroups[i]
    for (let child of data) {
      console.log("child:", child);
      console.log(childrenGroup.name);
      if (!(childrenGroup.name in child)) continue;
      let childData = await childrenGroup.model.findOne({_id: child}).lean()
      if (childData == null) continue;
      data[childrenGroup.name].push(childData)
      await populateRecursive([childData], childrenGroup.model)
    }
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
    console.log("campaigns is null:", req.body.campaigns == null);
    console.log("campaigns:", req.body.campaigns);
    if (req.body.campaigns != null) user.campaigns = await assembleObjectRecursive(req.body.campaigns, Campaign, user._id);
    else user.campaigns = [];
    await user.save();
    res.status(200).json(user);
  })
}

async function getUser(req, res) {
  jsonFn(req, res, async () => {
    let username = req.params.username;
    try {
      var user = await User.findOne({username}).lean();
      console.log(user);
    }
    catch (error) {
      console.log(error);
      res.status(400).send(`There is no user ${username}`);
      return;
    }
    await populateRecursive([user], User);
    res.json(user);
  })
}

async function postObj(req, res) {
  jsonFn(req, res, async () => {
    let type = MODELS[req.params.type];
    if (!type) {
      res.status(400).send(`type ${type} not found.`);
      return;
    }
    let obj = await appendChild(req.body, req.params.type, req.params.parentId, req.params.ownerId, type)
    if (!obj) return;
    res.status(200).json(obj);
  })
}

async function getObj(req, res) {
  jsonFn(req, res, async () => {
    let type = MODELS[req.params.type]
    if (!type) {
      res.status(400).send(`type ${type} not found.`);
      return;
    }
    try {
      let obj = await type.findOne({_id: req.params.id});
    }
    catch (error) {
      console.log(error);
      res.status(400).send(`No ${type} with ID ${req.params.id}`);
    }
    res.json(obj);
  })
}

async function putObj(req, res) {
  jsonFn(req, res, async () => {
    let type = MODELS[req.params.type];
    let obj = await type.findOne({_id: req.params.id}).lean();
    console.log(obj)
    if (!obj) {
      res.status(400).send(`No ${type} with ID ${req.params.id}`);
      return;
    }
    Object.assign(obj, req.params.body);
    await assembleObjectRecursive([obj], type)
    res.status(200).json(obj);
  })
}

async function delObj(req, res) {
  jsonFn(req, res, async () => {
    let type = MODELS[req.params.type];
    let objParent = await type.parent.findOne({_id: req.params.parentId});
    let index = objParent[req.params.type].indexOf(req.params.id);
    objParent[req.params.type].splice(index, 1);
    await objectParent.save();
    await type.findByIdAndDelete(req.params.id);
    res.status(200).send("object deleted.")
  })
}


module.exports = {
  postUser,
  getUser,
  postObj,
  getObj,
  putObj,
  delObj
}
