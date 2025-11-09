import React, { useState } from 'react';
import Modal from './Modal';
import { GameState, GameAction, ModalType, AssetCategory } from '../game/types';
import { COUNTRIES } from '../game/database';
import { formatCurrency, formatNumber } from '../utils';

interface PoliticsModalProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
    onClose: () => void;
}

const PoliticsModal: React.FC<PoliticsModalProps> = ({ gameState, dispatch, setActiveModal, onClose }) => {
    const { player } = gameState;
    const currentCountry = COUNTRIES[player.currentResidency];
    const politicalCapital = player.politicalCapital[currentCountry.id] || 0;

    const [donationAmount, setDonationAmount] = useState('100000');
    
    const handleDonate = () => {
        const amount = parseFloat(donationAmount);
        if (amount > 0) {
            // In a real game, you might select a party. For simplicity, we donate generally.
            dispatch({ type: 'DONATE_TO_PARTY', payload: { countryId: currentCountry.id, partyId: 'general', amount } });
        }
    };

    const handleLobby = () => {
        // Placeholder for a more complex UI to select an industry
        dispatch({ type: 'LOBBY', payload: { countryId: currentCountry.id, industry: 'Tech' } });
    }

    return (
        <Modal isOpen={true} onClose={onClose} title={`National Politics: ${currentCountry.name}`}>
            <div className="space-y-4">
                <div className="bg-stone-800/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-stone-400">Your Political Capital</div>
                    <div className="text-2xl font-bold text-violet-400">{formatNumber(politicalCapital)}</div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                    <h3 className="font-bold text-stone-300">Actions</h3>
                    
                    {/* Donation */}
                    <div className="bg-stone-800 p-3 rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Make a Political Donation</p>
                        <p className="text-xs text-stone-400">Gain political capital by donating to political entities. ($10,000 = 1 Capital)</p>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={e => setDonationAmount(e.target.value)}
                                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2"
                            />
                            <button 
                                onClick={handleDonate}
                                disabled={(parseFloat(donationAmount) || 0) > player.cash}
                                className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 rounded transition-colors disabled:bg-stone-700 disabled:text-stone-500"
                            >
                                Donate
                            </button>
                        </div>
                    </div>
                    
                    {/* Lobbying */}
                     <div className="bg-stone-800 p-3 rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Lobby for Industry</p>
                        <p className="text-xs text-stone-400">Spend 100 Political Capital to create favorable conditions for an industry.</p>
                        <button 
                            onClick={handleLobby}
                            disabled={politicalCapital < 100}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 rounded transition-colors disabled:bg-stone-700 disabled:text-stone-500"
                        >
                            Lobby for Tech Industry (Cost: 100 PC)
                        </button>
                    </div>

                    {/* Immigration */}
                     <div className="bg-stone-800 p-3 rounded-lg space-y-2">
                        <p className="text-sm font-semibold">Change Residency</p>
                        <p className="text-xs text-stone-400">Move your base of operations to another country to access new markets and political landscapes.</p>
                        <button 
                            onClick={() => setActiveModal({ type: 'Immigration' })}
                            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded transition-colors"
                        >
                            Apply for Immigration
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PoliticsModal;
