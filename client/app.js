// 8080 URL for the express server
const URL = "74.211.78.89";
const app = Vue.createApp({
  data() {
    return {
      title1: "Function Calling Test",
      title2: "Create Monster Test",
      pageonebool: true,
      pagetwobool: false,
      userInput_one: "",
      userInput_two: "",
      response_one: null,
      response_two: null,
      messageHistory: [],
    };
  },
  methods: {
    async examplecode() {
      // example code for how user_id change works, and deleting message history
      fetch("/api/function-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: "Your message here",
          userId: "user_id_here",
        }),
      });

      fetch("/api/message-history/user_id_here", { method: "DELETE" });
    },
    async sendRequest_one() {
      if (this.userInput_one.trim() === "") return;

      // Add user message to history

      try {
        const response = await fetch(`${URL}/AI/genchat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: this.userInput_one,
            history: this.messageHistory,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        this.response_one = data.response;
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
    async sendRequest_two() {
      if (this.userInput_two.trim() === "") return;
      try {
        const response = await fetch(`${URL}/AI/statblock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: this.userInput_two }),
        });
        this.userInput_two = "";
        const data = await response.json();
        console.log(this.response_two);
        this.response_two = data.response;
      } catch (error) {
        console.error("Error:", error);
        this.response_two = "An error occurred while processing your request.";
      }
      this.userInput_two = "";
    },
  },
  created() {
    console.log("Vue app loaded!");
  },
}).mount("#app");
