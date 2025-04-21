# pi-server/app.py
from flask import Flask, jsonify
import platform
import os

app = Flask(__name__)

# Check if running on Raspberry Pi
def is_raspberry_pi():
    try:
        # Method 1: Check device tree model
        with open('/proc/device-tree/model', 'r') as f:
            return 'Raspberry Pi' in f.read()
    except:
        try:
            # Method 2: Check cpuinfo for BCM (Broadcom) chip
            with open('/proc/cpuinfo', 'r') as f:
                return 'BCM' in f.read()
        except:
            return False

# Only import hardware modules if on Raspberry Pi
if is_raspberry_pi():
    from hardware.oled import OLEDDisplay
    from hardware.lcd import LCDDisplay
    
    oled = OLEDDisplay()
    lcd = LCDDisplay()

@app.route('/api/pi/display', methods=['POST'])
def update_displays():
    if not is_raspberry_pi():
        return jsonify({"error": "Not running on Raspberry Pi"}), 400
    
    data = request.json
    # Update displays
    oled.show(data.get('oled_text', ''))
    lcd.show(data.get('lcd_text', ''))
    
    return jsonify({"status": "success"})

if __name__ == '__main__':
    if is_raspberry_pi():
        app.run(host='0.0.0.0', port=5000)
    else:
        print("Not running on Raspberry Pi - Flask server not started")