import Link from 'next/link';
import Image from 'next/image';

import Features from '../../assets/linkvault-features.jpg'

function Start() {
    return (
        <div className="min-h-screen bg-lessLight dark:bg-lessDark text-gray-800 dark:text-gray-200">
            <header className="bg-light dark:bg-dark py-6">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-orange">LinkVault</h1>
                    <nav>
                        <Link href="/login" className="mr-6 hover:text-orange text-lg">Login</Link>
                        <Link href="/register" className="bg-orange text-white px-6 py-3 rounded-full hover:bg-opacity-80 text-lg">Sign Up</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16">
                <section className="text-center mb-20">
                    <h2 className="text-5xl font-bold mb-6">Organize Your Links with Ease</h2>
                    <p className="text-2xl mb-10 max-w-3xl mx-auto">LinkVault is the ultimate solution for keeping all your important links in one place. Say goodbye to scattered bookmarks and hello to organized, accessible link management.</p>
                    <Link href="/register" className="bg-orange text-white px-8 py-4 rounded-full text-xl hover:bg-opacity-80 transition duration-300">Get Started for Free</Link>
                </section>

                <section className="grid md:grid-cols-3 gap-12 mb-20">
                    <div className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg">
                        <i className="fas fa-briefcase text-4xl text-orange mb-4"></i>
                        <h3 className="text-2xl font-semibold mb-4">Portfolio Links</h3>
                        <p className="text-lg">Showcase your professional work samples and achievements in one easily accessible location. Perfect for freelancers and job seekers.</p>
                    </div>
                    <div className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg">
                        <i className="fas fa-project-diagram text-4xl text-orange mb-4"></i>
                        <h3 className="text-2xl font-semibold mb-4">Project Links</h3>
                        <p className="text-lg">Organize links to your ongoing projects, resources, and collaborations effortlessly. Boost your productivity and keep everything in order.</p>
                    </div>
                    <div className="bg-light dark:bg-dark p-8 rounded-lg shadow-lg">
                        <i className="fas fa-share-alt text-4xl text-orange mb-4"></i>
                        <h3 className="text-2xl font-semibold mb-4">Quick Sharing</h3>
                        <p className="text-lg">Share your curated link collections with others instantly. No more digging through old chats or emails to find that important link.</p>
                    </div>
                </section>

                <section className="flex flex-col md:flex-row items-center justify-between mb-20">
                    <div className="md:w-1/2 mb-10 md:mb-0">
                        <h2 className="text-4xl font-bold mb-6">Powerful Features</h2>
                        <ul className="text-xl space-y-4">
                            <li><i className="fas fa-check text-orange mr-2"></i> Customizable categories</li>
                            <li><i className="fas fa-check text-orange mr-2"></i> Search functionality</li>
                            <li><i className="fas fa-check text-orange mr-2"></i> Tag system for easy organization</li>
                            <li><i className="fas fa-check text-orange mr-2"></i> Cloud sync across devices</li>
                            <li><i className="fas fa-check text-orange mr-2"></i> Dark mode support</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <Image src={Features} alt="LinkVault Features" width={600} height={400} className="rounded-lg shadow-lg" />
                    </div>
                </section>

                <section className="text-center mb-20">
                    <h2 className="text-4xl font-bold mb-6">Say Goodbye to Lost Links</h2>
                    <p className="text-2xl mb-10 max-w-3xl mx-auto">No more searching through old WhatsApp chats, emails, or disorganized bookmarks. LinkVault keeps everything organized and at your fingertips, saving you time and frustration.</p>
                    <Link href="/register" className="bg-orange text-white px-8 py-4 rounded-full text-xl hover:bg-opacity-80 transition duration-300">Join LinkVault Today</Link>
                </section>

                <section className="bg-light dark:bg-dark p-12 rounded-lg shadow-lg mb-20">
                    <h2 className="text-3xl font-bold mb-6 text-center">What Our Users Say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <p className="text-lg mb-4">&quot;LinkVault has revolutionized how I manage my online resources. It&apos;s a game-changer!&quot;</p>
                            <p className="font-semibold">- Hanzala Tahir</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg mb-4">&quot;I can&apos;t imagine going back to my old way of saving links. LinkVault is simply indispensable.&quot;</p>
                            <p className="font-semibold">- Hamza Abdul Rauf</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg mb-4">&quot;The ability to share collections of links has made collaboration with my team so much easier.&quot;</p>
                            <p className="font-semibold">- Tom Cruise</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-light dark:bg-dark py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between">
                        <div className="w-full md:w-1/2 mb-6 md:mb-0 flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-4">LinkVault</h3>
                            <p className='text-center'>Organizing your digital world, one link at a time.</p>
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col items-center">
                            <h3 className="text-xl font-semibold mb-4">Connect With Creator</h3>
                            <div className="flex space-x-4">
                                <a href="https://www.instagram.com/abdulwahabshere/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-orange transition duration-300"><i className="fab fa-instagram"></i></a>
                                <a href="https://www.linkedin.com/in/aw-asif/" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-orange transition duration-300"><i className="fab fa-linkedin"></i></a>
                                <a href="https://github.com/abdulwahabshere" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-orange transition duration-300"><i className="fab fa-github"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-700 text-center">
                        <p>&copy; {new Date().getFullYear()} LinkVault. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Start;