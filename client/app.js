// 8080 URL for the express server
const URL = "http://localhost:8080";

Vue.createApp({
  data() {
    return {
      titleh1: "Template",
    };
  },
  methods: {},
  created: function () {
    console.log("vue app loaded!");
  },
}).mount("#app");
