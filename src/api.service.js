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
        `${this.apiBase}/stations/upload`,
        body,
        config
      );
      console.log("response : " + response.status);
      return response.body;
    } catch (e) {
      console.log(e.response.data);
      console.log(e.message);
    }
  }
}

const apiService = new ApiService();

module.exports = apiService;
