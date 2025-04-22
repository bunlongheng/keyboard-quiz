#!/bin/bash

cd ~/keyboard-quiz/pi-server

# Create venv if missing
if [ ! -d "venv" ]; then
  echo "📦 Creating virtualenv..."
  python3 -m venv venv
fi

# Activate it
source venv/bin/activate

# Install packages if needed
pip install -r requirements.txt

# Run the display server
echo "🚀 Running Display Server..."
python app.pya