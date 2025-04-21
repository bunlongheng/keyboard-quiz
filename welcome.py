import time
import netifaces
from RPLCD.i2c import CharLCD

class LCDDisplay:
    def __init__(self):
        self.lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)
        self.scroll_delay = 0.2  # Faster scroll

    def get_wifi_ip(self):
        """Get only wlan0 IP (your 10.0.0.201)"""
        try:
            return netifaces.ifaddresses('wlan0')[netifaces.AF_INET][0]['addr']
        except:
            return "NO_WIFI"

    def scroll_compact(self, text):
        """Pure scrolling without labels"""
        padded = " " * 16 + text + " " * 16
        for i in range(len(padded) - 15):
            self.lcd.clear()
            self.lcd.write_string(padded[i:i+16])
            time.sleep(self.scroll_delay)

    def run(self):
        while True:
            self.scroll_compact(self.get_wifi_ip())  # Just the IP

if __name__ == "__main__":
    display = LCDDisplay()
    try:
        display.run()
    except KeyboardInterrupt:
        display.lcd.clear()