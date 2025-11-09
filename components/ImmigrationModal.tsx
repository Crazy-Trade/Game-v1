import React from 'react';
import Modal from './Modal';
import { GameState, GameAction } from '../game/types';
import { COUNTRIES } from '../game/database';
import type { Country } from '../game/types';
import { formatCurrency } from '../utils';

interface ImmigrationModalProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

const ImmigrationModal: React.FC<ImmigrationModalProps> = ({ gameState, dispatch, onClose }) => {
    const { player } = gameState;

    const handleImmigrate = (countryId: string) => {
        dispatch({ type: 'APPLY_IMMIGRATION', payload: { countryId } });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Apply for New Residency">
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {Object.values(COUNTRIES).map((country: Country) => {
                    const isCurrentResidency = player.currentResidency === country.id;
                    const hasPermit = player.residencyPermits.includes(country.id);
                    const canAfford = player.cash >= country.immigrationCost;

                    return (
                        <div key={country.id} className="w-full text-left p-4 bg-stone-800 rounded-lg border border-stone-700 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-stone-100">{country.name}</h3>
                                <div className="text-sm text-stone-300">
                                    <span>Cost: <span className="font-semibold text-rose-400">{formatCurrency(country.immigrationCost)}</span></span>
                                </div>
                            </div>
                            <div>
                                {isCurrentResidency ? (
                                    <span className="px-3 py-1 text-xs font-bold text-amber-300 bg-amber-800/50 rounded-full">Current</span>
                                ) : hasPermit ? (
                                     <button onClick={() => handleImmigrate(country.id)} className="px-3 py-1 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors">
                                        Move Here
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleImmigrate(country.id)}
                                        disabled={!canAfford}
                                        className="px-3 py-1 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed"
                                    >
                                        Apply
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Modal>
    );
};

export default ImmigrationModal;
