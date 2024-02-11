import React, { useEffect, useState } from 'react';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.className = savedTheme;
        } else {
            localStorage.setItem('theme', 'light');
            document.documentElement.className = 'light';
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);

        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme;
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