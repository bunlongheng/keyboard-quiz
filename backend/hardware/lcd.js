if (process.platform !== "linux") {
    console.log("🛑 OLED hardware skipped — not running on Raspberry Pi.");
    module.exports = { updateOLED: () => {} };
    return;
}

const LCD = require("lcd");

const lcd = new LCD({
    rs: 12,
    e: 16,
    data: [20, 21, 22, 23], // your actual GPIO pins
    cols: 16,
    rows: 2,
});

lcd.on("ready", () => lcd.clear());

function updateLCD({ question, score }) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(`Q ${question}`);
    lcd.setCursor(0, 1);
    lcd.print(`Score: ${score}%`);
}

module.exports = { updateLCD };
