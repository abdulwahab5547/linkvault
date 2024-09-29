"use client"

import Image from 'next/image'
import Icon from '../../../assets/linkvault-icon.svg'
import { useState, useEffect } from 'react'
import SearchOverlay from '../searchoverlay'

function Navbar(){
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleSearchClick = () => {
        setIsSearchOpen(true);
    };

    return(
        <div className="py-3">
            <div className="flex justify-between items-stretch gap-3 md:gap-5 h-14">
                <div className="flex rounded-3xl bg-light dark:bg-dark p-2 px-3 md:px-8 items-center justify-center cursor-pointer">
                    <Image src={Icon} alt="LinkVault" width={30} height={30} className="w-8 h-8 md:w-[30px] md:h-[30px] md:mr-2 rounded-full"/>
                    <p className="font-bold text-lg hidden md:block">LinkVault</p>
                </div>
                <div className="rounded-3xl bg-light dark:bg-dark p-2 px-5 w-full flex justify-center items-center">
                    <ul className="flex gap-5 md:gap-12 items-center">
                        <li className="cursor-pointer">
                            <a href="/">
                                <p className='text-sm md:text-base flex'>
                                    <span className="pr-2"><i className="fa-solid fa-house"></i></span><span className='hidden md:block'>Home</span>
                                </p>
                            </a>
                        </li>
                        <li className="cursor-pointer">
                            <a href="/settings">
                                <p className='text-sm md:text-base flex'>
                                    <span className="pr-2"><i className="fa-solid fa-gear"></i></span><span className='hidden md:block'>Settings</span>
                                </p>
                            </a>
                        </li>
                        <li onClick={handleSearchClick} className="cursor-pointer md:hidden">
                            <i className="fa-solid fa-search text-sm md:text-base"></i>
                        </li>
                    </ul>
                </div>
                <div className="hidden md:flex rounded-3xl bg-light dark:bg-dark px-6 items-center gap-5">
                    <div className='bg-lessLight dark:bg-lessDark rounded-3xl px-4'>
                        <input
                            placeholder='Search...'
                            className='bg-inherit focus:outline-none cursor-pointer h-9'
                            onClick={handleSearchClick}
                            readOnly
                        />
                    </div>
                </div>
                <div className="rounded-3xl bg-light dark:bg-dark p-2 px-5 flex items-center gap-5 min-28">

                    <div 
                        className="cursor-pointer bg-lessLight dark:bg-lessDark rounded-full"
                        onClick={toggleTheme}
                    >
                        <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'} text-sm md:text-base p-2`}></i>
                    </div>
                </div>
            </div>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    )
}

export default Navbar;