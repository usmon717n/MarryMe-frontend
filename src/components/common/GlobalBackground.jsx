import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const VIDEO_SRC = '/videos/background.mp4';
const SLOW_PLAYBACK_RATE = 0.7;

export default function GlobalBackground() {
  const { isDark } = useTheme();
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const applyPlaybackSettings = () => {
      const rate = prefersReducedMotion ? 1 : SLOW_PLAYBACK_RATE;
      video.defaultPlaybackRate = rate;
      video.playbackRate = rate;
    };

    const playIfPossible = async () => {
      if (prefersReducedMotion || document.visibilityState === 'hidden') return;
      try {
        await video.play();
      } catch {
        // autoplay can be blocked on some devices
      }
    };

    const onLoadedMetadata = () => {
      applyPlaybackSettings();
      void playIfPossible();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        video.pause();
        return;
      }

      applyPlaybackSettings();
      void playIfPossible();
    };

    applyPlaybackSettings();
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    document.addEventListener('visibilitychange', onVisibilityChange);
    void playIfPossible();

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        backgroundColor: isDark ? '#0e0014' : '#fce4ec',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        src={VIDEO_SRC}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scale(1.03) translateZ(0)',
          willChange: 'transform',
          filter: isDark
            ? 'brightness(0.45) saturate(1.05)'
            : 'brightness(0.82) saturate(1.06)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(8, 0, 14, 0.56) 0%, rgba(8, 0, 14, 0.78) 100%)'
            : 'linear-gradient(180deg, rgba(255, 247, 251, 0.26) 0%, rgba(252, 236, 244, 0.40) 100%)',
        }}
      />
    </div>
  );
}
