App = App; // I don't like how scripts share scope without any declarations, so this useless line is to make me happy. -Andrew

function bindElements(source, target) {
    const sourceRect = source.getBoundingClientRect();
    function updateTarget() {
        target.style.position = 'absolute';
        target.style.left = `${sourceRect.left}px`;
        target.style.top = `${sourceRect.top}px`;
        target.style.width = `${sourceRect.width}px`;
        target.style.height = `${sourceRect.height}px`;
    }

    // Initial update
    updateTarget();

    // Update target when the window is resized
    window.addEventListener('resize', updateTarget);

    // Optional: Use MutationObserver to track changes to the source element
    const observer = new MutationObserver(updateTarget);
    observer.observe(source, { attributes: true, childList: true, subtree: true });

    // Cleanup when no longer needed
    return () => {
        window.removeEventListener('resize', updateTarget);
        observer.disconnect();
    };
}

let pixiCanvas = document.getElementById("pixicanvas");
let screen = document.getElementById('game-container');
bindElements(screen, pixiCanvas);

var APP = App(pixiCanvas);

// 8080 url for the express server
const url = "74.211.78.89";
(async () => {
await APP._init();
let creature2 = {position: [300, 300], sprite: "/images/image.png", hp: 10, stats: {hitpoints: 10}}
let creature = {position: [400, 400], sprite: "/images/knight.png", hp: 10, stats: {hitpoints: 15}}
let c = await Creature(creature);
  console.log(c);
APP.addCreature(c);
let d = await Creature(creature2);
APP.addCreature(d);
const vueApp = Vue.createApp({
  data() {
    return {
      app: APP,
      creatures: APP.creatures,
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
    switchCursorMode: function(to) {
      this.app.map.setInteractionCase(to);
    },
    colorMap: function(color) {
      console.log(color);
      this.app.map.drawingData.color = '#' + color;
    },
    setTab: function (tabId) {
      this.sidebarTab = tabId;
    },
    addMessage: function () {
      this.messageHistory.unshift(this.chatInputField);
      this.chatInputField = "";
    },
    sortCreatures: function () {
      // Sort creatures and update sortedCreatures data property
      this.creatures = [
        ...this.creatures,
      ].sort((a, b) => b.initiative - a.initiative);
    },
    startInitiative: function () {
      this.initiativeStarted = true;
      this.sortCreatures();
    },
  },
  created: function () {
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

})()
