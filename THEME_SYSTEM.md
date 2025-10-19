# 🎨 Theme & Icon System

## Quick Theme Change

To change the app's color scheme, edit `/src/config/theme.js`:

```javascript
// Line 14 - Change this value:
export const ACTIVE_THEME = 'TEAL'; // Options: 'TEAL', 'PURPLE', 'EMERALD', 'ROSE', 'BLUE'
```

### Available Themes:

1. **TEAL** (Default) - Modern teal/cyan gradient 🌊
   - Professional and unique
   - Different from Innago's blue theme
   
2. **PURPLE** - Vibrant purple/violet gradient 💜
   - Creative and bold
   - Great for standing out
   
3. **EMERALD** - Fresh green/emerald gradient 🌿
   - Growth-focused
   - Clean and natural
   
4. **ROSE** - Elegant pink/rose gradient 🌹
   - Modern and elegant
   - Soft and approachable
   
5. **BLUE** - Original blue gradient 💙
   - Classic and familiar
   - Similar to Innago

## Icon System

All icons are now managed centrally using **Lucide React** for consistency.

### Usage Example:

```javascript
import { NavIcons, ActionIcons, ICON_SIZES } from './config/icons';

// In your component:
<NavIcons.Dashboard size={ICON_SIZES.md} />
<ActionIcons.Add size={ICON_SIZES.lg} />
```

### Icon Categories:

- **NavIcons**: Dashboard, Properties, Tenants, Users, Leases, Income, Expenses, Settings
- **ActionIcons**: Add, Edit, Delete, Save, Copy, Share, etc.
- **UIIcons**: Menu, Close, Chevrons, More options
- **StatusIcons**: Success, Error, Warning, Info
- **DataIcons**: Charts, Trends, Activity
- **FileIcons**: Folder, File, Attachment

### Icon Sizes:

```javascript
ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,  // Default
  lg: 24,
  xl: 32
}
```

## File Structure:

```
src/config/
├── theme.js       # Theme configuration
└── icons.jsx      # Icon configuration

src/
├── App.jsx        # Updated with theme & icons
├── AppMobile.jsx  # Updated with theme & icons
└── pages/         # All pages use theme & icons
```

## Making Changes:

1. **Global Theme**: Edit `/src/config/theme.js` line 14
2. **Individual Colors**: Modify the theme object in theme.js
3. **Icons**: Import from `/src/config/icons.jsx`
4. **Custom Gradients**: Add to your theme object

## Benefits:

✅ Consistent styling across the entire app
✅ One-line theme switching
✅ Professional, minimalistic icons
✅ Easy maintenance and updates
✅ No emoji or unicode character inconsistencies
