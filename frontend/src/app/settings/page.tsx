"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar/page';
import { toast } from 'react-hot-toast';

function Settings() {
    const router = useRouter();
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        fetchProfileInfo();
    }, [theme]);

    const fetchProfileInfo = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile information');
            }

            const data = await response.json();
            setFormData(prevState => ({
                ...prevState,
                email: data.email,
                username: data.username
            }));
        } catch (error) {
            console.error('Error fetching profile information:', error);
            toast.error('Failed to load profile information');
        }
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear the error when user starts typing
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        }

        if (!formData.username) {
            newErrors.username = 'Username is required';
            isValid = false;
        }

        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const dataToSend = {
                email: formData.email,
                username: formData.username,
                ...(formData.newPassword && { password: formData.newPassword })
            };

            const response = await fetch('http://localhost:8000/api/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to update account information');
            }

            const data = await response.json();
            toast.success('Account information updated successfully');
            console.log('Account updated:', data);

            // Reset password fields
            setFormData(prevState => ({
                ...prevState,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }));
        } catch (error) {
            console.error('Error updating account:', error);
            toast.error('Failed to update account information');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        router.push('/login');
    };

    return (
        <div className="max-w-[1450px] m-auto px-0 md:px-8 pb-5">
            <div className='px-4 md:px-0'>
                <Navbar />
            </div>
            
            <div className='flex-col md:flex-row flex gap-6'>
                <div className='bg-light dark:bg-dark rounded-3xl p-8 mt-3 md:w-[33%] m-auto'>
                    <div className="">
                        <h2 className="text-xl font-semibold mb-3">Theme Preference</h2>
                        <select 
                            value={theme} 
                            onChange={handleThemeChange}
                            className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
                <div className="bg-light dark:bg-dark rounded-3xl p-8 mt-3 md:w-[34%] m-auto">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-xl font-semibold mb-3">Account Settings</h2>
                        
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        <h3 className="text-lg font-semibold mb-3 mt-6">Change Password</h3>
                        
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block mb-2">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block mb-2">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmNewPassword" className="block mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmNewPassword"
                                name="confirmNewPassword"
                                value={formData.confirmNewPassword}
                                onChange={handleInputChange}
                                className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            />
                            {errors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>}
                        </div>

                        <button type="submit" className="bg-orange text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
                            Save Changes
                        </button>
                    </form>
                </div>
                <div className='bg-light dark:bg-dark rounded-3xl p-8 mt-3 md:w-[33%] m-auto'>
                    <div className="">
                        <div className='cursor-pointer' onClick={handleLogout}>
                            Log out
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;