# pi-server/hardware/oled.py
class OLEDDisplay:
    def __init__(self):
        # Initialize your OLED display here
        pass

    def show(self, text):
        print(f"[OLED Display]: {text}")

    def show_status(self, character, elapsed):
        mins = elapsed // 60
        secs = elapsed % 60
        self.show(f"Char: {character}\nTime: {mins}:{secs:02d}")