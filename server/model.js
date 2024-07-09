const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

// This is the Mongoose Schema section

let userSchema = new Schema({
  username: {type: String, required: [true, "Username required"]},
  password: {type: String, required: [true, "Password required"]},
  sessions: [{type: Schema.Types.objectId, ref: "Session"}],
})

let dndSessionSchema = new Schema({
  encounters: [{type: Schema.Types.ObjectId, ref: "Encounter"}],
  owner: {type: Schema.Types.ObjectId, ref: "User"},
  players: [{type: Schema.Types.ObjectId, ref: "Player"}]
})

let statSchema = new Schema({
  name: { type: String, required: true },
  size: { type: String, enum: ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'] },
  type: { type: String, required: true },
  alignment: String,
  armorClass: { type: Number, required: true },
  hitPoints: { type: Number, required: true },
  speed: {
    walk: Number,
    fly: Number,
    swim: Number,
    climb: Number,
    burrow: Number
  },
  abilityScores: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    constitution: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    wisdom: { type: Number, required: true },
    charisma: { type: Number, required: true }
  },
  savingThrows: {
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number
  },
  skills: [{ name: String, modifier: Number }],
  senses: [String],
  languages: [String],
  challengeRating: { type: Number, required: true },
  specialAbilities: [{
    name: String,
    description: String
  }],
  actions: [{
    name: String,
    description: String,
    attackBonus: Number,
    damage: String
  }],
  legendaryActions: [{
    name: String,
    description: String
  }],
  homebrew: [String]
})

let creatureSchema = new Schema({
  position: {
    type: [Number],
    validate: {
      validator: function(p) {
        return p.length === 2;
      }
    }
  },
  stats: {type: Schema.Types.ObjectId, ref: "Statblock"},
  sprite: {type: String, required: false}
})

let encounterSchema = new Schema({
  players: [
    {
      type: Schema.Type.ObjectId,
      ref: "Creature"
    }
  ],
  enemies: [
    {
      type: Schema.Type.ObjectId,
      ref: "Creature"
    }
  ],
  map: [

  ]
})

// This is the mongoose model declaration field

let User = mongoose.model("User", userSchema);
let Session = mongoose.model("Session", dndSessionSchema);
let Statblock = mongoose.model("Statblock", statSchema);
let creature = mongoose.model("Creature", creatureSchema);


//export field
module.exports = {
  User,
  Session,

};
