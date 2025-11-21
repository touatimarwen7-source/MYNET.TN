import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { DarkModeContext } from '../contexts/DarkModeContext';
import '../styles/languageSwitcher.css';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    document.documentElement.dir = 'ltr';
  };

  return (
    <div className="language-switcher">
      <button className="btn-language-toggle" title="Change language">
        🌐
      </button>
      <div className="language-menu">
        {languages.map(lang => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
            title={lang.name}
          >
            <span className="flag">{lang.flag}</span>
            <span className="name">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
