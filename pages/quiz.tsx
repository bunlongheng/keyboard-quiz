// pages/quiz.tsx — Show selected character image + color theme
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Confetti from 'react-confetti';
import fullSet from '../data/questions.json';

interface Question {
  display: string;
  key: string;
}

interface Character {
  name: string;
  type: string;
  color: string;
  initial?: string;
}

const shuffled = [...fullSet].sort(() => Math.random() - 0.5).slice(0, 10);

export default function QuizPage() {
  const [questions] = useState(shuffled);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);

  const currentQuestion: Question | undefined = questions[currentIndex];

  useEffect(() => {
    const stored = localStorage.getItem('sprunki');
    if (stored) setCharacter(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showResult || !currentQuestion) return;
      const correct = e.key.toLowerCase() === currentQuestion.key.toLowerCase();
      setFeedback(correct ? 'correct' : 'wrong');
      if (correct) setScore((s) => s + 1);

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setTimeLeft(60);
        } else {
          setShowResult(true);
        }
      }, 800);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentQuestion, showResult]);

  const bgColor = character?.color || '#0f172a';
  const getImagePath = (name: string) =>
    `/characters/sprunki/${name.replace(/\./g, '').replace(/\s+/g, ' ')}.svg`;

  return (
    <div
      className="min-h-screen text-white p-6 flex flex-col items-center justify-center text-center"
      style={{ backgroundColor: bgColor }}
    >
      {character && (
        <div className="flex flex-col items-center mb-6">
          <Image
            src={getImagePath(character.name)}
            alt={character.name}
            width={64}
            height={64}
            className="mb-2"
          />
          <p className="text-sm text-white/90">
            Character: <span className="font-bold">{character.name}</span>
          </p>
        </div>
      )}

      {showResult ? (
        <>
          <Confetti />
          <h1 className="text-4xl font-bold mb-4 text-green-400">🎉 Quiz Complete!</h1>
          <p className={`text-2xl ${
            (score / questions.length) * 100 >= 70 ? 'bg-green-600' : 'bg-red-600'
          } text-white px-4 py-2 rounded`}>Score: {(score / questions.length) * 100}%</p>
        </>
      ) : currentQuestion ? (
        <div className="w-full max-w-md space-y-6">
          <p className="text-white/80">Question {currentIndex + 1}/{questions.length}</p>
          <h2 className="text-3xl font-bold">Press: <span className="text-yellow-200">{currentQuestion.display}</span></h2>

          {feedback === 'correct' && <p className="text-green-100 text-xl">✅ Correct!</p>}
          {feedback === 'wrong' && <p className="text-red-200 text-xl">❌ Wrong</p>}

          <div className="text-sm text-white/80 space-y-1">
            <p>Time left: {timeLeft}s</p>
            <p>Score: {(score / questions.length) * 100}%</p>
          </div>
        </div>
      ) : (
        <p className="text-red-400">⚠️ No question loaded.</p>
      )}
    </div>
  );
}