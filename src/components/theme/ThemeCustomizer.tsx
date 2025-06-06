
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTheme, ThemePreset, ColorMode, CustomColors } from '@/contexts/ThemeContext';
import { Palette, Sun, Moon, Monitor, Utensils, Coffee, Wine, Cake } from 'lucide-react';

const themePresets = [
  {
    id: 'modern' as ThemePreset,
    name: 'Modern Fresh',
    description: 'Clean and contemporary',
    icon: Utensils,
    colors: ['#22c55e', '#f59e0b', '#3b82f6']
  },
  {
    id: 'classic' as ThemePreset,
    name: 'Classic Warm',
    description: 'Traditional restaurant feel',
    icon: Coffee,
    colors: ['#dc2626', '#f59e0b', '#7c2d12']
  },
  {
    id: 'vibrant' as ThemePreset,
    name: 'Vibrant Energy',
    description: 'Bold and energetic',
    icon: Cake,
    colors: ['#f97316', '#ec4899', '#8b5cf6']
  },
  {
    id: 'elegant' as ThemePreset,
    name: 'Elegant Fine',
    description: 'Sophisticated dining',
    icon: Wine,
    colors: ['#6366f1', '#8b5cf6', '#d946ef']
  },
  {
    id: 'rustic' as ThemePreset,
    name: 'Rustic Natural',
    description: 'Earthy and organic',
    icon: Coffee,
    colors: ['#059669', '#92400e', '#b45309']
  },
  {
    id: 'minimalist' as ThemePreset,
    name: 'Minimalist Clean',
    description: 'Simple and focused',
    icon: Utensils,
    colors: ['#374151', '#6b7280', '#9ca3af']
  }
];

const colorModes = [
  { id: 'light' as ColorMode, name: 'Light', icon: Sun },
  { id: 'dark' as ColorMode, name: 'Dark', icon: Moon },
  { id: 'system' as ColorMode, name: 'System', icon: Monitor }
];

export function ThemeCustomizer() {
  const { preset, colorMode, customColors, setPreset, setColorMode, setCustomColors } = useTheme();

  const handleCustomColorChange = (key: keyof CustomColors, value: string) => {
    const newColors = customColors || { primary: '#22c55e', secondary: '#f59e0b', accent: '#3b82f6' };
    setCustomColors({ ...newColors, [key]: value });
  };

  const resetCustomColors = () => {
    setCustomColors(null);
  };

  return (
    <div className="space-y-6">
      {/* Color Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Color Mode</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {colorModes.map((mode) => (
              <Button
                key={mode.id}
                variant={colorMode === mode.id ? "default" : "outline"}
                onClick={() => setColorMode(mode.id)}
                className="flex flex-col items-center space-y-2 h-auto py-4"
              >
                <mode.icon className="h-5 w-5" />
                <span className="text-sm">{mode.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Theme Presets</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themePresets.map((theme) => (
              <div
                key={theme.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                  preset === theme.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setPreset(theme.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <theme.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{theme.name}</h3>
                      {preset === theme.id && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{theme.description}</p>
                    <div className="flex space-x-1">
                      {theme.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Custom Brand Colors</span>
            </div>
            {customColors && (
              <Button variant="outline" size="sm" onClick={resetCustomColors}>
                Reset
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Primary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="primary"
                    type="color"
                    value={customColors?.primary || '#22c55e'}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customColors?.primary || '#22c55e'}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    placeholder="#22c55e"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary">Secondary Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={customColors?.secondary || '#f59e0b'}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customColors?.secondary || '#f59e0b'}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    placeholder="#f59e0b"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accent">Accent Color</Label>
                <div className="flex space-x-2">
                  <Input
                    id="accent"
                    type="color"
                    value={customColors?.accent || '#3b82f6'}
                    onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={customColors?.accent || '#3b82f6'}
                    onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            {customColors && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                <div className="flex space-x-2">
                  <Button size="sm">Primary Action</Button>
                  <Button variant="secondary" size="sm">Secondary</Button>
                  <Badge style={{ backgroundColor: customColors.accent, color: 'white' }}>
                    Accent
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
