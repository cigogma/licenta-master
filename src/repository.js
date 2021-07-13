const store = require("node-persist");

class Repository {
  devices = [];
  constructor() {
    // this.loadData();
  }
  async loadData() {
    try {
      const storageData = await store.getItem("devices");
      if (!storageData) {
        throw new Error("Devices key not found in storage!");
      }
      this.devices = storageData;
    } catch (e) {
      console.error(e.message);
    }
    return this;
  }

  async saveData() {
    try {
      await store.setItem("devices", this.devices);
    } catch (e) {
      console.log(e);
    }
  }

  async clearData() {
    this.devices = [];
    await store.setItem("devices", this.devices);
  }
  getTotalProbes() {
    return this.devices
      .map((device) => device.probes.length)
      .reduce((a, b) => a + b, 0);
  }
  getData() {
    return this.devices;
  }

  getDevice(mac) {
    return this.devices.find((device) => device.mac === mac);
  }
  findOrCreateDeviceIndex(mac) {
    let deviceIndex = this.devices.findIndex((d) => d.mac === mac);
    if (deviceIndex == -1) {
      this.devices.push({ mac, probes: [] });
      deviceIndex = this.devices.length - 1;
    }
    return deviceIndex;
  }
  saveDevice(device) {
    const mac = device.mac;
    const deviceIndex = this.findOrCreateDeviceIndex(mac);
    this.devices[deviceIndex] = device;
    // this.saveData();
    return this;
  }

  registerProbe(mac, probe) {
    const deviceIndex = this.findOrCreateDeviceIndex(mac);
    const device = this.devices[deviceIndex];
    device.probes.push(probe);
    this.saveDevice(device);
    // console.log(this.devices);
  }
}

const repository = new Repository();

module.exports = repository;
