/**
 * Logo Title Component (Text/wordmark piece)
 * Adapted to teal theme
 */

export const LogoTitle = ({ height = 24, color = '#134e4a' }) => (
  <svg 
    height={height} 
    viewBox="0 0 200 50" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 'auto' }}
  >
    {/* Placeholder - will be replaced with actual SVG path from your file */}
    <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="700" fill={color}>
      FUNC
    </text>
  </svg>
);

export default LogoTitle;
