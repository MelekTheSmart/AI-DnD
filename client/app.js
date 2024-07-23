// 8080 URL for the express server
const URL = "http://localhost:8080";

Vue.createApp({
  data() {
    return {
      titleh1: "Template",
      users: {},
      sidebarTab: "creatures",
      sidebarShow: true,
      chatInputField: "",
      messageHistory: ["Hello"],
    };
  },
  methods: {
    setTab: function (tabId) {
      this.sidebarTab = tabId;
    },
    addMessage: function () {
      console.log("hello");
      this.messageHistory.push(this.chatInputField);
      this.chatInputField = "";
    },
  },
  created: function () {
    console.log("vue app loaded!");
  },
}).mount("#app");
