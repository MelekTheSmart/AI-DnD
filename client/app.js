// 8080 URL for the express server
const URL = "http://localhost:8080";

Vue.createApp({
  data() {
    return {
      titleh1: "Template",
      users: {},
      sidebarTab: "showGeneratedStatblock",
      sidebarShow: true,
      chatInputField: "",
      messageHistory: ["Hello"],
      currentCreature: {
        name: "Goblin",
        size: "Small",
        type: "Humanoid",
        alignment: "Neutral Evil",
        armorClass: 15,
        hitPoints: 7,
        speed: {
          walk: 30,
        },
        abilityScores: {
          strength: 8,
          dexterity: 14,
          constitution: 10,
          intelligence: 10,
          wisdom: 8,
          charisma: 8,
        },
        savingThrows: {},
        skills: [
          {
            name: "Stealth",
            modifier: 6,
          },
        ],
        senses: {"Darkvision", " 60 ft."},
        languages: ["Common", "Goblin"],
        challengeRating: 0.25,
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
              "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.",
            attackBonus: 4,
            damage: "1d6+2",
          },
        ],
        legendaryActions: [],
        homebrew: [],
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
            keysAndValues.push(key);
            // Push each key-value pair from nested object\
            nested.forEach((entry) => {
              keysAndValues.push(`${entry}`);
            });
          } else {
            // Push key-value pair for primitive values
            keysAndValues.push(`${key}:${obj[key]}`);
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
      console.log(this.getKeysAndValues(this.currentCreature));
    },
  },
}).mount("#app");
