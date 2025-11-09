import React from 'react';
import { GameState, ModalType } from '../../game/types';
import { COUNTRIES } from '../../game/database';
import { formatNumber, formatCurrency } from '../../utils';

interface PoliticsViewProps {
    gameState: GameState;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const PoliticsView: React.FC<PoliticsViewProps> = ({ gameState, setActiveModal }) => {
    const { player } = gameState;
    const currentCountry = COUNTRIES[player.currentResidency];
    const politicalCapital = player.politicalCapital[currentCountry.id] || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Status */}
            <div className="md:col-span-1 bg-stone-900/70 rounded-lg border border-stone-800 p-4 space-y-4">
                <h2 className="text-xl font-bold text-stone-300">Political Standing</h2>
                <div>
                    <div className="text-sm text-stone-400">Current Residency</div>
                    <div className="text-lg font-bold">{currentCountry.name}</div>
                </div>
                <div>
                    <div className="text-sm text-stone-400">Political Capital</div>
                    <div className="text-2xl font-bold text-violet-400">{formatNumber(politicalCapital)}</div>
                </div>
                 <div>
                    <div className="text-sm text-stone-400">Owned Permits</div>
                    <div className="text-sm font-semibold space-y-1">
                        {player.residencyPermits.map(id => <p key={id}>- {COUNTRIES[id].name}</p>)}
                    </div>
                </div>
            </div>

            {/* Right Column - Actions */}
            <div className="md:col-span-2 bg-stone-900/70 rounded-lg border border-stone-800 p-4">
                <h2 className="text-xl font-bold text-stone-300 mb-4">Political Actions</h2>
                 <div className="space-y-4">
                    <p className="text-stone-400 text-sm">Use your wealth and influence to shape the world.</p>
                    <button
                        onClick={() => setActiveModal({ type: 'Politics' })}
                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded transition-colors text-left"
                    >
                        <h3 className="font-bold">Engage in National Politics</h3>
                        <p className="text-sm font-normal">Donate to parties, lobby for industries, and manage your influence in {currentCountry.name}.</p>
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default PoliticsView;
