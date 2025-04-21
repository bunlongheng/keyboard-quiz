from RPLCD.i2c import CharLCD
from time import sleep

lcd = CharLCD('PCF8574', 0x27, cols=16, rows=2)

lcd.write_string("Hello Norden!")     # Line 1

while True:
    sleep(1)