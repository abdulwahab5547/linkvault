import React, { useState } from 'react';

interface SectionTooltipProps {
    sectionId: string;
    onDelete: (sectionId: string) => void;
    onSectionDeleted: () => void;
}

const SectionTooltip: React.FC<SectionTooltipProps> = ({ sectionId, onDelete, onSectionDeleted }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        // Optimistically delete the section in the frontend
        onDelete(sectionId);
        onSectionDeleted();

        try {
            const response = await fetch(`http://localhost:8000/api/delete-section/${sectionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete section');
            }

            // If we reach here, the backend deletion was successful
            // The section is already removed from the frontend, so we don't need to do anything else
        } catch (error) {
            console.error('Error deleting section:', error);
            // Revert the optimistic update if there's an error
            onSectionDeleted(); // This should re-fetch the sections, including the one we tried to delete
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-light dark:bg-dark w-8 h-8 rounded-full flex items-center justify-center"
            >
                <i className='fa-solid fa-ellipsis-vertical text-sm cursor-pointer'></i>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-3xl shadow-lg py-1 px-2 bg-light dark:bg-dark ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        <button
                            onClick={handleDelete}
                            className="block rounded-3xl px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-lessLight dark:hover:bg-lessDark w-full text-left whitespace-nowrap"
                            role="menuitem"
                        >
                            Delete Section
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionTooltip;
