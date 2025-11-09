import React from 'react';
import Modal from './Modal';
import { GameState, GameAction, Company } from '../game/types';
import { formatCurrency } from '../utils';
import { COMPANY_TYPES } from '../game/database';

interface UpgradeCompanyModalProps {
    companyId: string;
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

const UpgradeCompanyModal: React.FC<UpgradeCompanyModalProps> = ({ companyId, gameState, dispatch, onClose }) => {
    const company = gameState.player.companies.find(c => c.id === companyId);

    if (!company) return null;
    
    const handleUpgrade = () => {
        dispatch({ type: 'UPGRADE_COMPANY', payload: { companyId } });
        onClose();
    };

    const typeData = COMPANY_TYPES[company.type];
    const nextLevelIncome = typeData.baseIncome * (company.level + 1) * (1 + (company.level)*0.1);

    return (
        <Modal isOpen={true} onClose={onClose} title={`Upgrade ${company.name}`}>
            <div className="space-y-4">
                <p className="text-stone-300">Upgrading your company will increase its monthly income and potential for special events.</p>

                <div className="bg-stone-800/50 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex justify-between">
                        <span>Current Level</span> <span className="font-bold">{company.level}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Current Income</span> <span className="font-bold">{formatCurrency(company.monthlyIncome)}/mo</span>
                    </div>
                     <div className="flex justify-between text-emerald-400">
                        <span>Income at Lvl {company.level + 1}</span> <span className="font-bold">{formatCurrency(nextLevelIncome)}/mo</span>
                    </div>
                    <div className="flex justify-between text-lg">
                        <span>Upgrade Cost</span> <span className="font-bold text-rose-400">{formatCurrency(company.upgradeCost)}</span>
                    </div>
                </div>

                <div className="text-xs text-amber-400/80 bg-amber-900/20 border border-amber-900 rounded-md p-2">
                    <span className="font-bold">Warning:</span> Upgrades can have unforseen outcomes. There is a small chance of complications leading to extra costs or a chance of a breakthrough leading to exceptional results.
                </div>

                <button
                    onClick={handleUpgrade}
                    disabled={gameState.player.cash < company.upgradeCost}
                    className="w-full font-bold py-2 px-4 rounded transition-colors bg-violet-600 hover:bg-violet-500 text-white disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed"
                >
                    Confirm Upgrade
                </button>
            </div>
        </Modal>
    );
};

export default UpgradeCompanyModal;
