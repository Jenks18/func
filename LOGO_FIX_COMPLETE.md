# Logo Visibility Fix - Complete

## Problem
User reported that logo icon and "Diani Coast" brand name were not visible in the organization switcher. After multiple attempts to fix by increasing container sizes, the logo name completely disappeared.

## Root Cause
The LogoTitle component had problematic SVG transforms:
- `transform="translate(-70, -200) scale(0.45)"` was pushing the text completely outside the viewBox
- ViewBox `"0 0 400 120"` didn't match the transformed content
- The transform translation values (-70, -200) were moving content far off-screen

## Solution Applied

### 1. Reverted OrganizationSwitcher to Original Sizes ✅
All the aggressive size increases were reverted back to original working state:

**Button**:
- Padding: `8px 12px` (was temporarily 18×24px)
- Font size: `13px` (was 20px)
- Font weight: `500` (was 700)
- Min width: `200px` (was 320px)

**Logo Container**:
- Size: `28×28px` (was 56×56px)
- Border radius: `6px` (was 12px)
- Border: `1px` (was 2px)
- Logo size prop: `28` (was 50)

**Chevron Icon**:
- Size: `14px` (was 22px)

**Dropdown Items**:
- Personal account name: `14px` (was 18px)
- Email: `12px` (was 15px)
- Check icon: `16px` (was 22px)
- Org logo container: `36×36px` (was 52×52px)
- Org logo size: `28px` (was 46px)
- Org name: `14px` (was 18px)
- Members count: `12px` (was 15px)

### 2. Fixed LogoTitle Component ✅

**Before (Broken)**:
```jsx
viewBox="0 0 400 120"
<g transform="translate(10, 15)">
  <path transform="translate(-70, -200) scale(0.45)" />
```

**After (Fixed)**:
```jsx
viewBox="0 0 420 90"  // Properly sized to contain text
<g transform="scale(0.38)">  // Simple scaling from origin
  <path />  // No individual transforms
```

**Key Changes**:
- Removed problematic `translate(-70, -200)` that pushed content off-screen
- Changed viewBox to `"0 0 420 90"` to properly frame the content
- Used simple `scale(0.38)` applied to parent group
- Removed nested transforms on individual paths
- Set default height to `32px` (was temporarily 40px)

## Files Modified

1. `/src/components/auth/OrganizationSwitcherCustom.jsx`
   - Reverted all sizing changes
   - Restored to original working state

2. `/src/components/Logo.jsx`
   - Fixed LogoTitle component SVG transforms
   - Corrected viewBox dimensions
   - Simplified scaling approach

## Expected Result

- ✅ Organization switcher looks clean and properly sized (like original)
- ✅ Logo icon visible at 28px in org switcher
- ✅ Logo text ("FUNC") visible next to icon
- ✅ Text not cut off or positioned outside viewBox
- ✅ All components properly scaled and aligned

## Technical Details

### Why the Original Approach Failed
1. Increasing container sizes didn't help because the SVG content itself was improperly positioned
2. The `translate(-70, -200)` transform was moving content 70px left and 200px up from origin
3. Combined with scaling and viewBox mismatch, text rendered outside visible area

### The Correct Approach
1. Keep container sizes at reasonable defaults (28px for org switcher)
2. Fix the SVG artwork itself to render properly at those sizes
3. Use simple transforms (just scale) from origin
4. Match viewBox dimensions to actual content bounds
5. Let the SVG scale naturally with the height prop

## Testing
Check in browser:
- Organization switcher should show logo icon and text clearly
- Both icon and text should be visible at normal sizes
- No console errors
- Text should be sharp and properly scaled
