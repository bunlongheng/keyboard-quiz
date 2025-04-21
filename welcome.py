import time
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import board
import busio
import adafruit_ssd1306
from RPLCD.i2c import CharLCD

class DisplayManager:
    def __init__(self):
        # Initialize OLED (time/date only)
        self.oled = None
        try:
            i2c = busio.I2C(board.SCL, board.SDA)
            self.oled = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c)
            self.oled_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
            print("OLED ready")
        except Exception as e:
            print(f"OLED error: {e}")

        # Initialize LCD (with scrolling)
        self.lcd = None
        try:
            self.lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)
            self.birthday_messages = [
                "Happy Birthday Mila!",
                "You are awesome!",
                "Let's celebrate!",
                "Best wishes!",
                "Party time!!!"
            ]
            self.current_message = 0
            print("LCD ready")
        except Exception as e:
            print(f"LCD error: {e}")

    def update_oled(self):
        if not self.oled:
            return
            
        now = datetime.now()
        image = Image.new("1", (128, 64))
        draw = ImageDraw.Draw(image)
        
        # Bigger time font
        time_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
        draw.text((0, 5), now.strftime("%I:%M:%S %p"), font=time_font, fill=255)
        draw.text((0, 30), now.strftime("%b %d, %Y"), font=self.oled_font, fill=255)
        
        self.oled.image(image)
        self.oled.show()

    def update_lcd(self):
        if not self.lcd:
            return
            
        self.lcd.clear()
        
        # ASCII cake art (alternates with messages)
        if self.current_message % 2 == 0:
            cake = [
                "   _____   ",
                "  |     |  ",
                "  | ~ ~ |  ",
                "  |_____|  ",
                "  |     |  "
            ]
            self.lcd.write_string(cake[0] + "\n" + cake[1])
        else:
            # Scrolling message (center-aligned)
            msg = self.birthday_messages[self.current_message % len(self.birthday_messages)]
            padded_msg = f"{msg:^16}"  # Center-align
            self.lcd.write_string(padded_msg + "\n")
            self.lcd.write_string(" " * 16)  # Clear second line
            
        self.current_message += 1

    def run(self):
        while True:
            self.update_oled()
            self.update_lcd()
            time.sleep(2)  # Faster updates for scrolling effect

if __name__ == "__main__":
    manager = DisplayManager()
    
    # Show startup animation
    if manager.lcd:
        manager.lcd.write_string("Starting up...\n")
        for i in range(3):
            manager.lcd.write_string("." * (i+1))
            time.sleep(0.5)
        manager.lcd.clear()
    
    manager.run()