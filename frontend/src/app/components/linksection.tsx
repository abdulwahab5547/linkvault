import React, { useState, useRef, useEffect, useCallback } from 'react';
import LinkPart from './linkpart';
import SectionTooltip from './sectiontooltip';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

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

interface LinkSectionProps {
    section: Section;
    onSectionDeleted: () => void;
}

const LinkSection: React.FC<LinkSectionProps> = ({ section, onSectionDeleted }) => {
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        const savedState = localStorage.getItem(`section_${section._id}_isOpen`);
        return savedState ? JSON.parse(savedState) : false;
    });
    const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
        const savedViewMode = localStorage.getItem(`section_${section._id}_viewMode`);
        return savedViewMode === 'grid' ? 'grid' : 'list';
    });
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [links, setLinks] = useState<Link[]>(section.links);
    const [isAddingLink, setIsAddingLink] = useState<boolean>(false);
    const [newLinkTitle, setNewLinkTitle] = useState<string>('');
    const [newLinkUrl, setNewLinkUrl] = useState<string>('');
    const [sectionName, setSectionName] = useState<string>(section.name);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [isOpen, links, isAddingLink, viewMode]);

    useEffect(() => {
        localStorage.setItem(`section_${section._id}_isOpen`, JSON.stringify(isOpen));
    }, [isOpen, section._id]);

    useEffect(() => {
        localStorage.setItem(`section_${section._id}_viewMode`, viewMode);
    }, [viewMode, section._id]);

    const toggleOpen = (): void => {
        setIsOpen(!isOpen);
    };

    const handleAddLink = (): void => {
        setIsAddingLink(true);
    };

    const saveNewLinkToBackend = async (title: string, url: string): Promise<Link | null> => {
        if (!title.trim() || !url.trim()) {
            toast.error('Both title and URL are required');
            return null;
        }

        // Create a temporary link with a temporary ID
        const tempLink: Link = {
            _id: `temp_${Date.now()}`,
            title: title.trim(),
            url: url.trim()
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/add-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    sectionId: section._id,
                    title: title.trim(),
                    url: url.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to add new link');
                return null;
            }

            return data.link;
        } catch (error) {
            console.error('Error saving new link:', error);
            toast.error('An unexpected error occurred. Please try again.');
            return null;
        }
    };

    const handleSaveNewLink = async (): Promise<void> => {
        if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
            toast.error('Both title and URL are required');
            return;
        }

        const savedLink = await saveNewLinkToBackend(newLinkTitle, newLinkUrl);
        if (savedLink) {
            setLinks(prevLinks => [...prevLinks, savedLink]);
            setIsAddingLink(false);
            setNewLinkTitle('');
            setNewLinkUrl('');
        }
    };

    const handleDeleteLink = (id: string) => {
        setLinks(prevLinks => prevLinks.filter(link => link._id !== id));
    };

    const debouncedSaveSectionName = useCallback(
        (newName: string) => {
            // Optimistically update the frontend
            setSectionName(newName);

            const saveSectionName = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-section/${section._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ name: newName })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update section name');
                    }

                } catch (error) {
                    console.error('Error updating section name:', error);
                    // Revert the optimistic update if there's an error
                    setSectionName(section.name);
                    toast.error('Failed to update section name. Please try again.');
                }
            };

            debounce(saveSectionName, 500)();
        },
        [section._id, section.name]
    );

    const handleSectionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setSectionName(newName);
        debouncedSaveSectionName(newName);
    };

    if (!section || typeof section !== 'object') {
        return <div>Error: Invalid section data</div>;
    }

    return (
        <div className='w-[100%] md:w-[50%]'>
            <div className='bg-lessLight dark:bg-lessDark rounded-3xl p-5 border-2 dark:border-cardborder border-lightcardborder'>
                <div className='flex flex-col'>
                    <div className='flex flex-row justify-between items-center'>
                        <input
                            type="text"
                            value={sectionName}
                            onChange={handleSectionNameChange}
                            className="bg-transparent outline-none focus:outline-none md:w-auto w-32 truncate"
                            placeholder="Untitled Section"
                            style={{ maxWidth: '100%' }}
                        />
                        <div 
                            className='cursor-pointer rounded-full bg-light dark:bg-dark w-8 h-8 flex items-center justify-center'
                            onClick={toggleOpen}
                        >
                            <i className={`fa-solid ${isOpen ? 'fa-arrow-up' : 'fa-arrow-down'} text-base transition-transform duration-300`}></i>
                        </div>
                    </div>
                    {isOpen && (
                        <div className='flex flex-row justify-end items-center gap-3 mt-2'>
                            <SectionTooltip
                                sectionId={section._id}
                                onDelete={() => onSectionDeleted()}
                                onSectionDeleted={onSectionDeleted}
                            />
                            <div className='bg-light dark:bg-dark w-16 h-8 rounded-full flex items-center justify-center'>
                                <div className='flex gap-3'>
                                    <i 
                                        className={`fa-solid fa-bars text-sm cursor-pointer ${viewMode === 'grid' ? 'text-orange' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                    ></i>
                                    <i 
                                        className={`fa-solid fa-list text-sm cursor-pointer ${viewMode === 'list' ? 'text-orange' : ''}`}
                                        onClick={() => setViewMode('list')}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div 
                    ref={contentRef}
                    className={`overflow-hidden transition-all duration-500 ease-in-out`}
                    style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
                >
                    <div className={`py-1 pt-3 ${viewMode === 'grid' ? 'flex flex-wrap gap-4' : ''}`}>
                        {links.map((link: Link) => (
                            <div key={link._id} className={viewMode === 'grid' ? 'w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-1rem)]' : 'w-full'}>
                                <LinkPart link={link} onDelete={handleDeleteLink} view={viewMode}/>
                            </div>
                        ))}
                        {isAddingLink && (
                            <div className={`py-1 ${viewMode === 'grid' ? 'w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-1rem)]' : 'w-full'}`}>
                                <div className='bg-light dark:bg-dark rounded-3xl py-3 px-4 flex flex-col'>
                                    <input
                                        type="text"
                                        value={newLinkTitle}
                                        onChange={(e) => setNewLinkTitle(e.target.value)}
                                        placeholder="Enter link title"
                                        className="w-full bg-transparent outline-none text-sm mb-2"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const urlInput = e.currentTarget.nextElementSibling as HTMLInputElement;
                                                urlInput?.focus();
                                            }
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={newLinkUrl}
                                        onChange={(e) => setNewLinkUrl(e.target.value)}
                                        placeholder="Enter link URL"
                                        className="w-full bg-transparent outline-none text-sm"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleSaveNewLink();
                                            }
                                        }}
                                    />
                                    <button onClick={handleSaveNewLink} className="mt-2 text-orange self-end">
                                        <i className="fa-solid fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='py-1 pt-3'>
                        <button 
                            className='group rounded-3xl py-2 px-4 text-sm hover:bg-light dark:hover:bg-dark transition-colors duration-300'
                            onClick={handleAddLink}
                        >
                            <div className='flex items-center'>
                                <div className='mr-2 flex justify-center items-center rounded-full p-1 group-hover:bg-orange transition-colors duration-300'>
                                    <i className='fa-solid fa-plus text-dark dark:text-white group-hover:text-white transition-colors duration-300'></i>
                                </div>
                                <span className='group-hover:text-orange transition-colors duration-300'>Add Link</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkSection;