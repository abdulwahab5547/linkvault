"use client"

import { useState } from 'react';
import Image from 'next/image';
import Icon from '../../assets/linkvault-icon.svg';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });
            
            if (response.ok) {
                toast.success('Registration successful!');
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.error('Registration error:', error);
        }
    };

    return (
        <div className='md:pt-12 pt-8'>
            <div className="bg-light dark:bg-dark rounded-3xl p-8 w-[90%] sm:w-[80%] md:w-[400px] mx-auto">
            <div className="flex justify-center mb-6">
                <Image src={Icon} alt="LinkVault" width={50} height={50} className="rounded-md"/>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block mb-2">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block mb-2">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-orange text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                    Sign Up
                </button>
            </form>
            <p className="mt-4 text-center">
                Already have an account? <a href="/login" className="text-orange hover:underline">Log in</a>
            </p>
        </div>
        </div>
    );
}

export default Register;