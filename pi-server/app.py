from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import time
from display.oled import show_oled_status
from display.lcd import show_lcd_status

start_time = time.time()

class QuizHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.end_headers()

    def do_GET(self):
        if self.path == "/ping":
            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok", "message": "pong"}).encode())

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        raw_data = self.rfile.read(length)
        try:
            data = json.loads(raw_data)
        except json.JSONDecodeError:
            self._set_headers(400)
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
            return

        if self.path == "/update-status":
            character = data.get("character", "Unknown")
            current = data.get("current", 1)
            total = data.get("total", 10)
            correct = data.get("correct", 0)

            elapsed = int(time.time() - start_time)
            percent = int((correct / total) * 100) if total else 0

            show_oled_status(character, elapsed)
            show_lcd_status(current, total, percent)

            self._set_headers()
            self.wfile.write(json.dumps({"ok": True}).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

def run(server_class=HTTPServer, handler_class=QuizHandler, port=5001):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    print(f"📡 Display Server running on port {port}")
    httpd.serve_forever()

if __name__ == "__main__":
    run()