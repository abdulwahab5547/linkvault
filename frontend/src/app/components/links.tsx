import React, { useState, useEffect } from 'react'
import Below from '../../assets/text-below.svg'
import Image from 'next/image'
import LinkSection from './linksection'
import { toast } from 'react-hot-toast'

interface Link {
    _id: string;
    url: string;
    title: string;
}

interface Section {
    _id: string;
    name: string;
    links: Link[];
}

const Links: React.FC = () => {
    const [linkSections, setLinkSections] = useState<Section[]>([]);
    const [newSectionName, setNewSectionName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchSectionsAndLinks();
    }, []);

    const fetchSectionsAndLinks = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sections`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sections and links');
            }

            const data = await response.json();
            setLinkSections(data.sections);
        } catch (error) {
            console.error('Error fetching sections and links:', error);
            toast.error('Failed to load sections and links');
        } finally {
            setIsLoading(false);
        }
    };

    const addLinkSection = async (): Promise<void> => {
        if (!newSectionName.trim()) {
            toast.error('Please enter a name for the new section');
            return;
        }

        // Optimistically update the frontend
        const tempId = Date.now().toString(); // Temporary ID for the new section
        const newSection: Section = {
            _id: tempId,
            name: newSectionName,
            links: []
        };
        setLinkSections(prevSections => [...prevSections, newSection]);
        setNewSectionName('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-section`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ name: newSectionName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add new link section');
            }

            const data = await response.json();
            // Update the frontend with the actual ID from the backend
            setLinkSections(prevSections => 
                prevSections.map(section => 
                    section._id === tempId ? { ...section, _id: data.section._id } : section
                )
            );
            toast.success('Section added');
        } catch (error) {
            console.error('Failed to add new link section:', error);
            // Revert the frontend changes if the backend request fails
            setLinkSections(prevSections => prevSections.filter(section => section._id !== tempId));
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    const LinkSectionSkeleton = () => (
        <div className="bg-lessLight dark:bg-lessDark rounded-3xl p-5 w-full md:w-[48%] animate-pulse">
            <div className="h-6 bg-light dark:bg-dark rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-4 bg-light dark:bg-dark rounded w-full"></div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-light dark:bg-dark rounded-3xl p-5 w-full">
            <div>
                <div className="flex justify-between flex-col gap-7 md:gap-0 md:flex-row items-center mb-2">
                    <div className=''>
                        <p className="font-bold text-xl">Links</p>
                        <Image src={Below} alt="TextBelow" width={80}/>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-4 justify-center">
                        <input
                            type="text"
                            value={newSectionName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSectionName(e.target.value)}
                            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addLinkSection();
                                }
                            }}
                            placeholder="New section name"
                            className="mr-2 w-32 md:w-auto px-3 py-2 bg-lessLight dark:bg-lessDark rounded-full focus:outline-none focus:ring-2 focus:ring-orange"
                        />
                        <button 
                            onClick={addLinkSection}
                            className="bg-orange text-white px-4 py-2 rounded-full hover:bg-opacity-80 transition-colors"
                        >
                            Add Section
                        </button>
                    </div>
                </div>
                
                <div className='py-3 pt-5'>
                    {isLoading ? (
                        <div className='flex flex-col md:flex-row gap-4 py-2'>
                            <LinkSectionSkeleton />
                            <LinkSectionSkeleton />
                        </div>
                    ) : (
                        linkSections.reduce((rows: JSX.Element[], section: Section, index: number) => {
                            if (index % 2 === 0) {
                                rows.push(
                                    <div key={`row-${index}`} className='flex flex-col md:flex-row gap-4 py-2'>
                                        <LinkSection 
                                            key={`${section._id}-main`} 
                                            section={section} 
                                            onSectionDeleted={fetchSectionsAndLinks} 
                                        />
                                        {linkSections[index + 1] && (
                                            <LinkSection 
                                                key={`${linkSections[index + 1]._id}-pair`} 
                                                section={linkSections[index + 1]} 
                                                onSectionDeleted={fetchSectionsAndLinks} 
                                            />
                                        )}
                                    </div>
                                );
                            }
                            return rows;
                        }, [])
                    )}
                </div>
            </div>
        </div>
    )
}

export default Links;