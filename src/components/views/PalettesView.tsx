import React, { useState } from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import { THEME_PRESETS, THEMES_LIST, AMBIENT_PRESETS } from '../../constants/themes';
import {
  ThemePresetId,
  AmbientPresetId,
  ThemeCustomization,
} from '../../types/theme';

interface PalettesViewProps {
  customization: ThemeCustomization;
  onUpdateCustomization: (updater: (prev: ThemeCustomization) => ThemeCustomization) => void;
  onResetToDefault: () => void;
}

const QUICK_ACCENTS = [
  { name: 'Polar Mint', hex: '#43E6C3' },
  { name: 'Coral Rose', hex: '#FF707D' },
  { name: 'Solar Amber', hex: '#F5C26B' },
  { name: 'Lavender Mist', hex: '#B9A1FF' },
  { name: 'Forest Lime', hex: '#A3D977' },
  { name: 'Sky Azure', hex: '#38BDF8' },
  { name: 'Pure Platinum', hex: '#E2E8F0' },
];

export const PalettesView: React.FC<PalettesViewProps> = ({
  customization,
  onUpdateCustomization,
  onResetToDefault,
}) => {
  const [hexInput, setHexInput] = useState(customization.customAccentColor || '');
  const activePreset = THEME_PRESETS[customization.activeThemeId] || THEME_PRESETS['midnight-aurora'];
  const effectiveAccent = customization.customAccentColor || activePreset.colors.primaryAccent;

  const handleSelectPreset = (id: ThemePresetId) => {
    onUpdateCustomization((prev) => ({
      ...prev,
      activeThemeId: id,
    }));
  };

  const handleSelectAccent = (hex: string | null) => {
    onUpdateCustomization((prev) => ({
      ...prev,
      customAccentColor: hex,
    }));
    setHexInput(hex || '');
  };

  const handleHexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = hexInput.trim();
    if (/^#[0-9A-F]{6}$/i.test(clean)) {
      handleSelectAccent(clean);
    }
  };

  const handleAmbientSelect = (id: AmbientPresetId) => {
    onUpdateCustomization((prev) => ({
      ...prev,
      ambientPresetId: id,
      enableAmbientVisuals: id !== 'none',
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b"
        style={{ borderColor: activePreset.colors.border }}
      >
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: effectiveAccent }} />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: activePreset.colors.primaryText }}>
              Theme & Appearance
            </h2>
          </div>
          <p className="text-xs mt-1" style={{ color: activePreset.colors.secondaryText }}>
            Choose from six handcrafted aesthetic themes, custom accents, and ambient focus environments.
          </p>
        </div>

        <button
          onClick={onResetToDefault}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-95 shadow-xs"
          style={{
            backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)',
            borderColor: activePreset.colors.border,
            color: activePreset.colors.primaryText,
          }}
          title="Reset to Midnight Aurora"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Default</span>
        </button>
      </div>

      {/* 1. Six Complete Themes Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight" style={{ color: activePreset.colors.primaryText }}>
              Preset Themes
            </h3>
            <p className="text-xs" style={{ color: activePreset.colors.secondaryText }}>
              Cohesive color schemes calibrated for deep concentration and zero visual fatigue.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold" style={{ color: effectiveAccent }}>
            {activePreset.name} Active
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {THEMES_LIST.map((theme) => {
            const isSelected = customization.activeThemeId === theme.id;
            const c = theme.colors;

            return (
              <div
                key={theme.id}
                onClick={() => handleSelectPreset(theme.id)}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'ring-2 scale-[1.02] shadow-xl'
                    : 'hover:scale-[1.01]'
                }`}
                style={{
                  backgroundColor: c.cardBg,
                  borderColor: isSelected ? c.primaryAccent : c.border,
                  boxShadow: isSelected ? `0 0 25px ${c.accentGlow}` : undefined,
                }}
              >
                {/* Miniature Dashboard Preview */}
                <div
                  className="relative h-28 w-full p-2.5 flex gap-1.5 overflow-hidden border-b"
                  style={{
                    backgroundColor: c.mainBg,
                    borderColor: c.border,
                  }}
                >
                  {/* Mini Sidebar */}
                  <div
                    className="w-10 h-full rounded-md p-1 flex flex-col justify-between"
                    style={{ backgroundColor: c.sidebarBg, border: `1px solid ${c.border}` }}
                  >
                    <div className="space-y-1">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${c.primaryAccent}33` }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.primaryAccent }} />
                      </div>
                      <div className="w-full h-1 rounded" style={{ backgroundColor: c.primaryAccent }} />
                      <div className="w-full h-1 rounded opacity-30" style={{ backgroundColor: c.primaryText }} />
                      <div className="w-full h-1 rounded opacity-30" style={{ backgroundColor: c.primaryText }} />
                    </div>
                    <div className="w-full h-1 rounded opacity-20" style={{ backgroundColor: c.primaryText }} />
                  </div>

                  {/* Mini Main Content */}
                  <div className="flex-1 h-full flex flex-col justify-between space-y-1">
                    {/* Mini Hero card */}
                    <div
                      className="h-11 rounded-md p-1.5 flex items-center justify-between"
                      style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
                    >
                      <div className="space-y-0.5">
                        <div className="w-12 h-1.5 rounded" style={{ backgroundColor: c.primaryText }} />
                        <div className="w-7 h-1 rounded" style={{ backgroundColor: c.primaryAccent }} />
                      </div>
                      {/* Mini indicator badge */}
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-[7px] font-bold font-mono"
                        style={{ backgroundColor: c.elevatedBg, color: c.primaryAccent, border: `1px solid ${c.border}` }}
                      >
                        50%
                      </div>
                    </div>

                    {/* Mini Focus block & Chart row */}
                    <div className="flex-1 flex gap-1">
                      <div
                        className="flex-1 rounded p-1 flex items-center justify-center"
                        style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
                      >
                        {/* Mini circle timer */}
                        <div
                          className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[6px] font-mono font-bold"
                          style={{ borderColor: c.primaryAccent, color: c.primaryText }}
                        >
                          25:00
                        </div>
                      </div>
                      <div
                        className="w-14 rounded p-1 flex items-end"
                        style={{ backgroundColor: c.cardBg, border: `1px solid ${c.border}` }}
                      >
                        {/* Mini sparkline curve */}
                        <div className="w-full h-2 rounded-b" style={{ backgroundColor: `${c.primaryAccent}44` }} />
                      </div>
                    </div>
                  </div>

                  {/* Active selected badge */}
                  {isSelected && (
                    <div
                      className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-md"
                      style={{
                        backgroundColor: c.primaryAccent,
                        color: theme.isLight ? '#FFFFFF' : '#0B1020',
                      }}
                    >
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  )}

                  {/* Light / Dark Mode Tag */}
                  <div
                    className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase"
                    style={{
                      backgroundColor: `${c.mainBg}EE`,
                      color: c.secondaryText,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {theme.isLight ? <Sun className="w-2.5 h-2.5" /> : <Moon className="w-2.5 h-2.5" />}
                    <span>{theme.isLight ? 'Light' : 'Dark'}</span>
                  </div>
                </div>

                {/* Card Info & Color Swatches */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-xs font-bold transition-colors" style={{ color: c.primaryText }}>
                      {theme.name}
                    </h4>
                    <p className="text-[10px] mt-0.5 line-clamp-2 leading-relaxed" style={{ color: c.secondaryText }}>
                      {theme.tagline}
                    </p>
                  </div>

                  {/* Swatches Bar */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t" style={{ borderColor: c.border }}>
                    <div className="flex items-center gap-1.5">
                      {theme.swatches.map((hex, sIdx) => (
                        <span
                          key={sIdx}
                          className="w-3 h-3 rounded-full border shadow-xs"
                          style={{ backgroundColor: hex, borderColor: c.border }}
                          title={`Color swatch: ${hex}`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono uppercase font-semibold" style={{ color: c.primaryAccent }}>
                      Select
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Accent Color Picker */}
      <div className="p-5 rounded-2xl border space-y-4 theme-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold tracking-tight" style={{ color: activePreset.colors.primaryText }}>
              Custom Accent Color
            </h3>
            <p className="text-xs" style={{ color: activePreset.colors.secondaryText }}>
              Override the primary accent across buttons, countdown rings, charts, and highlighted badges.
            </p>
          </div>

          {customization.customAccentColor && (
            <button
              onClick={() => handleSelectAccent(null)}
              className="text-xs hover:underline flex items-center gap-1 transition-colors cursor-pointer"
              style={{ color: activePreset.colors.secondaryText }}
            >
              <span>Reset to theme accent ({activePreset.colors.primaryAccent})</span>
            </button>
          )}
        </div>

        {/* Quick Accent Swatches */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          {QUICK_ACCENTS.map((swatch) => {
            const isChosen = effectiveAccent.toLowerCase() === swatch.hex.toLowerCase();
            return (
              <button
                key={swatch.hex}
                onClick={() => handleSelectAccent(swatch.hex)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isChosen
                    ? 'ring-2 font-semibold shadow-md'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)',
                  borderColor: isChosen ? swatch.hex : activePreset.colors.border,
                  color: activePreset.colors.primaryText,
                  boxShadow: isChosen ? `0 0 12px ${swatch.hex}40` : undefined,
                }}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-inner"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span>{swatch.name}</span>
                {isChosen && <Check className="w-3 h-3 ml-0.5" style={{ color: swatch.hex }} />}
              </button>
            );
          })}
        </div>

        {/* Custom Hex Input & HTML5 Native Color Picker */}
        <form onSubmit={handleHexSubmit} className="flex items-center gap-3 pt-2 max-w-sm">
          <div className="relative flex items-center gap-2 flex-1">
            <input
              type="color"
              value={effectiveAccent}
              onChange={(e) => handleSelectAccent(e.target.value)}
              className="w-9 h-9 rounded-xl border cursor-pointer p-0.5"
              style={{
                borderColor: activePreset.colors.border,
                backgroundColor: 'transparent',
              }}
              title="Pick custom color"
            />
            <input
              type="text"
              placeholder="#43E6C3"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-mono uppercase focus:outline-none"
              style={{
                backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.3)',
                borderColor: activePreset.colors.border,
                borderWidth: '1px',
                color: activePreset.colors.primaryText,
              }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
            style={{
              backgroundColor: effectiveAccent,
              color: activePreset.isLight ? '#FFFFFF' : '#0B1020',
            }}
          >
            Apply Hex
          </button>
        </form>
      </div>

      {/* 3. Optional Ambient Visual Environments */}
      <div className="p-5 rounded-2xl border space-y-5 theme-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" style={{ color: effectiveAccent }} />
              <h3 className="text-sm font-bold tracking-tight" style={{ color: activePreset.colors.primaryText }}>
                Ambient Visual Environments
              </h3>
            </div>
            <p className="text-xs" style={{ color: activePreset.colors.secondaryText }}>
              High-resolution photography and mood atmospheres behind the timer. Text contrast is automatically protected.
            </p>
          </div>

          <button
            onClick={() =>
              onUpdateCustomization((prev) => ({
                ...prev,
                enableAmbientVisuals: !prev.enableAmbientVisuals,
              }))
            }
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              customization.enableAmbientVisuals
                ? 'shadow-md'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor: customization.enableAmbientVisuals
                ? effectiveAccent
                : activePreset.isLight
                ? 'rgba(0,0,0,0.06)'
                : 'rgba(255,255,255,0.08)',
              color: customization.enableAmbientVisuals
                ? activePreset.isLight
                  ? '#FFF'
                  : '#0B1020'
                : activePreset.colors.secondaryText,
            }}
          >
            {customization.enableAmbientVisuals ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* 6 Ambient Environment Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {AMBIENT_PRESETS.map((amb) => {
            const isChosen =
              customization.enableAmbientVisuals &&
              customization.ambientPresetId === amb.id;

            return (
              <button
                key={amb.id}
                onClick={() => handleAmbientSelect(amb.id)}
                className={`flex flex-col rounded-xl overflow-hidden border p-2 text-left transition-all cursor-pointer ${
                  isChosen
                    ? 'ring-2 scale-102 shadow-lg'
                    : 'hover:border-opacity-50'
                }`}
                style={{
                  backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
                  borderColor: isChosen ? effectiveAccent : activePreset.colors.border,
                }}
              >
                <div className="relative h-16 w-full rounded-lg overflow-hidden bg-black/40 mb-2">
                  {amb.imageUrl ? (
                    <img
                      src={amb.imageUrl}
                      alt={amb.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center font-mono text-[10px]"
                      style={{ color: activePreset.colors.secondaryText }}
                    >
                      Solid
                    </div>
                  )}

                  {isChosen && (
                    <div
                      className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: effectiveAccent }}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <p className="text-xs font-semibold truncate" style={{ color: activePreset.colors.primaryText }}>
                  {amb.name}
                </p>
                <p className="text-[9px] truncate mt-0.5" style={{ color: activePreset.colors.secondaryText }}>
                  {amb.tagline}
                </p>
              </button>
            );
          })}
        </div>

        {/* Dimming Slider Control */}
        {customization.enableAmbientVisuals && customization.ambientPresetId !== 'none' && (
          <div
            className="pt-2 flex items-center gap-4 p-3 rounded-xl border"
            style={{
              backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.3)',
              borderColor: activePreset.colors.border,
            }}
          >
            <Sliders className="w-4 h-4 shrink-0" style={{ color: activePreset.colors.secondaryText }} />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: activePreset.colors.primaryText }}>Background Dimming</span>
                <span className="font-mono font-medium" style={{ color: activePreset.colors.secondaryText }}>
                  {Math.round(customization.ambientDimming * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.9"
                step="0.05"
                value={customization.ambientDimming}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateCustomization((prev) => ({
                    ...prev,
                    ambientDimming: val,
                  }));
                }}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: effectiveAccent,
                  backgroundColor: activePreset.isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
