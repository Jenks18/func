/**
 * Theme Configuration
 * 
 * Choose between different gradient themes:
 * - TEAL: Modern teal/cyan (Recommended - unique and professional)
 * - PURPLE: Vibrant purple/violet (Creative and bold)
 * - EMERALD: Green/emerald (Fresh and growth-focused)
 * - ROSE: Pink/rose (Elegant and modern)
 */

// Active theme - change this to switch themes instantly
export const ACTIVE_THEME = 'TEAL'; // Options: 'TEAL', 'PURPLE', 'EMERALD', 'ROSE', 'BLUE'

export const THEMES = {
  // Modern Teal/Cyan Theme (Recommended - unique from Innago)
  TEAL: {
    name: 'Teal',
    colors: {
      // Primary gradient colors
      gradient: {
        light: '#f0fdfa',      // teal-50
        medium: '#ccfbf1',     // teal-100
        mediumDark: '#99f6e4', // teal-200
        dark: '#5eead4',       // teal-300
        darker: '#2dd4bf',     // teal-400
        primary: '#14b8a6',    // teal-500
        primaryDark: '#0d9488', // teal-600
      },
      // Text colors
      text: {
        primary: '#134e4a',    // teal-900
        secondary: '#0f766e',  // teal-700
        light: '#14b8a6',      // teal-500
      },
      // Border colors
      border: {
        light: '#99f6e4',      // teal-200
        medium: '#5eead4',     // teal-300
        dark: '#2dd4bf',       // teal-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
      cardLight: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)',
      button: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
      buttonDark: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      navbar: 'linear-gradient(90deg, rgba(240, 253, 250, 0.98) 0%, rgba(204, 251, 241, 0.98) 100%)',
    }
  },

  // Vibrant Purple/Violet Theme
  PURPLE: {
    name: 'Purple',
    colors: {
      gradient: {
        light: '#faf5ff',      // purple-50
        medium: '#f3e8ff',     // purple-100
        mediumDark: '#e9d5ff', // purple-200
        dark: '#d8b4fe',       // purple-300
        darker: '#c084fc',     // purple-400
        primary: '#a855f7',    // purple-500
        primaryDark: '#9333ea', // purple-600
      },
      text: {
        primary: '#581c87',    // purple-900
        secondary: '#7e22ce',  // purple-700
        light: '#a855f7',      // purple-500
      },
      border: {
        light: '#e9d5ff',      // purple-200
        medium: '#d8b4fe',     // purple-300
        dark: '#c084fc',       // purple-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
      cardLight: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
      button: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
      buttonDark: 'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
      navbar: 'linear-gradient(90deg, rgba(250, 245, 255, 0.98) 0%, rgba(243, 232, 255, 0.98) 100%)',
    }
  },

  // Fresh Emerald/Green Theme
  EMERALD: {
    name: 'Emerald',
    colors: {
      gradient: {
        light: '#ecfdf5',      // emerald-50
        medium: '#d1fae5',     // emerald-100
        mediumDark: '#a7f3d0', // emerald-200
        dark: '#6ee7b7',       // emerald-300
        darker: '#34d399',     // emerald-400
        primary: '#10b981',    // emerald-500
        primaryDark: '#059669', // emerald-600
      },
      text: {
        primary: '#064e3b',    // emerald-900
        secondary: '#047857',  // emerald-700
        light: '#10b981',      // emerald-500
      },
      border: {
        light: '#a7f3d0',      // emerald-200
        medium: '#6ee7b7',     // emerald-300
        dark: '#34d399',       // emerald-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
      cardLight: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
      button: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      buttonDark: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      navbar: 'linear-gradient(90deg, rgba(236, 253, 245, 0.98) 0%, rgba(209, 250, 229, 0.98) 100%)',
    }
  },

  // Elegant Rose/Pink Theme
  ROSE: {
    name: 'Rose',
    colors: {
      gradient: {
        light: '#fff1f2',      // rose-50
        medium: '#ffe4e6',     // rose-100
        mediumDark: '#fecdd3', // rose-200
        dark: '#fda4af',       // rose-300
        darker: '#fb7185',     // rose-400
        primary: '#f43f5e',    // rose-500
        primaryDark: '#e11d48', // rose-600
      },
      text: {
        primary: '#881337',    // rose-900
        secondary: '#be123c',  // rose-700
        light: '#f43f5e',      // rose-500
      },
      border: {
        light: '#fecdd3',      // rose-200
        medium: '#fda4af',     // rose-300
        dark: '#fb7185',       // rose-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
      cardLight: 'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
      button: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
      buttonDark: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
      navbar: 'linear-gradient(90deg, rgba(255, 241, 242, 0.98) 0%, rgba(255, 228, 230, 0.98) 100%)',
    }
  },

  // Original Blue Theme (keeping for reference)
  BLUE: {
    name: 'Blue',
    colors: {
      gradient: {
        light: '#f0f9ff',      // blue-50
        medium: '#e0f2fe',     // blue-100
        mediumDark: '#bae6fd', // blue-200
        dark: '#93c5fd',       // blue-300
        darker: '#60a5fa',     // blue-400
        primary: '#3b82f6',    // blue-500
        primaryDark: '#2563eb', // blue-600
      },
      text: {
        primary: '#1e40af',    // blue-800
        secondary: '#1d4ed8',  // blue-700
        light: '#60a5fa',      // blue-400
      },
      border: {
        light: '#bfdbfe',      // blue-200
        medium: '#93c5fd',     // blue-300
        dark: '#60a5fa',       // blue-400
      }
    },
    gradients: {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      card: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
      cardLight: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      button: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      buttonDark: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      navbar: 'linear-gradient(90deg, rgba(240, 249, 255, 0.98) 0%, rgba(224, 242, 254, 0.98) 100%)',
    }
  }
};

// Get the active theme
export const theme = THEMES[ACTIVE_THEME];

// Helper function to get theme values
export const getTheme = () => theme;

// Export individual gradients for easy access
export const {
  background: GRADIENT_BACKGROUND,
  card: GRADIENT_CARD,
  cardLight: GRADIENT_CARD_LIGHT,
  button: GRADIENT_BUTTON,
  buttonDark: GRADIENT_BUTTON_DARK,
  navbar: GRADIENT_NAVBAR,
} = theme.gradients;

// Export individual colors for easy access
export const {
  primary: PRIMARY_COLOR,
  primaryDark: PRIMARY_DARK_COLOR,
  light: LIGHT_COLOR,
  medium: MEDIUM_COLOR,
  mediumDark: MEDIUM_DARK_COLOR,
  dark: DARK_COLOR,
  darker: DARKER_COLOR,
} = theme.colors.gradient;

export const {
  primary: TEXT_PRIMARY,
  secondary: TEXT_SECONDARY,
  light: TEXT_LIGHT,
} = theme.colors.text;

export const {
  light: BORDER_LIGHT,
  medium: BORDER_MEDIUM,
  dark: BORDER_DARK,
} = theme.colors.border;
