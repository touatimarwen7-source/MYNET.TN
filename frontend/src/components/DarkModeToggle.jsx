import { useContext } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="btn-dark-mode"
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}
