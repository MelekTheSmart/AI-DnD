// 8080 URL for the express server
const URL = "http://localhost:8080";
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
      console.log(this.userInput_one);
      try {
        const response = await fetch(`${URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: this.userInput_one }),
        });
        this.userInput_one = "";

        const data = await response.json();
        console.log(this.response_one);
        this.response_one = data.response;
      } catch (error) {
        console.error("Error:", error);
        console.log(this.userInput_one);
        console.log(this.response_one);
        this.response_one = "An error occurred while processing your request.";
      }

      this.userInput_one = "";
    },

    async sendRequest_two() {
      if (this.userInput_two.trim() === "") return;
      try {
        const response = await fetch(`${URL}/api/statblock`, {
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
