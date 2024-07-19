const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
require("dotenv").config();

// protocol to add a new schema:
// 1. add schema
// 2. make model
// 3. update its parent and children to refer to it
// 4. update its model to refer to its parent and children

mongoose.connect(process.env.MONGO_URL);

// This is the Mongoose Schema section

let userSchema = new Schema({
  // user
  username: {
    type: String,
    required: [true, "Username required"],
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
  campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
});

let campaignSchema = new Schema({
  // campaign
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
});

let dndSessionSchema = new Schema({
  // session
  notes: String,
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  encounters: [{ type: Schema.Types.ObjectId, ref: "Encounter" }],
  players: [{ type: Schema.Types.ObjectId, ref: "Creature" }],
});

let encounterSchema = new Schema({
  // encounter
  notes: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creature",
    },
  ],
  creatures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creature",
    },
  ],
  map: [
    {
      type: Schema.Types.ObjectId,
      ref: "Map",
      validate: function (p) {
        return p.length == 1;
      },
    },
  ],
});

let mapSchema = new Schema({});

let colors = [
  "FCE205",
  "FCB201",
  "ED6A09",
  "F9965B",
  "A51002",
  "DB1102",
  "CD5D51",
  "FA187D",
  "F34C74",
  "FB99A6",
  "FC4648",
  "A7034C",
  "81539C",
  "BD93D3",
  "92BAE5",
  "B8E4FD",
  "0479CB",
  "050573",
  "028C7D",
  "41E2A3",
  "495A10",
  "6CA138",
  "01A210",
  "84E248",
  "F1D18B",
  "9F7A46",
  "773E0B",
  "33200C",
  "FFFEFC",
  "ACACAC",
  "121212",
];

colors.forEach((color) => {
  mapSchema.add({
    color: {
      type: [Number],
      validate: {
        validator: function (p) {
          return p.length === 2;
        },
      },
    },
  });
});

let creatureSchema = new Schema({
  // creature
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },

  position: {
    type: [Number],
    validate: {
      validator: function (p) {
        return p.length === 2;
      },
    },
  },
  stats: [{ type: Schema.Types.ObjectId, ref: "Statblock" }],
  sprite: { type: String, required: false },
});

let statSchema = new Schema({
  // statblock
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  size: {
    type: String,
    enum: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
  },
  type: { type: String, required: true },
  alignment: String,
  armorClass: { type: Number, required: true },
  hitPoints: { type: Number, required: true },
  speed: {
    walk: Number,
    fly: Number,
    swim: Number,
    climb: Number,
    burrow: Number,
  },
  abilityScores: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    constitution: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true },
  },
  savingThrows: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
  },
  skills: [{ name: String, modifier: Number }],
  senses: [String],
  languages: [String],
  challengeRating: { type: Number, required: true },
  specialAbilities: [
    {
      name: String,
      description: String,
    },
  ],
  actions: [
    {
      name: String,
      description: String,
      attackBonus: Number,
      damage: String,
    },
  ],
  legendaryActions: [
    {
      name: String,
      description: String,
    },
  ],
  homebrew: [String],
});

userSchema.methods.validatePassword = (password) => {
  console.log(password);
  return true;
};

// This is the mongoose model declaration field

let User = mongoose.model("User", userSchema);
let Campaign = mongoose.model("Campaign", campaignSchema);
let Session = mongoose.model("Session", dndSessionSchema);
let Encounter = mongoose.model("Encounter", encounterSchema);
let Map = mongoose.model("Map", mapSchema);
let Creature = mongoose.model("Creature", creatureSchema);
let Statblock = mongoose.model("Statblock", statSchema);

User.children = [{ name: "campaigns", model: Campaign }];
Campaign.children = [{ name: "sessions", model: Session }];
Session.children = [{ name: "encounters", model: Encounter }];
Encounter.children = [
  { name: "players", model: Creature },
  { name: "creatures", model: Creature },
  { name: "map", model: Map },
];
Map.children = null;
Creature.children = [{ name: "stats", model: Statblock }];
Statblock.children = null;

User.parent = null;
Campaign.parent = { name: "user", model: User };
Session.parent = { name: "campaign", model: Campaign };
Encounter.parent = { name: "session", model: Session };
Map.parent = { name: "encounter", model: Encounter };
Creature.parent = { name: "encounter", model: Encounter };
Statblock.parent = { name: "creature", model: Creature };

let MODELS = {
  users: User,
  campaigns: Campaign,
  sessions: Session,
  encounters: Encounter,
  maps: Map,
  creatures: Creature,
  statblocks: Statblock,
};

//export field
module.exports = {
  User,
  Campaign,
  Session,
  Encounter,
  Creature,
  Statblock,
  MODELS,
};
