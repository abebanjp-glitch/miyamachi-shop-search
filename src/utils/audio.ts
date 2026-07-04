// Background Music Manager for Miyamachi Street Portal
// Manages lazy loading, playback, loop, and elegant volume fade-in / fade-out transitions.
let bgmAudio: HTMLAudioElement | null = null;
let fadeInterval: any = null;

function getOrInitBGM(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!bgmAudio) {
    try {
      bgmAudio = new Audio(`${import.meta.env.BASE_URL}audio/bgm.mp3`);
      bgmAudio.loop = true;
      bgmAudio.volume = 0;
      bgmAudio.addEventListener('error', (e) => {
        console.warn('BGM source could not be loaded or is not available. Failing gracefully.', e);
      });
    } catch (err) {
      console.error('Failed to create HTMLAudioElement for BGM:', err);
      return null;
    }
  }
  return bgmAudio;
}

export function playBGM() {
  const audio = getOrInitBGM();
  if (!audio) return;
  try {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
    audio.play().catch((err) => {
      console.warn('BGM playback could not start (likely pending user gesture or missing file):', err);
    });
    const targetVolume = 0.3;
    const duration = 1500;
    const intervalTime = 100;
    const totalSteps = duration / intervalTime;
    const volumeStep = targetVolume / totalSteps;
    fadeInterval = setInterval(() => {
      try {
        if (audio.volume + volumeStep >= targetVolume) {
          audio.volume = targetVolume;
          clearInterval(fadeInterval);
          fadeInterval = null;
        } else {
          audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
        }
      } catch {
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, intervalTime);
  } catch (err) {
    console.warn('Error during BGM play initiation:', err);
  }
}

export function pauseBGM() {
  const audio = bgmAudio;
  if (!audio) return;
  try {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
    const startVolume = audio.volume;
    const duration = 1000;
    const intervalTime = 100;
    const totalSteps = duration / intervalTime;
    const volumeStep = startVolume / totalSteps;
    fadeInterval = setInterval(() => {
      try {
        if (audio.volume - volumeStep <= 0) {
          audio.volume = 0;
          audio.pause();
          clearInterval(fadeInterval);
          fadeInterval = null;
        } else {
          audio.volume = Math.max(0, audio.volume - volumeStep);
        }
      } catch {
        try {
          audio.pause();
        } catch {}
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, intervalTime);
  } catch (err) {
    console.warn('Error during BGM pause initiation:', err);
    try {
      audio.pause();
    } catch {}
  }
}