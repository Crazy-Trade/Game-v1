import React from 'react';
import Modal from './Modal';
import { GameState, GameAction } from '../game/types';

interface OrderModalProps {
    assetId: string;
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ assetId, gameState, onClose }) => {
    const asset = gameState.assets[assetId];

    return (
        <Modal isOpen={true} onClose={onClose} title={`Set Order for ${asset.name}`}>
            <div className="space-y-4">
                <p className="text-stone-400 text-center">Advanced orders (Stop-Loss, Take-Profit, Limit Buy) are not yet implemented in this version of the simulation.</p>
                <button
                    onClick={onClose}
                    className="w-full bg-stone-600 hover:bg-stone-500 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default OrderModal;
