if (process.platform !== "linux") {
    console.log("🛑 LCD hardware skipped (not Linux)");
    module.exports = { updateLCD: () => {} };
    return;
}

try {
    const LCD = require("lcd");
    const lcd = new LCD({
        rs: 12, // check your wiring!
        e: 16,
        data: [20, 21, 22, 23],
        cols: 16,
        rows: 2,
    });

    lcd.on("ready", () => {
        lcd.clear();
        lcd.setCursor(0, 0);
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
} catch (err) {
    console.error("❌ LCD init failed:", err.message);
    module.exports = { updateLCD: () => {} };
}
