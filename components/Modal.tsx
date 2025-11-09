import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: (() => void) | null; // Allow null for non-closable modals
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    const handleBackdropClick = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={handleBackdropClick}
        >
            <div 
                className="bg-stone-900 rounded-lg p-6 w-full max-w-md border border-stone-700 shadow-2xl shadow-black/50 modal-enter"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-amber-400">{title}</h2>
                    {onClose && (
                        <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">&times;</button>
                    )}
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
