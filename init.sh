npx create-next-app@latest keyboard-quiz
cd keyboard-quiz
npm install react-confetti
npm install --save-dev concurrently


cp .env.example .env.local
npx json -I -f package.json -e 'this.scripts.dev = "concurrently \\"next dev\\" \\"node backend/server.js\\""' 
npm run dev 


Generate a square image public/icon.png
Run icon.py 


..push 

Vercel, add new project, deploy, wait 


===


pi2@norden-pi:~/keyboard-quiz/backend $ npm install
-bash: npm: command not found


curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs




Pi Only 

echo "cd ~/keyboard-quiz && source venv/bin/activate" >> ~/.bashrc