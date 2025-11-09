import React, { useState } from 'react';
import Modal from './Modal';
import { GameState, GameAction, CompanyType } from '../game/types';
import { COMPANY_TYPES, COUNTRIES } from '../game/database';
import { formatCurrency } from '../utils';

interface CompanyModalProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({ gameState, dispatch, onClose }) => {
    const [selectedType, setSelectedType] = useState<CompanyType>('Tech');
    const [companyName, setCompanyName] = useState('');
    const countryModifier = COUNTRIES[gameState.player.currentResidency].companyCostModifier;
    
    const handleSubmit = () => {
        dispatch({ type: 'ESTABLISH_COMPANY', payload: { companyType: selectedType, name: companyName } });
        onClose();
    };

    const typeData = COMPANY_TYPES[selectedType];
    const cost = typeData.baseCost * countryModifier;

    return (
        <Modal isOpen={true} onClose={onClose} title="Establish New Company">
            <div className="space-y-4">
                {/* Company Type Selector */}
                <div>
                    <label className="text-sm text-stone-400">Company Type</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                        {Object.entries(COMPANY_TYPES).map(([type, data]) => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type as CompanyType)}
                                className={`p-2 rounded-md text-sm font-bold border-2 ${selectedType === type ? 'bg-violet-600 border-violet-500 text-white' : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-500'}`}
                            >
                                {data.name}
                            </button>
                        ))}
                    </div>
                </div>

                 {/* Company Name Input */}
                <div>
                    <label className="text-sm text-stone-400">Company Name (Optional)</label>
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={`${COMPANY_TYPES[selectedType].name} Inc.`}
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 mt-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                </div>

                {/* Summary */}
                <div className="bg-stone-800/50 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex justify-between"><span>Base Income</span> <span className="font-bold">{formatCurrency(typeData.baseIncome)}/month</span></div>
                    <div className="flex justify-between text-lg"><span>Establishment Cost</span> <span className="font-bold text-rose-400">{formatCurrency(cost)}</span></div>
                </div>
                
                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={gameState.player.cash < cost}
                    className="w-full font-bold py-2 px-4 rounded transition-colors bg-sky-600 hover:bg-sky-500 text-white disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed"
                >
                    Establish Company
                </button>
            </div>
        </Modal>
    );
};

export default CompanyModal;
