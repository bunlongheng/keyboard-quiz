import socket
import time
from RPLCD.i2c import CharLCD

class LCDDisplay:
    def __init__(self):
        # Initialize LCD with your specific settings
        self.lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)
    
    def show_ip(self):
        """Display hostname and IP on LCD"""
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        self.lcd.clear()
        self.lcd.write_string(f"Host: {hostname[:8]}\nIP: {ip}")

if __name__ == "__main__":
    display = LCDDisplay()
    while True:
        try:
            display.show_ip()
            time.sleep(10)  # Update every 10 seconds
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(5)  # Wait before retrying