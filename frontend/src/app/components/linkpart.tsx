import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import LinkOverlay from './linkoverlay';

interface Link {
    _id: string;
    url: string;
    title: string;
}

interface LinkPartProps {
    link: Link;
    onDelete: (id: string) => void;
    view: 'list' | 'grid';
}

const LinkPart: React.FC<LinkPartProps> = ({ link, onDelete, view }) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link.url)
            .then(() => {
                toast.success('Link copied');
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                toast.error('Failed to copy link');
            });
    };

    const handleOpenOverlay = () => {
        setIsOverlayOpen(true);
    };

    const handleCloseOverlay = () => {
        setIsOverlayOpen(false);
    };

    const handleSaveLink = async (id: string, title: string, url: string) => {
        // Optimistically update the frontend
        const originalTitle = link.title;
        const originalUrl = link.url;
        link.title = title;
        link.url = url;

        try {
            const response = await fetch(`http://localhost:8000/api/update-link/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title, url })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update link');
            }

            // If we reach here, the backend update was successful
            toast.success('Link updated successfully');

        } catch (error) {
            console.error('Error updating link:', error);
            // Revert the optimistic update
            link.title = originalTitle;
            link.url = originalUrl;
            toast.error('Failed to update link. Please try again.');
        }
    };

    const handleDeleteLink = async () => {
        // Optimistically update the frontend
        onDelete(link._id);

        try {
            const response = await fetch(`http://localhost:8000/api/delete-link/${link._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete link');
            }

            toast.success('Link deleted successfully');
        } catch (error) {
            console.error('Error deleting link:', error);
            // Revert the optimistic update
            onDelete(link._id); // Remove the second argument
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    };

    const renderIcons = () => (
        <div className={`flex ${view === 'list' ? 'gap-5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300' : 'gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 justify-center'} items-center`}>
            <i className="fa-solid fa-trash cursor-pointer text-sm" onClick={handleDeleteLink}></i>
            <i className="fa-regular fa-hand-pointer cursor-pointer" onClick={handleOpenOverlay}></i>
            <i className='fa-solid fa-copy cursor-pointer' onClick={handleCopy}></i>
        </div>
    );

    return (
        <div className='py-1'>
            <div className={`bg-light dark:bg-dark shadow-md rounded-3xl py-3 px-4 ${view === 'list' ? 'flex justify-between items-center' : 'h-24 flex flex-col justify-between'} group`}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={`text-sm hover:text-orange ${view === 'grid' ? 'flex-grow flex items-center justify-center' : ''}`}>{link.title}</a>
                {view === 'list' ? renderIcons() : <div className='mt-2'>{renderIcons()}</div>}
            </div>
            {isOverlayOpen && (
                <LinkOverlay
                    linkId={link._id}
                    initialTitle={link.title}
                    initialUrl={link.url}
                    onClose={handleCloseOverlay}
                    onSave={handleSaveLink}
                />
            )}
        </div>
    );
};

export default LinkPart;