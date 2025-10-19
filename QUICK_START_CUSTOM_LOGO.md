# Quick Start: Add Your Custom Logo 🚀

## Step-by-Step Guide (5 Minutes)

### Step 1: Prepare Your Logo

**Requirements:**
- Square image (1:1 aspect ratio)
- PNG, JPG, or SVG format
- Recommended size: 256x256px or 512x512px
- File size: Under 100KB

### Step 2: Add Logo to Your Project

**Option A: Put it in the public folder (easiest)**
```
public/
  logo.png          ← Your logo here
  vite.svg
```

**Option B: Put it in the assets folder**
```
src/
  assets/
    logo.png        ← Your logo here
    react.svg
```

### Step 3: Use Your Logo

**If using public folder (Option A):**
```jsx
// In App.jsx (around line 710)

// Find this line:
<OrganizationSwitcher />

// Change it to:
<OrganizationSwitcher customLogo="/logo.png" />
```

**If using assets folder (Option B):**
```jsx
// In App.jsx

// 1. Add import at the top (around line 27):
import logo from './assets/logo.png';

// 2. Find this line (around line 710):
<OrganizationSwitcher />

// 3. Change it to:
<OrganizationSwitcher customLogo={logo} />
```

### Step 4: Refresh & See!

Refresh your browser at `http://localhost:5174/` and your custom logo will appear! ✨

## Current Files to Edit

### File: `/src/App.jsx`

Find line ~710 (in the header section):
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <OrganizationSwitcher />  ← Add customLogo prop here
  <UserButton />
</div>
```

Change to:
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <OrganizationSwitcher customLogo="/logo.png" />
  <UserButton />
</div>
```

## Examples

### Example 1: Simple Path (Public Folder)
```jsx
<OrganizationSwitcher customLogo="/my-company-logo.png" />
```

### Example 2: Import from Assets
```jsx
// Top of file
import myLogo from './assets/company-logo.png';

// In component
<OrganizationSwitcher customLogo={myLogo} />
```

### Example 3: External URL
```jsx
<OrganizationSwitcher customLogo="https://mywebsite.com/logo.png" />
```

### Example 4: SVG Logo
```jsx
// Top of file
import logoSvg from './assets/logo.svg';

// In component
<OrganizationSwitcher customLogo={logoSvg} />
```

## What It Looks Like

**Main Button (Top Right):**
```
┌─────────────────────────┐
│ [LOGO] My Organization ▼│
└─────────────────────────┘
     28x28px icon
```

**Dropdown Menu:**
```
┌────────────────────────────┐
│  SELECT ACCOUNT            │
├────────────────────────────┤
│ [LOGO] Personal Account  ✓ │
│       email@example.com    │
├────────────────────────────┤
│  ORGANIZATIONS             │
├────────────────────────────┤
│ [LOGO] My Company         │
│       5 members            │
├────────────────────────────┤
│ + Create Organization      │
└────────────────────────────┘
    36x36px icons
```

## Common Issues & Fixes

### Logo Not Showing?

**Check 1: File Path**
```jsx
// ✅ Correct (public folder)
<OrganizationSwitcher customLogo="/logo.png" />

// ❌ Wrong
<OrganizationSwitcher customLogo="logo.png" />  // Missing leading /
```

**Check 2: Import Path**
```jsx
// ✅ Correct (assets folder)
import logo from './assets/logo.png';

// ❌ Wrong
import logo from 'assets/logo.png';  // Missing ./
```

**Check 3: File Exists**
- Open `public/logo.png` in browser
- Or check `src/assets/logo.png` exists in VS Code

### Logo Looks Blurry?
- Use higher resolution (512x512 or larger)
- Use SVG format for crisp edges
- Ensure image is actually square

### Logo Too Big/Small?
The component automatically sizes it to fit. If you need different sizing:
```jsx
// Edit /src/components/auth/OrganizationSwitcherCustom.jsx
// Line ~76 (main button)
width: '32px',  // Change from 28px
height: '32px',

// Line ~289 (dropdown)
width: '40px',  // Change from 36px  
height: '40px',
```

## Test Your Logo

After adding, check:
- [ ] Logo visible in top-right button
- [ ] Logo visible in dropdown menu
- [ ] Logo looks crisp and clear
- [ ] Logo has good contrast
- [ ] Logo matches your brand

## Pro Tips

### Best Logo Types
```
✅ Company wordmark
✅ Simple icon/symbol  
✅ Monogram/initials
✅ Building/property icon
✅ Abstract shape
```

### To Avoid
```
❌ Photos
❌ Complex illustrations
❌ Text-heavy designs
❌ Thin lines
❌ Too many colors
```

### Recommended Tools
- **Create Logo**: Canva, Figma, Adobe Illustrator
- **Optimize PNG**: TinyPNG.com
- **Convert to SVG**: Vectorizer.ai
- **Generate Icon**: Favicon.io

## Complete Example

### 1. Create/Get Your Logo
- Download or create a square logo
- Save as `logo.png`
- Recommended: 512x512px

### 2. Add to Project
```bash
# Move logo to public folder
mv ~/Downloads/logo.png public/logo.png
```

### 3. Update App.jsx
```jsx
// Find line ~710
<OrganizationSwitcher />

// Change to:
<OrganizationSwitcher customLogo="/logo.png" />
```

### 4. Verify
- Save file (Cmd+S / Ctrl+S)
- Browser auto-refreshes
- See your logo in top-right! ✨

## Alternative: Use Building Icon (Default)

If you don't have a logo yet, the component shows a teal building icon by default. No action needed!

## Questions?

**Q: Can I use different logos for different organizations?**
A: Yes! See the advanced guide in `CUSTOM_ORG_LOGO_GUIDE.md`

**Q: Can I change the icon color?**
A: If using SVG, yes! Modify the SVG fill color.

**Q: Can I make it circular?**
A: Yes! Edit the component and change `borderRadius: '6px'` to `borderRadius: '50%'`

**Q: Where's the logo stored?**
A: Either in `/public/` folder or `/src/assets/` folder

## You're Done! 🎉

Your custom organization logo is now showing in:
- ✅ Top navigation bar
- ✅ Organization dropdown menu
- ✅ All organization selections

The logo will display at:
- **Main button**: 28x28px with 2px padding
- **Dropdown**: 36x36px with 3px padding
- **Background**: White (when logo present)
- **Border**: 1px teal (#99f6e4)
- **Style**: Rounded corners (6px)
