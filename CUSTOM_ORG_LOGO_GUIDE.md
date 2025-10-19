# Custom Organization Logo Guide 🎨

## How to Add Your Own Organization Logo

The Organization Switcher now supports custom logos! Here are three ways to add your logo:

### Method 1: Use the `customLogo` Prop (Recommended)

**Simple and Direct:**
```jsx
// In App.jsx or wherever you use OrganizationSwitcher
import logo from './assets/your-logo.png';

<OrganizationSwitcher customLogo={logo} />
```

This will use your custom logo for ALL organizations.

### Method 2: Set a Default Logo in the Component

**Edit `/src/components/auth/OrganizationSwitcherCustom.jsx`:**
```jsx
// At the top of the file (line 11)
import logo from '../assets/your-logo.png';

// Change this line:
const DEFAULT_ORG_LOGO = null; 

// To this:
const DEFAULT_ORG_LOGO = logo;
```

### Method 3: Use Clerk's Organization Settings

**Upload logo via Clerk Dashboard:**
1. Go to your Clerk Dashboard
2. Navigate to Organizations
3. Select your organization
4. Upload a logo image
5. The component will automatically use `organization.imageUrl`

## Logo Requirements

### Image Format
- **Supported**: PNG, JPG, SVG, WebP
- **Recommended**: PNG or SVG for best quality
- **Transparency**: PNG or SVG for transparent backgrounds

### Image Size
- **Recommended**: 256x256px or 512x512px (square)
- **Minimum**: 64x64px
- **Maximum**: 1024x1024px
- **Aspect Ratio**: 1:1 (square) works best

### File Size
- **Recommended**: Under 100KB
- **Maximum**: 500KB
- **Optimization**: Use tools like TinyPNG or Squoosh to compress

## Logo Display Specifications

### Main Button Icon
- **Size**: 28x28px
- **Border**: 1px teal (#99f6e4)
- **Border Radius**: 6px (rounded corners)
- **Background**: White (if logo has transparency)
- **Object Fit**: `contain` (preserves aspect ratio)
- **Padding**: 2px internal padding

### Dropdown List Icons
- **Size**: 36x36px
- **Border**: 1px teal (#99f6e4)
- **Border Radius**: 6px (rounded corners)
- **Background**: White (if logo has transparency)
- **Object Fit**: `contain` (preserves aspect ratio)
- **Padding**: 3px internal padding

## Example Logo Files

### Option 1: Use a Local File

**Step 1: Add your logo to the project**
```
src/
  assets/
    logo.png          ← Your logo here
    logo-dark.png     ← Optional: Dark mode version
```

**Step 2: Import and use**
```jsx
// In App.jsx
import orgLogo from './assets/logo.png';

<OrganizationSwitcher customLogo={orgLogo} />
```

### Option 2: Use an External URL

```jsx
<OrganizationSwitcher customLogo="https://example.com/logo.png" />
```

### Option 3: Use Different Logos Per Organization

**Modify the component to support per-org logos:**
```jsx
// In OrganizationSwitcherCustom.jsx
const ORG_LOGOS = {
  'org_abc123': '/logos/company-a.png',
  'org_xyz789': '/logos/company-b.png',
};

const getOrgLogo = (org) => {
  if (customLogo) return customLogo;
  if (org?.id && ORG_LOGOS[org.id]) return ORG_LOGOS[org.id];
  if (org?.imageUrl) return org.imageUrl;
  return DEFAULT_ORG_LOGO;
};
```

## Logo Design Tips

### For Best Results

**Colors:**
- Use your brand colors
- Ensure good contrast against white background
- Consider adding a subtle border if logo is white

**Shape:**
- Square logos work best
- Circular logos are also great
- Avoid wide/tall aspect ratios

**Style:**
- Simple, clean designs
- Avoid too much detail (logo is small)
- High contrast elements
- Clear, bold shapes

### Examples of Good Logos
```
✅ Simple icon or letter
✅ Company initials
✅ Minimalist symbol
✅ Single color icon
✅ Outline-style icon
```

### Examples to Avoid
```
❌ Complex detailed illustrations
❌ Thin lines (hard to see at small size)
❌ Text-heavy logos (won't be readable)
❌ Multiple small elements
❌ Very light colors on white
```

## Using SVG Logos (Recommended)

### Benefits
- ✅ Scalable without quality loss
- ✅ Small file size
- ✅ Crisp at any size
- ✅ Easy to modify colors

### Example SVG Logo
```jsx
// Create a component
const Logo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" 
          fill="#14b8a6"/>
  </svg>
);

// Use it
<OrganizationSwitcher customLogo={<Logo />} />
```

## Quick Setup Examples

### Example 1: Company Logo
```jsx
// src/assets/company-logo.png (your actual logo)
import companyLogo from './assets/company-logo.png';

<OrganizationSwitcher customLogo={companyLogo} />
```

### Example 2: Property Management Icon
```jsx
// Use a building/property icon
import { Building } from 'lucide-react';

// Or use an image
<OrganizationSwitcher customLogo="/images/property-icon.png" />
```

### Example 3: Personal Branding
```jsx
// Use your initials or personal logo
<OrganizationSwitcher customLogo="/images/personal-brand.svg" />
```

## Fallback Behavior

The component uses this priority order:

1. **customLogo prop** (if provided) - Highest priority
2. **organization.imageUrl** (from Clerk) - If available
3. **DEFAULT_ORG_LOGO** (set in component) - Your default
4. **Building2 icon** (Lucide React) - Final fallback

```jsx
// Priority visualization
customLogo → org.imageUrl → DEFAULT_ORG_LOGO → Building2 icon
```

## Testing Your Logo

### Checklist
- [ ] Logo is visible in main button (28x28px)
- [ ] Logo is visible in dropdown (36x36px)
- [ ] Logo looks clear and crisp
- [ ] Logo has good contrast against white
- [ ] Logo maintains aspect ratio
- [ ] Logo loads quickly
- [ ] Logo looks good at both sizes
- [ ] Logo matches your brand

## Advanced Customization

### Change Logo Size
```jsx
// In OrganizationSwitcherCustom.jsx

// Main button icon (currently 28x28)
width: '32px',
height: '32px',

// Dropdown icons (currently 36x36)
width: '40px',
height: '40px',
```

### Change Border Radius
```jsx
// Make it circular
borderRadius: '50%',

// Make it more rounded
borderRadius: '8px',

// Make it square
borderRadius: '0',
```

### Change Background
```jsx
// Solid color
background: '#f0fdfa',

// Different gradient
background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',

// Remove gradient when logo present
background: logo ? 'white' : 'linear-gradient(...)',
```

## Troubleshooting

### Logo Doesn't Show
- ✅ Check file path is correct
- ✅ Verify image file exists in assets folder
- ✅ Check console for 404 errors
- ✅ Ensure import statement is correct

### Logo Looks Blurry
- ✅ Use higher resolution image (512x512 or larger)
- ✅ Use SVG instead of raster format
- ✅ Check `objectFit: 'contain'` is set
- ✅ Verify image isn't being stretched

### Logo Too Small/Large
- ✅ Adjust container width/height
- ✅ Modify padding values
- ✅ Check `objectFit` property
- ✅ Verify image dimensions

### Logo Has Wrong Colors
- ✅ Check image file itself
- ✅ Ensure PNG has transparency if needed
- ✅ Consider using SVG for color control
- ✅ Verify no CSS filters applied

## Current Implementation

```jsx
// Main button displays:
<div style={{
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  border: '1px solid #99f6e4',
  background: currentLogo ? 'white' : 'gradient',
}}>
  {currentLogo ? (
    <img src={currentLogo} style={{ objectFit: 'contain', padding: '2px' }} />
  ) : (
    <Building2 icon />
  )}
</div>

// Dropdown displays:
<div style={{
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  border: '1px solid #99f6e4',
  background: logo ? 'white' : 'gradient',
}}>
  {logo ? (
    <img src={logo} style={{ objectFit: 'contain', padding: '3px' }} />
  ) : (
    <Building2 icon />
  )}
</div>
```

## Example: Complete Setup

```jsx
// 1. Add logo to project
// src/assets/my-company-logo.png

// 2. Import in App.jsx
import React from 'react';
import OrganizationSwitcher from './components/auth/OrganizationSwitcherCustom';
import myLogo from './assets/my-company-logo.png';

function App() {
  return (
    <header>
      <OrganizationSwitcher customLogo={myLogo} />
      {/* Rest of your app */}
    </header>
  );
}
```

## Next Steps

1. **Choose your logo** - Prepare a square image (256x256 or larger)
2. **Add to project** - Place in `/src/assets/` folder
3. **Import and use** - Pass as `customLogo` prop
4. **Test** - Check both button and dropdown views
5. **Refine** - Adjust size/padding if needed

Your organization switcher will now display your custom branding! 🎉
