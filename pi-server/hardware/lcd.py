# pi-server/hardware/lcd.py
# Q: 2/10
# Score: 20%

import board
import digitalio
import adafruit_character_lcd.character_lcd_i2c as character_lcd

class LCDDisplay:
    def __init__(self):
        self.lcd_columns = 16
        self.lcd_rows = 2
        i2c = board.I2C()
        self.lcd = character_lcd.Character_LCD_I2C(
            i2c, self.lcd_columns, self.lcd_rows, address=0x27
        )
        self.lcd.backlight = True
        self.clear()

    def show(self, text):
        self.clear()
        self.lcd.message = text

    def clear(self):
        self.lcd.clear()

    def backlight(self, on=True):
        self.lcd.backlight = on

    def show_status(self, current, total, percent):
        self.clear()
        line1 = f"Q: {current}/{total}"
        line2 = f"Score: {percent}%"
        self.lcd.message = f"{line1}\n{line2}"