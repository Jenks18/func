# 🎨 Gradient Theme Schema Template

A comprehensive guide for creating custom gradient theme schemas that you can use in any project.

---

## 📋 Complete Theme Schema Structure

```javascript
export const THEMES = {
  YOUR_THEME_NAME: {
    name: 'Display Name',
    colors: {
      // Primary gradient colors (7 shades from light to dark)
      gradient: {
        light: '#______',      // -50 shade (lightest)
        medium: '#______',     // -100 shade
        mediumDark: '#______', // -200 shade
        dark: '#______',       // -300 shade
        darker: '#______',     // -400 shade
        primary: '#______',    // -500 shade (main brand color)
        primaryDark: '#______', // -600 shade (darkest)
      },
      
      // Text colors (3 variations)
      text: {
        primary: '#______',    // -900 shade (darkest text)
        secondary: '#______',  // -700 shade (medium text)
        light: '#______',      // -500 shade (light text)
      },
      
      // Border colors (3 variations)
      border: {
        light: '#______',      // -200 shade (subtle borders)
        medium: '#______',     // -300 shade (normal borders)
        dark: '#______',       // -400 shade (prominent borders)
      }
    },
    
    // Pre-built gradient strings
    gradients: {
      // Main page background
      background: 'linear-gradient(135deg, [light] 0%, [medium] 50%, [mediumDark] 100%)',
      
      // Card backgrounds
      card: 'linear-gradient(135deg, #ffffff 0%, [light] 100%)',
      cardLight: 'linear-gradient(135deg, [medium] 0%, [mediumDark] 100%)',
      
      // Button backgrounds
      button: 'linear-gradient(135deg, [primary] 0%, [darker] 100%)',
      buttonDark: 'linear-gradient(135deg, [primaryDark] 0%, [primary] 100%)',
      
      // Navbar background
      navbar: 'linear-gradient(90deg, rgba([light-rgb], 0.98) 0%, rgba([medium-rgb], 0.98) 100%)',
    }
  }
};
```

---

## 🎯 Step-by-Step: Creating a New Theme

### Step 1: Choose Your Base Color

Pick a primary color for your brand (this will be the `-500` shade):

Examples:
- **Teal**: `#14b8a6`
- **Purple**: `#a855f7`
- **Orange**: `#f97316`
- **Indigo**: `#6366f1`

### Step 2: Generate Color Shades

Use [Tailwind Color Generator](https://tailwindshades.com/) or create 7 shades manually:

```javascript
gradient: {
  light: '#______',      // -50:  Very light, almost white
  medium: '#______',     // -100: Light
  mediumDark: '#______', // -200: Lighter medium
  dark: '#______',       // -300: Medium
  darker: '#______',     // -400: Darker medium
  primary: '#______',    // -500: Your base color ⭐
  primaryDark: '#______', // -600: Dark
}
```

**Example with Orange** (`#f97316`):
```javascript
gradient: {
  light: '#fff7ed',      // orange-50
  medium: '#ffedd5',     // orange-100
  mediumDark: '#fed7aa', // orange-200
  dark: '#fdba74',       // orange-300
  darker: '#fb923c',     // orange-400
  primary: '#f97316',    // orange-500 ⭐
  primaryDark: '#ea580c', // orange-600
}
```

### Step 3: Create Text Colors

Use darker shades from your color palette:

```javascript
text: {
  primary: '#______',    // -900: Darkest (main text)
  secondary: '#______',  // -700: Medium dark (secondary text)
  light: '#______',      // -500: Your base color (accents)
}
```

**Example with Orange**:
```javascript
text: {
  primary: '#7c2d12',    // orange-900
  secondary: '#c2410c',  // orange-700
  light: '#f97316',      // orange-500
}
```

### Step 4: Create Border Colors

Use lighter medium shades:

```javascript
border: {
  light: '#______',      // -200: Subtle borders
  medium: '#______',     // -300: Normal borders
  dark: '#______',       // -400: Prominent borders
}
```

**Example with Orange**:
```javascript
border: {
  light: '#fed7aa',      // orange-200
  medium: '#fdba74',     // orange-300
  dark: '#fb923c',       // orange-400
}
```

### Step 5: Build Gradient Strings

Create linear gradients using your shades:

```javascript
gradients: {
  // Background: light → medium → mediumDark
  background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
  
  // Card: white → light
  card: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
  
  // Card Light: medium → mediumDark
  cardLight: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
  
  // Button: primary → darker
  button: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
  
  // Button Dark: primaryDark → primary
  buttonDark: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
  
  // Navbar: light (with opacity) → medium (with opacity)
  navbar: 'linear-gradient(90deg, rgba(255, 247, 237, 0.98) 0%, rgba(255, 237, 213, 0.98) 100%)',
}
```

---

## 📐 Gradient Formula Reference

### Background Gradients
```css
/* Page backgrounds - diagonal, light to medium */
linear-gradient(135deg, [light] 0%, [medium] 50%, [mediumDark] 100%)

/* Angle options */
135deg = diagonal (top-left to bottom-right)
90deg  = horizontal (left to right)
180deg = vertical (top to bottom)
```

### Card Gradients
```css
/* Subtle white to light */
linear-gradient(135deg, #ffffff 0%, [light] 100%)

/* More vibrant light to medium */
linear-gradient(135deg, [medium] 0%, [mediumDark] 100%)
```

### Button Gradients
```css
/* Primary button - brand color to darker */
linear-gradient(135deg, [primary] 0%, [darker] 100%)

/* Hover state - even darker */
linear-gradient(135deg, [primaryDark] 0%, [primary] 100%)
```

### Navbar with Transparency
```css
/* Semi-transparent for glass effect */
linear-gradient(90deg, rgba(R, G, B, 0.98) 0%, rgba(R, G, B, 0.98) 100%)

/* Convert hex to RGB first */
#fff7ed → rgb(255, 247, 237)
```

---

## 🎨 Complete Example: Orange Theme

```javascript
export const THEMES = {
  ORANGE: {
    name: 'Orange',
    colors: {
      gradient: {
        light: '#fff7ed',      // orange-50
        medium: '#ffedd5',     // orange-100
        mediumDark: '#fed7aa', // orange-200
        dark: '#fdba74',       // orange-300
        darker: '#fb923c',     // orange-400
        primary: '#f97316',    // orange-500
        primaryDark: '#ea580c', // orange-600
      },
      text: {
        primary: '#7c2d12',    // orange-900
        secondary: '#c2410c',  // orange-700
        light: '#f97316',      // orange-500
      },
      border: {
        light: '#fed7aa',      // orange-200
        medium: '#fdba74',     // orange-300
        dark: '#fb923c',       // orange-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
      cardLight: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)',
      button: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      buttonDark: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      navbar: 'linear-gradient(90deg, rgba(255, 247, 237, 0.98) 0%, rgba(255, 237, 213, 0.98) 100%)',
    }
  }
};
```

---

## 🔧 Quick Reference: Tailwind Color Scales

Use these Tailwind color names to quickly find shades:

| Shade | Use Case | Example |
|-------|----------|---------|
| -50   | Backgrounds, very light | `#fff7ed` |
| -100  | Hover states, subtle fills | `#ffedd5` |
| -200  | Borders, dividers | `#fed7aa` |
| -300  | Disabled states | `#fdba74` |
| -400  | Placeholder text | `#fb923c` |
| -500  | **Primary brand color** | `#f97316` ⭐ |
| -600  | Hover states (darker) | `#ea580c` |
| -700  | Secondary text | `#c2410c` |
| -800  | Active states | `#9a3412` |
| -900  | Primary text | `#7c2d12` |

**Popular Tailwind Colors:**
- `slate`, `gray`, `zinc`, `neutral`, `stone`
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

Find all shades at: [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)

---

## 📊 Color Accessibility Guide

Ensure good contrast ratios:

```javascript
// Background vs Text
light background (#fff7ed) + dark text (#7c2d12) = ✅ WCAG AAA

// Button vs Button Text
primary button (#f97316) + white text (#ffffff) = ✅ WCAG AA

// Links and Accents
primary color (#f97316) on white = ✅ WCAG AA
```

Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 💡 Tips & Best Practices

1. **Start with Tailwind**: Use Tailwind color scales as your base
2. **Test contrast**: Always check text readability
3. **Keep it simple**: 5-7 shades is enough
4. **Use gradients subtly**: Don't go overboard with angle changes
5. **Opacity for depth**: Use `rgba()` with 0.95-0.98 for glass effects
6. **Consistent angles**: Stick to `135deg` for diagonals, `90deg` for horizontal
7. **Brand alignment**: Choose colors that match your brand identity

---

## 🚀 Usage in Your Project

### 1. Add to theme.js
```javascript
import { THEMES } from './path/to/theme.js';

// Add your new theme
export const ACTIVE_THEME = 'ORANGE'; // or 'YOUR_THEME_NAME'
```

### 2. Export constants
```javascript
export const theme = THEMES[ACTIVE_THEME];

export const {
  background: GRADIENT_BACKGROUND,
  card: GRADIENT_CARD,
  button: GRADIENT_BUTTON,
} = theme.gradients;

export const {
  primary: PRIMARY_COLOR,
} = theme.colors.gradient;
```

### 3. Use in components
```javascript
import { GRADIENT_BACKGROUND, PRIMARY_COLOR } from './config/theme';

<div style={{ 
  background: GRADIENT_BACKGROUND,
  color: PRIMARY_COLOR 
}}>
  ...
</div>
```

---

## 🎉 You're Ready!

You now have a complete template for creating beautiful gradient theme schemas. Copy this structure, pick your colors, and create unlimited themes for any project!

**Need inspiration?** Check out:
- [Coolors.co](https://coolors.co/) - Color palette generator
- [Color Hunt](https://colorhunt.co/) - Trending color palettes
- [Tailwind Shades](https://tailwindshades.com/) - Generate full color scales
- [UI Gradients](https://uigradients.com/) - Beautiful gradient examples

---

**Happy theming! 🎨✨**
