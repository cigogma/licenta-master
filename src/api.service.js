const axios = require("axios");
const store = require("node-persist");
const repository = require("./repository");

class ApiService {
  authToken = process.env.API_SECRET;
  apiBase = process.env.API_URL + "/api";

  async uploadProbes(devices) {
    console.log(
      "uploading probes total probes: " + repository.getTotalProbes()
    );
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };
      const body = {
        devices,
      };
      // console.log(config);
      const response = await axios.post(
        `${this.apiBase}/s/data/upload`,
        body,
        config
      );
      console.log("response : " + response.status);
      // console.log(response.data);
      return response.body;
    } catch (e) {
      console.log(e.response.request._redirectable._redirectCount);
      console.log(e.response.data);
      console.log(e.message);
      throw e;
    }
  }
}

const apiService = new ApiService();

module.exports = apiService;
