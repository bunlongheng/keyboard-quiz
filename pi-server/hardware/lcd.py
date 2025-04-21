# pi-server/hardware/lcd.py
import board
import digitalio
import adafruit_character_lcd.character_lcd_i2c as character_lcd

class LCDDisplay:
    def __init__(self):
        # Modify these values to match your LCD
        self.lcd_columns = 16
        self.lcd_rows = 2
        
        # Initialize I2C bus
        i2c = board.I2C()
        
        # Initialize LCD class
        self.lcd = character_lcd.Character_LCD_I2C(
            i2c, self.lcd_columns, self.lcd_rows, address=0x27
        )
        
        # Turn backlight on
        self.lcd.backlight = True
        self.clear()
    
    def show(self, text):
        self.clear()
        self.lcd.message = text
    
    def clear(self):
        self.lcd.clear()
    
    def backlight(self, on=True):
        self.lcd.backlight = on