import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

interface LinkOverlayProps {
    linkId: string;
    initialTitle: string;
    initialUrl: string;
    onClose: () => void;
    onSave: (id: string, title: string, url: string) => void;
}

const LinkOverlay: React.FC<LinkOverlayProps> = ({ linkId, initialTitle, initialUrl, onClose, onSave }) => {
    const [title, setTitle] = useState(initialTitle);
    const [url, setUrl] = useState(initialUrl);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSave = () => {
        if (!title.trim() || !url.trim()) {
            toast.error('Both title and URL are required');
            return;
        }

        onSave(linkId, title.trim(), url.trim());
        onClose();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success('Link copied');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy link');
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={overlayRef} className="relative bg-white dark:bg-dark rounded-lg p-6 w-11/12 sm:w-full max-w-md py-8 pt-14">
                <div className='absolute top-3 right-3' onClick={onClose}>
                    <i className="fa-solid fa-xmark cursor-pointer text-xl"></i>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-lessLight dark:bg-lessDark rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                </div>
                <div className="mb-6 relative">
                    <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-3 py-2 pr-10 bg-lessLight dark:bg-lessDark rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                    <i className="fa-solid fa-copy absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={handleCopy}></i>
                </div>
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-orange rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-orange"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LinkOverlay;
