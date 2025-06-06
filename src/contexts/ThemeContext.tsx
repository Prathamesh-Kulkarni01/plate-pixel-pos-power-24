
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemePreset = 'modern' | 'classic' | 'vibrant' | 'elegant' | 'rustic' | 'minimalist';
export type ColorMode = 'light' | 'dark' | 'system';

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ThemeContextType {
  preset: ThemePreset;
  colorMode: ColorMode;
  customColors: CustomColors | null;
  setPreset: (preset: ThemePreset) => void;
  setColorMode: (mode: ColorMode) => void;
  setCustomColors: (colors: CustomColors | null) => void;
  actualColorMode: 'light' | 'dark';
}

const defaultCustomColors: CustomColors = {
  primary: '#22c55e',
  secondary: '#f59e0b',
  accent: '#3b82f6'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preset, setPreset] = useState<ThemePreset>(() => {
    const stored = localStorage.getItem('theme-preset') as ThemePreset;
    return stored || 'modern';
  });

  const [colorMode, setColorMode] = useState<ColorMode>(() => {
    const stored = localStorage.getItem('color-mode') as ColorMode;
    return stored || 'system';
  });

  const [customColors, setCustomColors] = useState<CustomColors | null>(() => {
    const stored = localStorage.getItem('custom-colors');
    return stored ? JSON.parse(stored) : null;
  });

  const [actualColorMode, setActualColorMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Handle color mode
    if (colorMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setActualColorMode(systemTheme);
      root.classList.toggle('dark', systemTheme === 'dark');
    } else {
      setActualColorMode(colorMode);
      root.classList.toggle('dark', colorMode === 'dark');
    }

    // Apply theme preset
    root.setAttribute('data-theme', preset);

    // Apply custom colors if available
    if (customColors) {
      root.style.setProperty('--custom-primary', customColors.primary);
      root.style.setProperty('--custom-secondary', customColors.secondary);
      root.style.setProperty('--custom-accent', customColors.accent);
      root.setAttribute('data-custom-colors', 'true');
    } else {
      root.removeAttribute('data-custom-colors');
    }
    
    localStorage.setItem('theme-preset', preset);
    localStorage.setItem('color-mode', colorMode);
    if (customColors) {
      localStorage.setItem('custom-colors', JSON.stringify(customColors));
    } else {
      localStorage.removeItem('custom-colors');
    }
  }, [preset, colorMode, customColors]);

  useEffect(() => {
    if (colorMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        setActualColorMode(e.matches ? 'dark' : 'light');
        window.document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [colorMode]);

  return (
    <ThemeContext.Provider value={{ 
      preset, 
      colorMode, 
      customColors,
      setPreset, 
      setColorMode, 
      setCustomColors,
      actualColorMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
