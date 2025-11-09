import React from 'react';
import { GameState, ModalType } from '../../game/types';
import { formatCurrency } from '../../utils';
import { PlusCircleIcon } from '../Icons';

interface CompaniesViewProps {
    gameState: GameState;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const CompaniesView: React.FC<CompaniesViewProps> = ({ gameState, setActiveModal }) => {
    const { companies } = gameState.player;

    if (companies.length === 0) {
        return (
            <div className="text-center p-8 bg-stone-800/50 rounded-lg">
                <p className="mb-4">You do not own any companies.</p>
                <button 
                    onClick={() => setActiveModal({ type: 'Company' })}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors inline-flex items-center gap-2"
                >
                    <PlusCircleIcon />
                    Establish First Company
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <button 
                    onClick={() => setActiveModal({ type: 'Company' })}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded transition-colors inline-flex items-center gap-2"
                >
                    <PlusCircleIcon />
                    Establish New Company
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companies.map(company => (
                    <div key={company.id} className="bg-stone-900/70 rounded-lg border border-stone-800 p-4 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-amber-400">{company.name}</h3>
                            <p className="text-sm text-stone-400">{company.type} - Level {company.level}</p>
                        </div>
                        <div className="my-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-300">Monthly Income:</span>
                                <span className="font-bold text-emerald-400">{formatCurrency(company.monthlyIncome)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-stone-300">Next Upgrade:</span>
                                <span className="font-bold text-rose-400">{formatCurrency(company.upgradeCost)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveModal({ type: 'UpgradeCompany', companyId: company.id })}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Upgrade
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompaniesView;
