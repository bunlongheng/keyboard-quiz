import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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

export default function QuizPage() {
  const [questions] = useState(() => [...fullSet].sort(() => Math.random() - 0.5).slice(0, 10));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [lastKey, setLastKey] = useState<string>('');
  const [shake, setShake] = useState(false);

  const router = useRouter();
  const currentQuestion: Question | undefined = questions[currentIndex];
  const passingScore = (score / questions.length) * 100 >= 70;

  const correctSounds = [typeof window !== 'undefined' ? new Audio('/sounds/correct.mp3') : null].filter(Boolean) as HTMLAudioElement[];
  const wrongSounds = [
    typeof window !== 'undefined' ? new Audio('/sounds/wrong.mp3') : null,
    typeof window !== 'undefined' ? new Audio('/sounds/wrong2.mp3') : null,
  ].filter(Boolean) as HTMLAudioElement[];

  const congratsSound = typeof window !== 'undefined' ? new Audio('/sounds/congrats.mp3') : null;

  useEffect(() => {
    if (showResult) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t === 21) {
          const warning = new Audio('/sounds/warning.mp3');
          warning.play().catch(() => {});
        }
        if (t === 11) {
          setShake(true);
          setTimeout(() => setShake(false), 2500);
        }
        if (t <= 1) {
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResult]);

  useEffect(() => {
    if (showResult) {
      const timer = setTimeout(() => {
        router.push('/');
      }, 60000);
      return () => clearTimeout(timer);
    }
  }, [showResult, router]);

  useEffect(() => {
    if (showResult && passingScore) {
      const theme = new Audio('/theme-song.mp3');
      theme.volume = 0.7;
      theme.play().catch((err) => {
        console.warn('Theme song blocked:', err);
      });
    }
  }, [showResult]);

  useEffect(() => {
    if (!router.isReady) return;
    const { name, color, type } = router.query;
    if (name && color && type) {
      setCharacter({
        name: String(name),
        color: String(color),
        type: String(type),
      });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showResult || !currentQuestion) return;
      setLastKey(e.key);
      const correct = e.key.toLowerCase() === currentQuestion.key.toLowerCase();
      setFeedback(correct ? 'correct' : 'wrong');

      if (correct) {
        const sound = correctSounds[Math.floor(Math.random() * correctSounds.length)];
        sound.play().catch(() => {});
        setScore((s) => s + 1);
      } else {
        const sound = wrongSounds[Math.floor(Math.random() * wrongSounds.length)];
        sound.play().catch(() => {});
      }

      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setTimeLeft(30);
        } else {
          const finalScore = score + (correct ? 1 : 0);
          const didPass = (finalScore / questions.length) >= 0.7;
          if (didPass) congratsSound?.play().catch(() => {});
          setShowResult(true);
        }
      }, 800);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, currentQuestion, showResult]);

  const bgColor = character?.color || '#0f172a';
  const getImagePath = (name: string) => `/characters/sprunki/${name.replace(/\./g, '').replace(/\s+/g, ' ')}.svg`;

  const handleTimeout = () => {
    if (!currentQuestion || showResult) return;
    setFeedback('wrong');
    const sound = wrongSounds[Math.floor(Math.random() * wrongSounds.length)];
    sound.play().catch(() => {});
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((i) => i + 1);
        setTimeLeft(30);
      } else {
        const finalScore = score;
        const didPass = (finalScore / questions.length) >= 0.7;
        if (didPass) congratsSound?.play().catch(() => {});
        setShowResult(true);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen text-white p-6 flex flex-col items-center justify-center text-center" style={{ backgroundColor: bgColor }}>
      <input id="mobileInput" type="text" className="opacity-0 absolute top-0 left-0" autoFocus inputMode="text" />

      <div className="absolute top-4 left-4 text-4xl font-bold text-white">
        {Math.min(currentIndex + 1, questions.length)}/{questions.length}
      </div>
      <div className="absolute top-4 right-4 text-4xl font-bold text-white">
        {(score / questions.length) * 100}%
      </div>
      <div className="absolute bottom-4 left-4 text-4xl font-bold text-white">{timeLeft}s</div>
      <div className="absolute bottom-4 right-4 text-4xl font-bold text-white">{lastKey}</div>

      {character && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <Image src={getImagePath(character.name)} alt={character.name} width={64} height={64} className="mb-2" />
          <p className="text-sm text-white/90">
            <span className="font-bold">{character.name}</span>
          </p>
        </div>
      )}

      {showResult ? (
        <>
          {passingScore && <Confetti />}
          <h1 className="text-4xl font-bold mb-4 text-green-400">🎉 Quiz Complete!</h1>
          <p className={`text-4xl ${passingScore ? 'bg-green-600' : 'bg-red-600'} text-white px-4 py-2 rounded`}>
            Score: {(score / questions.length) * 100}%
          </p>
          <a href="/" className="mt-8 inline-block px-6 py-3 bg-white text-black text-lg font-bold rounded hover:bg-gray-200 transition">
            ⬅ Back to Home
          </a>
        </>
      ) : currentQuestion ? (
        <>
          <h2 className={`text-[200px] sm:text-[240px] md:text-[280px] lg:text-[300px] font-extrabold text-yellow-100 ${shake ? 'shake' : ''}`} style={{ WebkitTextStroke: '.4px black' }}>
            {currentQuestion.display}
          </h2>
          {feedback === 'correct' && <p className="text-green-300 text-3xl mt-4">✅ Correct!</p>}
          {feedback === 'wrong' && <p className="text-red-300 text-3xl mt-4">❌ Wrong</p>}
        </>
      ) : (
        <p className="text-red-400">⚠️ No question loaded.</p>
      )}
    </div>
  );
}