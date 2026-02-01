import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import './liquid-glass-toggle.css';

type Theme = 'light' | 'dark' | 'dim';

const themes: { value: Theme; option: string }[] = [
  { value: 'light', option: '1' },
  { value: 'dark', option: '2' },
  { value: 'dim', option: '3' },
];

export function LiquidGlassToggle() {
  const { theme, setTheme } = useTheme();
  const switcherRef = useRef<HTMLFieldSetElement>(null);
  const previousRef = useRef<string>(themes.find(t => t.value === theme)?.option || '1');

  useEffect(() => {
    if (switcherRef.current) {
      switcherRef.current.setAttribute('c-previous', previousRef.current);
    }
  }, []);

  const handleChange = (newTheme: Theme, option: string) => {
    if (switcherRef.current) {
      switcherRef.current.setAttribute('c-previous', previousRef.current);
    }
    previousRef.current = option;
    setTheme(newTheme);
  };

  return (
    <>
      <svg className="switcher__filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="switcher">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
          </filter>
        </defs>
      </svg>
      
      <fieldset 
        ref={switcherRef}
        className="switcher" 
        c-previous={previousRef.current}
      >
        <legend className="switcher__legend">Theme switcher</legend>
        
        {themes.map((item) => (
          <label key={item.value} className="switcher__option">
            <input
              className="switcher__input"
              type="radio"
              name="theme"
              value={item.value}
              c-option={item.option}
              checked={theme === item.value}
              onChange={() => handleChange(item.value, item.option)}
            />
            <svg 
              className="switcher__icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--c)" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {item.value === 'light' && (
                <>
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2"/>
                  <path d="M12 20v2"/>
                  <path d="m4.93 4.93 1.41 1.41"/>
                  <path d="m17.66 17.66 1.41 1.41"/>
                  <path d="M2 12h2"/>
                  <path d="M20 12h2"/>
                  <path d="m6.34 17.66-1.41 1.41"/>
                  <path d="m19.07 4.93-1.41 1.41"/>
                </>
              )}
              {item.value === 'dark' && (
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              )}
              {item.value === 'dim' && (
                <>
                  <rect width="20" height="14" x="2" y="3" rx="2"/>
                  <line x1="8" x2="16" y1="21" y2="21"/>
                  <line x1="12" x2="12" y1="17" y2="21"/>
                </>
              )}
            </svg>
          </label>
        ))}
      </fieldset>
    </>
  );
}
