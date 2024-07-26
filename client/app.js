// 8080 URL for the express server
const URL = "74.211.78.89";
const app = Vue.createApp({
  data() {
    return {
      user: {
        campaign: {
          session: {
            encounter: {
              creatures: [
                {
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
                {
                  name: "Emerald Dragon",
                  size: "Huge",
                  type: "Dragon",
                  alignment: "Chaotic Good",
                  armorClass: 20,
                  hitPoints: 300,
                  speed: {
                    walk: 40,
                    fly: 80,
                    swim: 60,
                    climb: 40,
                    burrow: 20,
                  },
                  abilityScores: {
                    strength: 26,
                    dexterity: 14,
                    constitution: 25,
                    intelligence: 18,
                    wisdom: 20,
                    charisma: 22,
                  },
                  savingThrows: {
                    strength: 14,
                    dexterity: 8,
                    constitution: 13,
                    intelligence: 10,
                    wisdom: 12,
                    charisma: 14,
                  },
                  skills: [
                    { name: "Perception", modifier: 12 },
                    { name: "Persuasion", modifier: 14 },
                    { name: "Stealth", modifier: 8 },
                  ],
                  senses: [
                    "Blindsight 60 ft.",
                    "Darkvision 120 ft.",
                    "Truesight 60 ft.",
                    "Passive Perception 22",
                  ],
                  languages: ["Common", "Draconic", "Sylvan"],
                  challengeRating: 24,
                  specialAbilities: [
                    {
                      name: "Legendary Resistance",
                      description:
                        "If the dragon fails a saving throw, it can choose to succeed instead.",
                    },
                    {
                      name: "Aerial Legend",
                      description:
                        "The dragon can cast spells as if it were a level 20 spellcaster. It can cast spells such as 'Fly', 'Invisibility', and 'Charm Person' at will.",
                    },
                  ],
                  actions: [
                    {
                      name: "Multiattack",
                      description:
                        "The dragon makes three attacks: one with its bite and two with its claws.",
                      attackBonus: 13,
                      damage: "1d10 + 8 piercing damage",
                    },
                    {
                      name: "Breath Weapon (Recharge 5-6)",
                      description:
                        "The dragon exhales a green, toxic cloud in a 90-foot cone. Each creature in that area must make a DC 21 Constitution saving throw, taking 18d6 poison damage on a failed save, or half as much damage on a successful one.",
                      attackBonus: null,
                      damage: "18d6 poison damage",
                    },
                    {
                      name: "Tail Attack",
                      description:
                        "The dragon makes a tail attack against one target within 15 feet.",
                      attackBonus: 13,
                      damage: "2d8 + 8 bludgeoning damage",
                    },
                  ],
                  legendaryActions: [
                    {
                      name: "Detect",
                      description:
                        "The dragon makes a Wisdom (Perception) check.",
                    },
                    {
                      name: "Wing Attack (Costs 2 Actions)",
                      description:
                        "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 2d6 + 8 bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.",
                    },
                    {
                      name: "Tail Attack (Costs 2 Actions)",
                      description: "The dragon can use its tail attack action.",
                    },
                  ],
                },
                {
                  name: "Hobgoblin",
                  size: "Medium",
                  type: "Humanoid",
                  alignment: "Lawful Evil",
                  armorClass: 18,
                  hitPoints: 24,
                  speed: {
                    walk: 30,
                    fly: 0,
                    swim: 0,
                    climb: 0,
                    burrow: 0,
                  },
                  abilityScores: {
                    strength: 14,
                    dexterity: 15,
                    constitution: 12,
                    intelligence: 10,
                    wisdom: 11,
                    charisma: 10,
                  },
                  savingThrows: {
                    strength: 2,
                    dexterity: 3,
                    constitution: 1,
                    intelligence: 0,
                    wisdom: 0,
                    charisma: 0,
                  },
                  skills: [
                    { name: "Perception", modifier: 2 },
                    { name: "Stealth", modifier: 4 },
                  ],
                  senses: ["Darkvision 60 ft.", "Passive Perception 12"],
                  languages: ["Common", "Goblin"],
                  challengeRating: 1,
                  specialAbilities: [
                    {
                      name: "Martial Advantage",
                      description:
                        "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated.",
                    },
                  ],
                  actions: [
                    {
                      name: "Longsword",
                      description:
                        "Melee Weapon Attack: +4 to hit, reach 5 ft., one target.",
                      attackBonus: 4,
                      damage: "1d8 + 2 slashing",
                    },
                    {
                      name: "Shortbow",
                      description:
                        "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target.",
                      attackBonus: 4,
                      damage: "1d6 + 2 piercing",
                    },
                  ],
                  legendaryActions: [],
                },
              ],
            },
          },
        },
      },
      sidebarTab: "initiative",
      initiativeStarted: false,
      sidebarShow: true,
      chatInputField: "",
      sortedCreatures: [],
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
        name: "Emerald Dragon",
        size: "Huge",
        type: "Dragon",
        alignment: "Chaotic Good",
        armorClass: 20,
        hitPoints: 300,
        speed: {
          walk: 40,
          fly: 80,
          swim: 60,
          climb: 40,
          burrow: 20,
        },
        abilityScores: {
          strength: 26,
          dexterity: 14,
          constitution: 25,
          intelligence: 18,
          wisdom: 20,
          charisma: 22,
        },
        savingThrows: {
          strength: 14,
          dexterity: 8,
          constitution: 13,
          intelligence: 10,
          wisdom: 12,
          charisma: 14,
        },
        skills: [
          { name: "Perception", modifier: 12 },
          { name: "Persuasion", modifier: 14 },
          { name: "Stealth", modifier: 8 },
        ],
        senses: [
          "Blindsight 60 ft.",
          "Darkvision 120 ft.",
          "Truesight 60 ft.",
          "Passive Perception 22",
        ],
        languages: ["Common", "Draconic", "Sylvan"],
        challengeRating: 24,
        specialAbilities: [
          {
            name: "Legendary Resistance",
            description:
              "If the dragon fails a saving throw, it can choose to succeed instead.",
          },
          {
            name: "Aerial Legend",
            description:
              "The dragon can cast spells as if it were a level 20 spellcaster. It can cast spells such as 'Fly', 'Invisibility', and 'Charm Person' at will.",
          },
        ],
        actions: [
          {
            name: "Multiattack",
            description:
              "The dragon makes three attacks: one with its bite and two with its claws.",
            attackBonus: 13,
            damage: "1d10 + 8 piercing damage",
          },
          {
            name: "Breath Weapon (Recharge 5-6)",
            description:
              "The dragon exhales a green, toxic cloud in a 90-foot cone. Each creature in that area must make a DC 21 Constitution saving throw, taking 18d6 poison damage on a failed save, or half as much damage on a successful one.",
            attackBonus: null,
            damage: "18d6 poison damage",
          },
          {
            name: "Tail Attack",
            description:
              "The dragon makes a tail attack against one target within 15 feet.",
            attackBonus: 13,
            damage: "2d8 + 8 bludgeoning damage",
          },
        ],
        legendaryActions: [
          {
            name: "Detect",
            description: "The dragon makes a Wisdom (Perception) check.",
          },
          {
            name: "Wing Attack (Costs 2 Actions)",
            description:
              "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 2d6 + 8 bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed.",
          },
          {
            name: "Tail Attack (Costs 2 Actions)",
            description: "The dragon can use its tail attack action.",
          },
        ],
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
    sortCreatures: function () {
      // Sort creatures and update sortedCreatures data property
      this.user.campaign.session.encounter.creatures = [
        ...this.user.campaign.session.encounter.creatures,
      ].sort((a, b) => b.initiative - a.initiative);
    },
    startInitiative: function () {
      this.initiativeStarted = true;
      this.sortCreatures();
    },
  },
  created: function () {
    console.log("vue app loaded!");
  },
  computed: {
    // sortedCreatures() {
    //   // Return a new array to ensure reactivity
    //   return [...this.user.campaign.session.encounter.creatures].sort(
    //     (a, b) => b.initiative - a.initiative
    //   );
    // },
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
