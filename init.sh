npx create-next-app@latest keyboard-quiz
cd keyboard-quiz
npm install react-confetti
npm install --save-dev concurrently


cp .env.example .env.local
npx json -I -f package.json -e 'this.scripts.dev = "concurrently \\"next dev\\" \\"node backend/server.js\\""' 
npm run dev 