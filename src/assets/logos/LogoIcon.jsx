/**
 * Logo Icon Component (Left piece)
 * Adapted to teal theme
 */

export const LogoIcon = ({ size = 24, color = '#14b8a6' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Placeholder - will be replaced with actual SVG path from your file */}
    <rect width="100" height="100" rx="20" fill={color} />
    <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="white" opacity="0.9" />
    <circle cx="50" cy="50" r="8" fill="white" />
  </svg>
);

export default LogoIcon;
