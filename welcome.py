import time
import socket
import netifaces
from RPLCD.i2c import CharLCD

class LCDDisplay:
    def __init__(self):
        self.lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)
        self.lcd.clear()

    def get_hostname(self):
        return socket.gethostname()[:16]  # trim if too long

    def get_wifi_ip(self):
        try:
            return netifaces.ifaddresses('wlan0')[netifaces.AF_INET][0]['addr'][:16]
        except:
            return "NO_WIFI"

    def show_info(self):
        self.lcd.clear()
        self.lcd.write_string(self.get_hostname())
        self.lcd.cursor_pos = (1, 0)
        self.lcd.write_string(self.get_wifi_ip())

    def run(self):
        while True:
            self.show_info()
            time.sleep(10)

if __name__ == "__main__":
    display = LCDDisplay()
    try:
        display.run()
    except KeyboardInterrupt:
        display.lcd.clear()