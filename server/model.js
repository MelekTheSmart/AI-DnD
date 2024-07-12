const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);

// This is the Mongoose Schema section

let userSchema = new Schema({ // user
  username: {
    type: String, required: [true, "Username required"]
  },
  password: {
    type: String, required: [true, "Password required"]
  },
  campaigns: [{type: Schema.Types.ObjectId, ref: "Campaign"}]
})

let campaignSchema = new Schema({ // campaign
  sessions: [{type: Schema.Types.ObjectId, ref: "Session"}]
})

let dndSessionSchema = new Schema({ // session
  encounters: [{type: Schema.Types.ObjectId, ref: "Encounter"}],
  players: [{type: Schema.Types.ObjectId, ref: "Player"}]
})

let encounterSchema = new Schema({ // encounter
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creature"
    }
  ],
  creatures: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creature"
    }
  ],
  map: [

  ]
})


let creatureSchema = new Schema({ // creature
  position: {
    type: [Number],
    validate: {
      validator: function(p) {
        return p.length === 2;
      }
    }
  },
  stats: [{type: Schema.Types.ObjectId, ref: "Statblock"}],
  sprite: {type: String, required: false}
})

let statSchema = new Schema({ // statblock
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

userSchema.methods.validatePassword = (password) => {
  console.log(password);
  return true;
}

// This is the mongoose model declaration field

let User = mongoose.model("User", userSchema);
let Campaign = mongoose.model("Campaign", campaignSchema);
let Session = mongoose.model("Session", dndSessionSchema);
let Encounter = mongoose.model("Encounter", encounterSchema);
let Creature = mongoose.model("Creature", creatureSchema);
let Statblock = mongoose.model("Statblock", statSchema);

User.children = [{name: "campaigns", model: Campaign}]
Campaign.children = [{name: "sessions", model: Session}]
Session.children = [{name: "encounters", model: Encounter}]
Encounter.children = [{name: "players", model: Creature}, {name: "creatures", model: Creature}]
Creature.children = [{name: "stats", model: Statblock}]


//export field
module.exports = {
  User,
  Campaign,
  Session,
  Encounter,
  Creature,
  Statblock,
};
