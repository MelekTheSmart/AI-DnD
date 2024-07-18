// 8080 URL for the express server
const URL = "http://localhost:8080";
const app = Vue.createApp({
  data() {
    return {
      title: "Function Calling Test",
      userInput: "",
      response: null,
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
    async sendRequest() {
      if (this.userInput.trim() === "") return;

      try {
        // fix this
        const response = await fetch("/api/function-call", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: this.userInput }),
        });
        this.userInput = "";

        const data = await response.json();
        console.log(this.response);
        this.response = data.response;
      } catch (error) {
        console.error("Error:", error);
        this.response = "An error occurred while processing your request.";
      }

      this.userInput = "";
    },
  },
  created() {
    console.log("Vue app loaded!");
  },
}).mount("#app");
