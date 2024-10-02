import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface LinkPart {
    id: number;
    title: string;
    url: string;
}

function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<LinkPart[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setSearchResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleSearch = async () => {
            if (searchTerm.trim() === '') {
                setSearchResults([]);
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/search?q=${searchTerm}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }

                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching:', error);
                toast.error('Failed to fetch search results');
            }
        };

        const debounceTimer = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={overlayRef} className="relative bg-white bg-light dark:bg-dark p-6 rounded-3xl h-[70%] w-[90%] max-h-[700px] sm:w-[400px] max-w-[400px] flex flex-col">
                <div className="flex items-center justify-center absolute top-4 right-4">
                    <i className="fa-solid fa-xmark text-lg cursor-pointer" onClick={onClose}></i>
                </div>
                <div className="flex items-center justify-center mb-4 pt-7 px-5">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow p-2 rounded-3xl bg-lessLight dark:bg-lessDark focus:outline-none focus:ring-2 focus:ring-orange"
                        autoFocus
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {searchResults.map((result) => (
                        <div key={result.id} className="mb-2 p-2 px-4 rounded-3xl bg-lessLight dark:bg-lessDark">
                            <h3 className="font-bold">{result.title}</h3>
                            <a href={result.url} className="text-orange hover:underline" target="_blank" rel="noopener noreferrer">
                                {result.url}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchOverlay;