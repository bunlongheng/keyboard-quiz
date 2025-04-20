// pages/quiz.tsx — Layout update: 4 corners + huge key font
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
  const [lastKey, setLastKey] = useState<string>('');

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
      setLastKey(e.key);
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
      className="relative min-h-screen text-white p-6 flex items-center justify-center text-center"
      style={{ backgroundColor: bgColor }}
    >
      {/* 4 Corner Info */}
      <div className="absolute top-4 left-4 text-sm text-white/90">Question {currentIndex + 1}/{questions.length}</div>
      <div className="absolute top-4 right-4 text-sm text-white/90">Score: {(score / questions.length) * 100}%</div>
      <div className="absolute bottom-4 left-4 text-sm text-white/90">Time left: {timeLeft}s</div>
      <div className="absolute bottom-4 right-4 text-sm text-white/90">Key: {lastKey}</div>

      {character && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
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
        <h2 className="text-[100px] font-extrabold text-yellow-100">
          {currentQuestion.display}
        </h2>
      ) : (
        <p className="text-red-400">⚠️ No question loaded.</p>
      )}
    </div>
  );
}
