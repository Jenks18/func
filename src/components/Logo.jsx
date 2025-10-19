/**
 * Company Logo Components
 * 
 * INSTRUCTIONS TO ADD YOUR SVG:
 * 1. Open your SVG file in a text editor
 * 2. Copy the <path> or <g> elements 
 * 3. Paste them into the components below
 * 4. Adjust viewBox to match your SVG's viewBox
 */

import React from 'react';

/**
 * Logo Icon (Square/Circle mark)
 * Use this for: Favicons, sidebar collapsed state, small spaces
 * ENHANCED - Larger, clearer strokes for better visibility
 */
// Building icon from your actual SVG design (Untitled design (4).svg)
// Using original colors: #0B9C88 (main teal), #F7F9F9 (white/windows)
// Exact SVG from attachment for the building icon (large, matches provided PNG)
export const LogoIcon = ({ size = 120, className = '' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%', 
    marginTop: '24px', 
    marginBottom: '8px' 
  }}>
    <img
      src="/Untitled%20design%20(5).png"
      alt="GHOROFA Logo Icon"
      className={className}
      style={{ 
        display: 'block', 
        width: `${size}px`,
        height: 'auto',
        objectFit: 'contain'
      }}
    />
  </div>
);

/**
 * Logo Title (Wordmark/Text)
 * Use this for: Next to icon, full header logos
 * GHOROFA - Simple text approach for maximum visibility
 */
// Professional GHOROFA text
// Exact SVG from attachment for the GHOROFA text (large, matches provided PNG)
export const LogoTitle = ({ height = 80, className = '' }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: '24px' 
  }}>
    <img
      src="/Untitled%20design%20(4).png"
      alt="GHOROFA Logo Text"
      className={className}
      style={{ 
        display: 'block', 
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain'
      }}
    />
  </div>
);
  // Removed stray closing parenthesis

/**
 * Combined Logo (Icon + Title)
 * Use this for: Main headers, login pages, large spaces
 */
export const LogoCombined = ({ 
  iconSize = 48,  // Larger default
  titleHeight = 40,  // Larger default to match new LogoTitle
  iconColor = '#14b8a6',
  titleColor = '#134e4a',
  gap = 16,  // More generous gap
  className = '' 
}) => (
  <div 
    style={{ 
      display: 'flex', 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      gap: '32px',
      padding: '0',
      margin: '0',
    }}
    className={className}
  >
    <LogoIcon size={iconSize} color={iconColor} />
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <LogoTitle height={Math.max(titleHeight, 220)} color={titleColor} />
    </div>
  </div>
);

/**
 * Logo for Organization Switcher
 * Optimized for button display - ENLARGED
 */
export const LogoOrgSwitcher = ({ 
  size = 40,  // Increased from 28
  color = '#14b8a6' 
}) => (
  <LogoIcon size={size} color={color} />
);

/**
 * Logo for Sidebar (Collapsed)
 * Shows only icon when sidebar is collapsed - ENLARGED
 */
export const LogoSidebarCollapsed = ({ 
  size = 48,  // Appropriate size for collapsed state
  color = 'white' 
}) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '8px 0' }}>
    <img
      src="/Untitled%20design%20(5).png"
      alt="GHOROFA Logo"
      style={{ 
        display: 'block', 
        width: `${size}px`,
        height: 'auto',
        objectFit: 'contain'
      }}
    />
  </div>
);

/**
 * Logo for Sidebar (Expanded)
 * Shows icon + title when sidebar is expanded - VERTICAL STACKED
 */
export const LogoSidebarExpanded = ({ 
  iconSize = 60,  // Good size for expanded sidebar
  titleHeight = 50,  // Good size for text
  iconColor = 'white',
  titleColor = 'white',
  gap = 8  // Vertical gap between icon and text
}) => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',  // Vertical stacking
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: `${gap}px`,
    padding: '8px 0'
  }}>
    <img
      src="/Untitled%20design%20(5).png"
      alt="GHOROFA Logo Icon"
      style={{ 
        display: 'block', 
        width: `${iconSize}px`,
        height: 'auto',
        objectFit: 'contain'
      }}
    />
    <img
      src="/Untitled%20design%20(4).png"
      alt="GHOROFA"
      style={{ 
        display: 'block', 
        height: `${titleHeight}px`,
        width: 'auto',
        objectFit: 'contain'
      }}
    />
  </div>
);

export default {
  Icon: LogoIcon,
  Title: LogoTitle,
  Combined: LogoCombined,
  OrgSwitcher: LogoOrgSwitcher,
  SidebarCollapsed: LogoSidebarCollapsed,
  SidebarExpanded: LogoSidebarExpanded,
};
