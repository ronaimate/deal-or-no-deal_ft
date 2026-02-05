import { useState, useEffect } from 'react';

const STORAGE_KEY = 'allazalku-player-name';

interface NameScreenProps {
  onStart: (name: string) => void;
}

export function NameScreen({ onStart }: NameScreenProps) {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    if (name) {
      try {
        localStorage.setItem(STORAGE_KEY, name);
      } catch {
        // ignore
      }
    }
  }, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onStart(trimmed);
  };

  return (
    <section className="screen name-screen">
      <h1>Áll az alku</h1>
      <p className="subtitle">Kérjük, add meg a neved a játék kezdéséhez.</p>
      <form onSubmit={handleSubmit} className="name-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="A neved"
          maxLength={50}
          autoFocus
          className="name-input"
        />
        <button type="submit" disabled={!name.trim()} className="btn btn-primary">
          Start
        </button>
      </form>
    </section>
  );
}
