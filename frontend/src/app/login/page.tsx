"use client"

import { useState } from 'react';
import Image from 'next/image';
import Icon from '../../assets/linkvault-icon.svg';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function Login() {
    const [formData, setFormData] = useState({
        usernameOrEmail: '',
        password: ''
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
        try {
            const response = await fetch('http://localhost:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            if (response.ok) {
                const data = await response.json();
                // Store the token in localStorage and cookies
                localStorage.setItem('token', data.token);
                document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
                // Show success toast
                toast.success('Login successful!');
                // Redirect to the home page after 2 seconds
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                const errorData = await response.json();
                // Handle login error
                toast.error('Login failed!');
                console.error('Login failed:', errorData.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className='md:pt-12 pt-8'>
            <div className="bg-light dark:bg-dark rounded-3xl p-8 w-[90%] sm:w-[80%] md:w-[400px] mx-auto">
                <div className="flex justify-center mb-6">
                    <Image src={Icon} alt="LinkVault" width={50} height={50} className="rounded-md"/>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usernameOrEmail" className="block mb-2">Username or Email</label>
                        <input
                            type="text"
                            id="usernameOrEmail"
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            className="w-full p-2 rounded-md bg-lessLight dark:bg-lessDark"
                            required
                        />
                    </div>
                    <div className="mb-6">
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
                    <button type="submit" className="w-full bg-orange text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                        Log In
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Don&apos;t have an account? <a href="/register" className="text-orange hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;