
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import characters from '../data/sprunki.json';

interface Character {
  name: string;
  type: string;
  color: string;
  description: string;
  initial?: string;
}

export default function Home() {
  const [selected, setSelected] = useState<Character | null>(null);
  const router = useRouter();

  const selectCharacter = async (char: Character) => {
    const withInitial = { ...char, initial: char.name[0] };
    setSelected(withInitial);
    localStorage.setItem('sprunki', JSON.stringify(withInitial));

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/select-character`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(withInitial),
    });

    router.push({
      pathname: '/quiz',
      query: {
        name: withInitial.name,
        color: withInitial.color,
        type: withInitial.type,
        description: withInitial.description,
        initial: withInitial.initial,
      },
    });
  };

  const getImagePath = (name: string) =>
    `/characters/sprunki/${name.replace(/\./g, '').replace(/\s+/g, ' ')}.svg`;

  const playHoverSound = (name: string, color: string) => {
    const sound = new Audio(`/sounds/${name.replace(/\./g, '').replace(/\s+/g, '-')}.mp3`);
    sound.play();
    document.body.style.backgroundColor = color;
    setTimeout(() => {
      document.body.style.backgroundColor = '#0f172a';
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Select Sprunki</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {characters.map((char: Character) => (
          <button
            key={char.name}
            onClick={() => selectCharacter(char)}
            onMouseEnter={() => playHoverSound(char.name, char.color)}
            className={`p-3 rounded shadow text-center flex flex-col justify-center items-center 
              h-[150px] sm:h-[170px] md:h-[180px] lg:h-[200px] 
              ${selected?.name === char.name ? 'ring-4 ring-yellow-300' : ''} 
              transition-transform duration-150 transform hover:scale-102`}
            style={{ backgroundColor: char.color }}
          >
            <Image
              src={getImagePath(char.name)}
              alt={char.name}
              width={48}
              height={48}
              className="mx-auto mb-1"
            />
            

   
  <p className="text-white text-lg font-bold" style={{ WebkitTextStroke: '.4px black' }}>
    {char.name}
  </p>
          </button>
        ))}
      </div>
    </div>
  );
}
