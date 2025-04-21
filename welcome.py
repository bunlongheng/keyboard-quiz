import time
import requests
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
import board
import busio
import adafruit_ssd1306
from RPLCD.i2c import CharLCD

class DisplayManager:
    def __init__(self):
        # Initialize OLED
        self.oled = None
        self.oled_font = None
        try:
            i2c_oled = busio.I2C(board.SCL, board.SDA)
            self.oled = adafruit_ssd1306.SSD1306_I2C(128, 64, i2c_oled)
            self.oled_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
            print("OLED initialized successfully")
        except Exception as e:
            print(f"OLED init failed: {e}")

        # Initialize LCD
        self.lcd = None
        try:
            self.lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)
            print("LCD initialized successfully")
        except Exception as e:
            print(f"LCD init failed: {e}")

    def get_weather(self):
        CITY = "Pelham"
        API_KEY = "your_openweathermap_api_key"
        WEATHER_URL = f"http://api.openweathermap.org/data/2.5/weather?q={CITY}&units=imperial&appid={API_KEY}"
        
        try:
            r = requests.get(WEATHER_URL, timeout=5)
            data = r.json()
            temp = round(data["main"]["temp"])
            desc = data["weather"][0]["main"]
            return f"{temp}°F {desc}"
        except:
            return "Weather N/A"

    def update_displays(self):
        now = datetime.now()
        current_time = now.strftime("%I:%M:%S %p")
        current_date = now.strftime("%b %d, %Y")
        weather = self.get_weather()

        # Update OLED
        if self.oled:
            try:
                image = Image.new("1", (128, 64))
                draw = ImageDraw.Draw(image)
                draw.text((0, 0), f"Time: {current_time}", font=self.oled_font, fill=255)
                draw.text((0, 20), f"Date: {current_date}", font=self.oled_font, fill=255)
                draw.text((0, 40), weather, font=self.oled_font, fill=255)
                self.oled.image(image)
                self.oled.show()
            except Exception as e:
                print(f"OLED update failed: {e}")

        # Update LCD
        if self.lcd:
            try:
                self.lcd.clear()
                self.lcd.write_string(f"{current_time}\n")
                self.lcd.write_string(f"{current_date}")
            except Exception as e:
                print(f"LCD update failed: {e}")

if __name__ == "__main__":
    manager = DisplayManager()
    while True:
        manager.update_displays()
        time.sleep(30)  # Update every 30 seconds