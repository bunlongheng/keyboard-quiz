if (process.platform !== "linux") {
    console.log("🛑 LCD skipped — not on Raspberry Pi");
    module.exports = { updateLCD: () => {} };
    return;
}

const Lcd = require("lcd");
const lcd = new Lcd({
    rs: 12, // Replace with your actual GPIO pin number
    e: 16, // Replace with your actual GPIO pin number
    data: [20, 21, 22, 23], // Replace with your actual GPIO pin numbers
    cols: 16,
    rows: 2,
});

lcd.on("ready", () => {
    lcd.clear();
    lcd.print("LCD Ready!");
});

function updateLCD({ question, score }) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(`Q ${question}`);
    lcd.setCursor(0, 1);
    lcd.print(`Score: ${score}%`);
}

module.exports = { updateLCD };
