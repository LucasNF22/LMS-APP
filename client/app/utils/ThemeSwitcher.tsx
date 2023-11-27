'use client'

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { BiMoon, BiSun } from 'react-icons/bi';

export const ThemeSwitcher = () => {
    const [monuted, setMonuted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect( () => setMonuted(true), [] );

    
}