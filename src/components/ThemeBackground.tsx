import React, { useState, useEffect } from 'react';
import { AmbientPresetId, ThemeConfig } from '../types/theme';
import { AMBIENT_PRESETS } from '../constants/themes';

interface ThemeBackgroundProps {
  ambientPresetId?: AmbientPresetId;
  dimming?: number; // 0 to 1
  theme?: ThemeConfig;
  overlayOpacity?: number;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({
  ambientPresetId,
  dimming,
  theme,
  overlayOpacity,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine effective image url and dimming
  const activeAmbient = AMBIENT_PRESETS.find((p) => p.id === ambientPresetId);
  const imageUrl = activeAmbient?.imageUrl || theme?.imageUrl;
  const effectiveDimming = dimming !== undefined ? dimming : overlayOpacity ?? 0.65;

  useEffect(() => {
    if (!imageUrl) {
      setImageLoaded(false);
      setImageError(false);
      return;
    }
    setImageLoaded(false);
    setImageError(false);
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [imageUrl]);

  if (!imageUrl && ambientPresetId === 'none') {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none transition-opacity duration-700">
      {/* High-res background image with smooth fade transition */}
      {imageUrl && !imageError && (
        <div
          key={imageUrl}
          className={`absolute inset-0 h-full w-full bg-cover bg-center transition-opacity duration-1000 transform scale-102 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}

      {/* User-controlled dark/vignette overlay for readability */}
      <div
        className="absolute inset-0 bg-black transition-opacity duration-300"
        style={{ opacity: effectiveDimming }}
      />

      {/* Subtle radial vignette for focus centering */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%]" />
    </div>
  );
};
