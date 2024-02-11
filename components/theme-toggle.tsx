import React, { useState, useEffect } from 'react';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.className = theme;
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return (
        <button onClick={toggleTheme} className="button-color relative flex items-center justify-between w-16 rounded-full p-1 overflow-hidden">
            <Brightness7Icon style={{ position: 'absolute', right: '5px', color: 'var(--header-background)' }} />
            <Brightness4Icon style={{ position: 'absolute', left: '5px', color: 'var(--header-background)' }} />
            <span className={`block w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-[calc(100%+8px)]' : ''}`} style={{ backgroundColor: 'var(--header-background)' }}></span>
        </button>
    );
}

export default ThemeToggle;