# 🎨 Theme Customization Guide

Your app now has a centralized theme system that makes it super easy to change the entire color scheme!

## 🚀 Quick Start - Change Theme

To change your app's theme, simply open:
```
src/config/theme.js
```

And change line 12:
```javascript
export const ACTIVE_THEME = 'TEAL'; // Change this!
```

## 🎨 Available Themes

### 1. **TEAL** (Current - Recommended)
- Modern teal/cyan gradient
- Professional and unique
- Different from Innago's blue
- Color: `#14b8a6` (Teal-500)

### 2. **PURPLE**
- Vibrant purple/violet gradient
- Creative and bold
- Color: `#a855f7` (Purple-500)

### 3. **EMERALD**
- Fresh green/emerald gradient
- Growth-focused and natural
- Color: `#10b981` (Emerald-500)

### 4. **ROSE**
- Elegant pink/rose gradient
- Modern and sophisticated
- Color: `#f43f5e` (Rose-500)

### 5. **BLUE** (Original)
- Classic blue gradient
- Similar to Innago
- Color: `#3b82f6` (Blue-500)

## 📝 How to Switch Themes

1. Open `src/config/theme.js`
2. Change `ACTIVE_THEME` to one of: `'TEAL'`, `'PURPLE'`, `'EMERALD'`, `'ROSE'`, or `'BLUE'`
3. Save the file
4. The app will automatically update!

Example:
```javascript
// For purple theme
export const ACTIVE_THEME = 'PURPLE';

// For emerald theme
export const ACTIVE_THEME = 'EMERALD';

// For rose theme
export const ACTIVE_THEME = 'ROSE';
```

## 🎯 What Gets Updated

When you change the theme, these elements automatically update:

- ✅ **Backgrounds**: Page backgrounds, gradients
- ✅ **Navigation**: Sidebar, navbar, active states
- ✅ **Cards**: All card backgrounds and borders
- ✅ **Buttons**: All button colors and gradients
- ✅ **Text**: Primary and secondary text colors
- ✅ **Borders**: All border colors
- ✅ **Auth Pages**: Sign in, sign up, onboarding

## 🛠️ Advanced: Create Custom Theme

Want a completely custom theme? Add it to `THEMES` object in `src/config/theme.js`:

```javascript
export const THEMES = {
  // ... existing themes ...
  
  // Your custom theme
  CUSTOM: {
    name: 'Custom',
    colors: {
      gradient: {
        light: '#your-color-50',
        medium: '#your-color-100',
        // ... etc
      },
      // ... etc
    },
    gradients: {
      background: 'linear-gradient(...)',
      card: 'linear-gradient(...)',
      button: 'linear-gradient(...)',
      // ... etc
    }
  }
};
```

Then set:
```javascript
export const ACTIVE_THEME = 'CUSTOM';
```

## 📊 Theme Preview

### Teal Theme (Recommended)
```
Background: Light teal → Medium teal → Bright teal
Primary: #14b8a6 (Teal-500)
Text: Dark teal (#134e4a)
```

### Purple Theme
```
Background: Light purple → Medium purple → Bright purple
Primary: #a855f7 (Purple-500)
Text: Dark purple (#581c87)
```

### Emerald Theme
```
Background: Light emerald → Medium emerald → Bright emerald
Primary: #10b981 (Emerald-500)
Text: Dark emerald (#064e3b)
```

### Rose Theme
```
Background: Light rose → Medium rose → Bright rose
Primary: #f43f5e (Rose-500)
Text: Dark rose (#881337)
```

## 💡 Tips

1. **Preview themes**: Try each one to see which fits your brand best
2. **Consistency**: The theme applies everywhere automatically
3. **Accessibility**: All themes maintain good contrast ratios
4. **Performance**: Changing themes has zero performance impact

## 🔄 Updating Individual Components

If you create new components, use the theme constants:

```javascript
import { 
  GRADIENT_BACKGROUND,
  GRADIENT_CARD,
  GRADIENT_BUTTON,
  PRIMARY_COLOR,
  TEXT_PRIMARY,
  BORDER_LIGHT
} from '../config/theme';

// Then use in your component:
<div style={{ 
  background: GRADIENT_BACKGROUND,
  color: TEXT_PRIMARY,
  border: `1px solid ${BORDER_LIGHT}`
}}>
  ...
</div>
```

## 🎉 That's It!

Your entire app theme can now be changed with a single line of code!

Try it now:
1. Open `src/config/theme.js`
2. Change `ACTIVE_THEME = 'TEAL'` to `ACTIVE_THEME = 'PURPLE'`
3. Save and watch the magic happen! ✨
