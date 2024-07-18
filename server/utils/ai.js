const openai = new OpenAI({
  apiKey: "Insert API key here",
});

function helloWorld(appendString) {
  let hello = "Hello World! " + appendString;
  console.log(hello);
  return hello;
}

function getPlayerHandbookTOC() {
  return `Contents
  Preface 4
  Introduction 5
    Worlds of Adventure 5
    Using This Book 6
    How to Play 6
    Adventures 7
  Part 1 9
    Chapter 1: Step-by-Step Characters 11
      Beyond 1st Level 15
    Chapter 2: Races 17
      Choosing a Race 17
      Dwarf 18
      Elf 21
      Halfling 26
      Human 29
      Dragonborn 32
      Gnome 35
      Half-Elf 38
      Half-Orc 40
      Tiefling 42
    Chapter 3: Classes 45
      Barbarian 46
      Bard 51
      Cleric 56
      Druid 64
      Fighter 70
      Monk 76
      Paladin 82
      Ranger 89
      Rogue 94
      Sorcerer 99
      Warlock 105
      Wizard 112
    Chapter 4: Personality and Background 121
      Character Details 121
      Inspiration 125
      Backgrounds 125
    Chapter 5: Equipment 143
      Starting Equipment 143
      Wealth 143
      Armor and Shields 144
      Weapons 146
      Adventuring Gear 148
      Tools 154
      Mounts and Vehicles 155
      Trade Goods 157
      Expenses 157
      Trinkets 159
    Chapter 6: Customization Options 163
      Multiclassing 163
      Feats 165
  Part 2 171
    Chapter 7: Using Ability Scores 173
      Ability Scores and Modifiers 173
      Advantage and Disadvantage 173
      Proficiency Bonus 173
      Ability Checks 174
      Using Each Ability 175
      Saving Throws 179
    Chapter 8: Adventuring 181
      Time 181
      Movement 181
      The Environment 183
      Social Interaction 185
      Resting 186
      Between Adventures 186
    Chapter 9: Combat 189
      The Order of Combat 189
      Movement and Position 190
      Actions in Combat 192
      Making an Attack 193
      Cover 196
      Damage and Healing 196
      Mounted Combat 198
      Underwater Combat 198
  Part 3 199
    Chapter 10: Spellcasting 201
      What Is a Spell? 201
      Casting a Spell 202
    Chapter 11: Spells 207
      Spell Lists 207
      Spell Descriptions 211
  Appendix A: Conditions 290
  Appendix B: Gods of the Multiverse 293
  Appendix C: The Planes of Existence 300
    The Material Plane 300
    Beyond the Material 301
  Appendix D: Creature Statistics 304
  Appendix E: Inspirational Reading 312
  Index 313
  Character Sheet 317`;
}

function getDungeonMastersGuideTOC() {
  return `CONTENTS
  INTRODUCTION 4
    The Dungeon Master 4
    How to Use This Book 4
    Know Your Players 6
    Campaign Tracking 6
  PART 1 7
    CHAPTER 1: A WORLD OF YOUR OWN 9
      The Big Picture 9
      Gods of Your World 10
      Mapping Your Campaign 14
      Settlements 15
      Languages and Dialects 20
      Factions and Organizations 21
      Magic in Your World 23
      Creating a Campaign 25
      Campaign Events 26
      Play Style 34
      Tiers of Play 36
      Flavors of Fantasy 38
    CHAPTER 2: CREATING A MULTIVERSE 43
      The Planes 43
      Planar Travel 44
      Astral Plane 46
      Ethereal Plane 48
      Feywild 49
      Shadowfell 51
      Inner Planes 52
      Outer Planes 57
      Other Planes 67
      Known Worlds of the Material Plane 68
  PART 2 69
    CHAPTER 3: CREATING ADVENTURES 71
      Elements of a Great Adventure 71
      Published Adventures 72
      Adventure Structure 72
      Adventure Types 72
      Complications 79
      Creating Encounters 81
      Random Encounters 85
    CHAPTER 4: CREATING NONPLAYER CHARACTERS 89
      Designing NPCs 89
      NPC Party Members 92
      Contacts 93
      Hirelings 94
      Extras 94
      Villains 94
      Villainous Class Options 96
    CHAPTER 5: ADVENTURE ENVIRONMENTS 99
      Dungeons 99
      Mapping a Dungeon 102
      Wilderness 106
      Mapping a Wilderness 108
      Wilderness Survival 109
      Settlements 112
      Mapping a Settlement 114
      Urban Encounters 114
      Unusual Environments 116
      Traps 120
    CHAPTER 6: BETWEEN ADVENTURES 125
      Linking Adventures 125
      Recurring Expenses 126
      Downtime Activities 127
    CHAPTER 7: TREASURE 133
      Types of Treasure 133
      Random Treasure 133
      Magic Items 135
      Sentient Magic Items 214
      Artifacts 219
      Other Rewards 227
  PART 3 233
    CHAPTER 8: RUNNING THE GAME 235
      Table Rules 235
      The Role of Dice 236
      Using Ability Scores 237
      Exploration 242
      Social Interaction 244
      Objects 246
      Combat 247
      Chases 252
      Siege Equipment 255
      Diseases 256
      Poisons 257
      Madness 258
      Experience Points 260
    CHAPTER 9: DUNGEON MASTER'S WORKSHOP 263
      Ability Options 263
      Adventuring Options 266
      Combat Options 270
      Creating a Monster 273
      Creating a Spell 283
      Creating a Magic Item 284
      Creating New Character Options 285
  APPENDIX A: RANDOM DUNGEONS 290
      Starting Area 290
      Passages 290
      Doors 291
      Chambers 291
      Stairs 291
      Connecting Areas 292
      Stocking a Dungeon 292
  APPENDIX B: MONSTER LISTS 302
  APPENDIX C: MAPS 310
  APPENDIX D: DUNGEON MASTER INSPIRATION 316
  INDEX 317`;
}

function getMonsterManualTOC() {
  return `CONTENTS
  Introduction 4
    Aarakocra 12
    Aboleth 13
    Angels 15
    Animated Objects 19
    Ankheg 21
    Azer 22
    Banshee 23
    Basilisk 24
    Behir 25
    Beholders 26
    Blights 31
    Bugbears 33
    Bulette 34
    Bullywug 35
    Cambion 36
    Carrion Crawler 37
    Centaur 38
    Chimera 39
    Chuul 40
    Cloaker 41
    Cockatrice 42
    Couatl 43
    Crawling Claw 44
    Cyclops 45
    Darkmantle 46
    Death Knight 47
    Demilich 48
    Demons 50
    Devils 66
    Dinosaurs 79
    Displacer Beast 81
    Doppelganger 82
    Dracolich 83
    Dragon, Shadow 84
    Dragons 86
    Dragon Turtle 119
    Drider 120
    Dryad 121
    Duergar 122
    Elementals 123
    Elves: Drow 126
    Empyrean 130
    Ettercap 131
    Ettin 132
    Faerie Dragon 133
    Flameskull 134
    Flumph 135
    Fomorian 136
    Fungi 137
    Galeb Duhr 139
    Gargoyle 140
    Genies 141
    Ghost 147
    Ghouls 148
    Giants 149
    Gibbering Mouther 157
    Gith 158
    Gnolls 162
    Gnome, Deep (Svirfneblin) 164
    Goblins 165
    Golems 167
    Gorgon 171
    Grell 172
    Grick 173
    Griffon 174
    Grimlock 175
    Hags 176
    Half-Dragon 180
    Harpy 181
    Hell Hound 182
    Helmed Horror 183
    Hippogriff 184
    Hobgoblins 185
    Homunculus 188
    Hook Horror 189
    Hydra 190
    Intellect Devourer 191
    Invisible Stalker 192
    Jackalwere 193
    Kenku 194
    Kobolds 195
    Kraken 196
    Kuo-toa 198
    Lamia 201
    Lich 202
    Lizardfolk 204
    Lycanthropes 206
    Magmin 212
    Manticore 213
    Medusa 214
    Mephits 215
    Merfolk 218
    Merrow 219
    Mimic 220
    Mind Flayer 221
    Minotaur 223
    Modrons 224
    Mummies 227
    Myconids 230
    Nagas 233
    Nightmare 235
    Nothic 236
    Ogres 237
    Oni 239
    Oozes 240
    Orcs 244
    Otyugh 248
    Owlbear 249
    Pegasus 250
    Peryton 251
    Piercer 252
    Pixie 253
    Pseudodragon 254
    Purple Worm 255
    Quaggoth 256
    Rakshasa 257
    Remorhazes 258
    Revenant 259
    Roc 260
    Roper 261
    Rust Monster 262
    Sahuagin 263
    Salamanders 265
    Satyr 267
    Scarecrow 268
    Shadow 269
    Shambling Mound 270
    Shield Guardian 271
    Skeletons 272
    Slaadi 274
    Specter 279
    Sphinxes 280
    Sprite 283
    Stirge 284
    Succubus/Incubus 285
    Tarrasque 286
    Thri-kreen 288
    Treant 289
    Troglodyte 290
    Troll 291
    Umber Hulk 292
    Unicorn 293
    Vampires 295
    Water Weird 299
    Wight 300
    Will-o'-wisp 301
    Wraith 302
    Wyvern 303
    Xorn 304
    Yetis 305
    Yuan-ti 307
    Yugoloths 311
    Zombies 315
  Appendix A: Miscellaneous Creatures 317
  Appendix B: Nonplayer Characters 342
  Index of Stat Blocks 351`;
}

function getTimeOfDay() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let timeOfDay = "AM";
  if (hours > 12) {
    hours = hours - 12;
    timeOfDay = "PM";
  }
  return `${hours}:${minutes}:${seconds} ${timeOfDay}`;
}

function GetToDoList() {
  try {
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    return jsonData;
  } catch (error) {
    console.error("Error reading the JSON file:", error);
    return "Error reading the to-do list.";
  }
}

function AddToDoList(task) {
  console.log("adding");
  try {
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const todoList = JSON.parse(jsonData);

    const newTask = {
      id: todoList.todoList.length + 1,
      task: task,
      status: "pending",
    };

    todoList.todoList.push(newTask);
    fs.writeFileSync(filePath, JSON.stringify(todoList, null, 2));
    return "Task added successfully.";
  } catch (error) {
    console.error("Error updating the JSON file:", error);
    return "Error adding the task.";
  }
}

function RemoveToDoList(id) {
  try {
    console.log("removing" + id);
    const filePath = path.resolve(__dirname, "data", "todolist.json");
    const jsonData = fs.readFileSync(filePath, "utf8");
    const todoList = JSON.parse(jsonData);
    todoList.todoList = todoList.todoList.filter((task) => task.id !== id);
    todoList.todoList.forEach((task, index) => {
      task.id = index + 1;
    });
    fs.writeFileSync(filePath, JSON.stringify(todoList, null, 2));
    return "Task removed successfully.";
  } catch (error) {
    console.error("Error updating the JSON file:", error);
    return "Error removing the task.";
  }
}

async function callChatGPTWithFunctions(messages) {
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "helloWorld",
          description: "Prints hello world with the string passed to it",
          parameters: {
            type: "object",
            properties: {
              appendString: {
                type: "string",
                description: "The string to append to the hello world message",
              },
            },
            required: ["appendString"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getTimeOfDay",
          description: "Get the time of day.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "GetToDoList",
          description: "Get a list of things to do.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "AddToDoList",
          description: "Add a task to the to-do list.",
          parameters: {
            type: "object",
            properties: {
              task: {
                type: "string",
                description: "The task to add to the to-do list",
              },
            },
            required: ["task"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "RemoveToDoList",
          description: "Remove a task from the to-do list.",
          parameters: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "The ID of the task to remove from the to-do list",
              },
            },
            required: ["id"],
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getPlayerHandbookTOC",
          description:
            "Returns the table of contents for the Player's Handbook.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getDungeonMastersGuideTOC",
          description:
            "Returns the table of contents for the Dungeon Master's Guide.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
      {
        type: "function",
        function: {
          name: "getMonsterManualTOC",
          description: "Returns the table of contents for the Monster Manual.",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  messages.push(chat.choices[0].message);
  if (chat.choices[0].message.tool_calls) {
    for (const toolCall of chat.choices[0].message.tool_calls) {
      const functionName = toolCall.function.name;
      const argumentObj = JSON.parse(toolCall.function.arguments);
      let content = "";

      switch (functionName) {
        case "helloWorld":
          content = helloWorld(argumentObj.appendString);
          break;
        case "getTimeOfDay":
          content = getTimeOfDay();
          break;
        case "GetToDoList":
          content = GetToDoList();
          break;
        case "AddToDoList":
          content = AddToDoList(argumentObj.task);
          break;
        case "RemoveToDoList":
          content = RemoveToDoList(argumentObj.id);
          break;
        case "getPlayerHandbookTOC":
          content = getPlayerHandbookTOC();
          break;
        case "getDungeonMastersGuideTOC":
          content = getDungeonMastersGuideTOC();
          break;
        case "getMonsterManualTOC":
          content = getMonsterManualTOC();
          break;
        default:
          console.log("Function not found");
          content = "Function not found";
          break;
      }

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        name: functionName,
        content,
      });
    }
  }

  return messages;
}

async function mothercaller(messages) {
  let chat = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    tools: [
      {
        type: "function",
        function: {
          name: "callChatGPTWithFunctions",
          description:
            "Sends a prompt to a ChatGPT-3.5 turbo function caller ONLY if the user calls with a '/' to indicate command.",
          parameters: {
            type: "object",
            properties: {
              userMessage: {
                type: "string",
                description:
                  "The user's message to be processed by the function caller.",
              },
            },
            required: ["userMessage"],
          },
        },
      },
    ],
    tool_choice: "auto",
  });

  messages.push(chat.choices[0].message);

  if (chat.choices[0].message.tool_calls) {
    for (const toolCall of chat.choices[0].message.tool_calls) {
      if (toolCall.function.name === "callChatGPTWithFunctions") {
        let argumentObj = JSON.parse(toolCall.function.arguments);
        let functionMessages = [
          {
            role: "system",
            content:
              "You are a helpful assistant that can use various functions.",
          },
          { role: "user", content: argumentObj.userMessage },
        ];
        let updatedMessages = await callChatGPTWithFunctions(functionMessages);
        //console.log(updatedMessages);
        // Add the function response
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: JSON.stringify(updatedMessages.slice(2)), // Convert the messages to a string
        });
      } else {
        console.log("Function not found");
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: "Function not found",
        });
      }
    }
  }

  let finalResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return finalResponse.choices[0].message.content;
}

module.exports = { mothercaller };
