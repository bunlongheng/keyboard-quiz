#!/bin/bash

cd ~/keyboard-quiz

# Create venv if missing
if [ ! -d "venv" ]; then
  echo "📦 Creating virtualenv..."
  python3 -m venv venv
fi

# Activate it
source venv/bin/activate

# Install packages only if not already installed
REQUIRED_PACKAGES=("RPLCD" "netifaces")
for pkg in "${REQUIRED_PACKAGES[@]}"; do
  pip show "$pkg" > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    echo "📦 Installing $pkg..."
    pip install "$pkg"
  fi
done

# Run the welcome display
echo "👋 Starting Welcome Display..."
python welcome.py