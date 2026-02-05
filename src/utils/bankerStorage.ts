const BANKER_NAME_KEY = 'allazalku-banker-name';
const BANKER_IMAGE_KEY = 'allazalku-banker-image';

const DEFAULT_BANKER_NAME = 'Az igazgató úr';

export function getStoredBankerName(): string {
  try {
    return localStorage.getItem(BANKER_NAME_KEY) ?? DEFAULT_BANKER_NAME;
  } catch {
    return DEFAULT_BANKER_NAME;
  }
}

export function getStoredBankerImage(): string | null {
  try {
    return localStorage.getItem(BANKER_IMAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredBankerName(name: string): void {
  try {
    if (name.trim()) {
      localStorage.setItem(BANKER_NAME_KEY, name.trim());
    } else {
      localStorage.removeItem(BANKER_NAME_KEY);
    }
  } catch {
    // ignore
  }
}

export function setStoredBankerImage(dataUrl: string | null): void {
  try {
    if (dataUrl) {
      localStorage.setItem(BANKER_IMAGE_KEY, dataUrl);
    } else {
      localStorage.removeItem(BANKER_IMAGE_KEY);
    }
  } catch {
    // ignore
  }
}

const MAX_IMAGE_SIZE = 200;
const JPEG_QUALITY = 0.82;

/** Kép átméretezése és JPEG data URL-re konvertálása (localStorage-barát) */
export function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > MAX_IMAGE_SIZE || h > MAX_IMAGE_SIZE) {
        if (w > h) {
          h = (h * MAX_IMAGE_SIZE) / w;
          w = MAX_IMAGE_SIZE;
        } else {
          w = (w * MAX_IMAGE_SIZE) / h;
          h = MAX_IMAGE_SIZE;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image load failed'));
    };
    img.src = url;
  });
}
