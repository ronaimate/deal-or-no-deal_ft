import { useState, useEffect, useRef } from 'react';
import {
  getStoredBankerName,
  getStoredBankerImage,
  setStoredBankerName,
  setStoredBankerImage,
  resizeImageToDataUrl,
} from '../utils/bankerStorage';

const STORAGE_KEY = 'allazalku-player-name';

export interface BankerSettings {
  name: string;
  image: string | null;
}

interface NameScreenProps {
  onStart: (name: string) => void;
  bankerName: string;
  bankerImage: string | null;
  onBankerChange: (settings: BankerSettings) => void;
}

export function NameScreen({
  onStart,
  bankerName,
  bankerImage,
  onBankerChange,
}: NameScreenProps) {
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? '';
    } catch {
      return '';
    }
  });

  const [showBankerSettings, setShowBankerSettings] = useState(false);
  const [bankerNameInput, setBankerNameInput] = useState(bankerName);
  const [bankerImagePreview, setBankerImagePreview] = useState<string | null>(bankerImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (name) {
      try {
        localStorage.setItem(STORAGE_KEY, name);
      } catch {
        // ignore
      }
    }
  }, [name]);

  useEffect(() => {
    setBankerNameInput(bankerName);
    setBankerImagePreview(bankerImage);
  }, [bankerName, bankerImage, showBankerSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onStart(trimmed);
  };

  const handleSaveBanker = () => {
    const nameToSave = bankerNameInput.trim() || getStoredBankerName();
    setStoredBankerName(nameToSave);
    setStoredBankerImage(bankerImagePreview);
    onBankerChange({ name: nameToSave, image: bankerImagePreview });
    setShowBankerSettings(false);
  };

  const handleBankerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      setBankerImagePreview(dataUrl);
      setStoredBankerImage(dataUrl);
      onBankerChange({ name: bankerNameInput.trim() || bankerName, image: dataUrl });
    } catch {
      // ignore
    }
    e.target.value = '';
  };

  const handleRemoveBankerImage = () => {
    setBankerImagePreview(null);
    setStoredBankerImage(null);
    onBankerChange({ name: bankerNameInput.trim() || bankerName, image: null });
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

      <button
        type="button"
        onClick={() => setShowBankerSettings(!showBankerSettings)}
        className="btn btn-ghost banker-settings-toggle"
      >
        {showBankerSettings ? 'Bezárás' : 'Igazgató úr személyre szabása'}
      </button>

      {showBankerSettings && (
        <div className="banker-settings">
          <h3 className="banker-settings-title">Igazgató úr (bankár)</h3>
          <label className="banker-settings-label">
            Név (nem kötelező)
            <input
              type="text"
              value={bankerNameInput}
              onChange={(e) => setBankerNameInput(e.target.value)}
              placeholder="pl. Az igazgató úr"
              maxLength={40}
              className="name-input banker-name-input"
            />
          </label>
          <label className="banker-settings-label banker-file-label" htmlFor="banker-image-upload">
            Kép (nem kötelező)
            <input
              id="banker-image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleBankerImageChange}
              className="banker-file-input"
            />
            <span className="banker-file-hint">
              {bankerImagePreview ? 'Kép feltöltve – új kép feltöltése' : 'Kattints a feltöltéshez'}
            </span>
          </label>
          {bankerImagePreview && (
            <div className="banker-preview-wrap">
              <img src={bankerImagePreview} alt="Igazgató" className="banker-preview-img" />
              <button type="button" onClick={handleRemoveBankerImage} className="btn btn-ghost banker-remove-img">
                Kép törlése
              </button>
            </div>
          )}
          <button type="button" onClick={handleSaveBanker} className="btn btn-primary">
            Mentés
          </button>
        </div>
      )}
    </section>
  );
}
