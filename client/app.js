// 8080 URL for the express server
const URL = "http://localhost:8080";

Vue.createApp({
  data() {
    return {
      user: {},
      titleh1: "Template",
      users: {},
      sidebarTab: "showGeneratedStatblock",
      sidebarShow: true,
      chatInputField: "",
      messageHistory: ["Hello"],
      colors: [
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
      ],

      currentCreature: {
        name: "Goblin",
        size: "Small",
        type: "Humanoid",
        alignment: "Neutral Evil",
        armorClass: 15,
        hitPoints: 7,
        speed: {
          walk: 30,
          fly: 0,
          swim: 0,
          climb: 0,
          burrow: 0,
        },
        abilityScores: {
          strength: 8,
          dexterity: 14,
          constitution: 10,
          intelligence: 10,
          wisdom: 8,
          charisma: 8,
        },
        savingThrows: {
          strength: -1,
          dexterity: +2,
          constitution: +0,
          intelligence: +0,
          wisdom: -1,
          charisma: -1,
        },
        skills: [
          { name: "Stealth", modifier: +6 },
          { name: "Deception", modifier: +1 },
        ],
        senses: ["Darkvision 60 ft.", "blindsight 10 ft."],
        languages: ["Common", "Goblin"],
        challengeRating: 1 / 4,
        specialAbilities: [
          {
            name: "Nimble Escape",
            description:
              "The goblin can take the Disengage or Hide action as a bonus action on each of its turns.",
          },
        ],
        actions: [
          {
            name: "Scimitar",
            description:
              "Melee Weapon Attack: +4 to hit, reach 5 ft., one target.",
            attackBonus: 4,
            damage: "1d6 + 2 slashing damage",
          },
          {
            name: "Shortbow",
            description:
              "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target.",
            attackBonus: 4,
            damage: "1d6 + 2 piercing damage",
          },
        ],
        legendaryActions: [],
      },
    };
  },
  methods: {
    setTab: function (tabId) {
      this.sidebarTab = tabId;
    },
    addMessage: function () {
      this.messageHistory.unshift(this.chatInputField);
      this.chatInputField = "";
    },
    checkObjeck: function (object) {
      if (!(typeof object == "object")) {
        return object;
      }
      for (let item in object) {
        if (typeof object[item] == "object") {
          for (let key in object[item]) {
            console.log(key, object[item][key]);
          }
        }
        return item;
      }
    },
    getKeysAndValues: function (obj) {
      let keysAndValues = [];

      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object" && obj[key] !== null) {
            let nested = this.getKeysAndValues(obj[key]);
            if (!(key == 0)) {
              keysAndValues.push(key + ":");
            }
            // Push each key-value pair from nested object\
            nested.forEach((entry) => {
              keysAndValues.push(`${entry}`);
            });
          } else {
            // Push key-value pair for primitive values
            if (isNaN(parseInt(key))) {
              keysAndValues.push(`${key}: ${obj[key]}`);
            } else {
              keysAndValues.push(`${obj[key]}`);
            }
          }
        }
      }

      return keysAndValues;
    },
    async sendRequest() {
      // Add user message to history

      try {
        const response = await fetch(`${URL}/AI/genchat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: this.chatInputField,
            history: this.messageHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.response = data.response;
        //add user input to message history after going through index.js, pushing to messagehistory
        //before sending messagehistory to api duplicates messages
        this.messageHistory.push({ role: "user", content: this.userInput_one });

        // Add AI response to history
        this.messageHistory.push({
          role: "assistant",
          content: this.response_one,
        });

        console.log("Updated message history:", this.messageHistory);
      } catch (error) {
        console.error("Error:", error);
        this.response_one = "An error occurred while processing your request.";
      }

      this.userInput_one = "";
    },
  },
  created: function () {
    console.log("vue app loaded!");
  },
  computed: {
    getCreatureList: function () {
      description = [];
      let list = this.getKeysAndValues(this.currentCreature);
      for (let key in list) {
        splitted = list[key].split(":");
        description[splitted[1]] = splitted[0];
      }
      return list;
    },
  },
}).mount("#app");
