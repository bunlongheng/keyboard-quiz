const { updateOLED } = require("./oled");
const { updateLCD } = require("./lcd");

function updateDisplays(data) {
    updateOLED(data);
    updateLCD(data);
}

module.exports = { updateDisplays };
