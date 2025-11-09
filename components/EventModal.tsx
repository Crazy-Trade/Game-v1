import React from 'react';
import Modal from './Modal';
import { GameEvent } from '../game/types';

interface EventModalProps {
    event: GameEvent;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    return (
        <Modal isOpen={true} onClose={null} title={event.title}>
            <div className="space-y-4">
                <p className="text-stone-300">{event.description}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Acknowledge
                </button>
            </div>
        </Modal>
    );
};

export default EventModal;
