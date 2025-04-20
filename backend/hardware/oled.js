if (process.platform !== "linux") {
    console.log("🛑 OLED hardware skipped — not running on Raspberry Pi.");
    module.exports = { updateOLED: () => {} };
    return;
}

const i2c = require("i2c-bus");
const OLED = require("oled-i2c-bus");

const i2cBus = i2c.openSync(1);
const oled = new OLED(i2cBus, {
    width: 128,
    height: 64,
    address: 0x3c,
});

oled.clearDisplay();

function updateOLED({ time, character }) {
    oled.clearDisplay();
    oled.setCursor(1, 1);
    oled.writeString(null, 1, `Time: ${time}s`, 1, true);
    if (character) {
        oled.setCursor(1, 20);
        oled.writeString(null, 1, character.slice(0, 12), 1, true);
    }
}

module.exports = { updateOLED };
