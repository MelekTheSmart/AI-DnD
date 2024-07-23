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
      this.messageHistory.unshift(this.chatInputField);
      this.chatInputField = "";
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
}).mount("#app");
