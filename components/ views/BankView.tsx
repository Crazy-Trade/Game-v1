import React, { useState } from 'react';
import { GameState, GameAction } from '../../game/types';
import { formatCurrency } from '../../utils';

interface BankViewProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const BankView: React.FC<BankViewProps> = ({ gameState, dispatch }) => {
    const { loan, cash } = gameState.player;
    const [loanAmount, setLoanAmount] = useState('10000');
    const [repayAmount, setRepayAmount] = useState('10000');

    const handleTakeLoan = () => {
        const amount = parseFloat(loanAmount);
        if (amount > 0) {
            dispatch({ type: 'TAKE_LOAN', payload: { amount } });
        }
    };
    
    const handleRepayLoan = () => {
        const amount = parseFloat(repayAmount);
        if (amount > 0) {
            dispatch({ type: 'REPAY_LOAN', payload: { amount } });
        }
    };

    const monthlyPayment = loan.amount * (loan.interestRate / 12);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loan Status */}
            <div className="bg-stone-900/70 rounded-lg border border-stone-800 p-4 space-y-4">
                <h2 className="text-xl font-bold text-stone-300">Loan Status</h2>
                <div>
                    <div className="text-sm text-stone-400">Current Loan Balance</div>
                    <div className="text-2xl font-bold text-rose-400">{formatCurrency(loan.amount)}</div>
                </div>
                 <div>
                    <div className="text-sm text-stone-400">Max Loan Amount</div>
                    <div className="text-lg font-bold">{formatCurrency(loan.maxLoan)}</div>
                </div>
                <div>
                    <div className="text-sm text-stone-400">Annual Interest Rate</div>
                    <div className="text-lg font-bold">{(loan.interestRate * 100).toFixed(2)}%</div>
                </div>
                <div>
                    <div className="text-sm text-stone-400">Next Monthly Payment</div>
                    <div className="text-lg font-bold">{formatCurrency(monthlyPayment)}</div>
                </div>
            </div>

            {/* Loan Actions */}
            <div className="bg-stone-900/70 rounded-lg border border-stone-800 p-4 space-y-6">
                 <div>
                    <h3 className="text-lg font-bold text-stone-300 mb-2">Take Loan</h3>
                     <div className="flex gap-2">
                        <input
                            type="number"
                            value={loanAmount}
                            onChange={e => setLoanAmount(e.target.value)}
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2"
                        />
                        <button 
                            onClick={handleTakeLoan}
                            disabled={(parseFloat(loanAmount) || 0) + loan.amount > loan.maxLoan}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 rounded transition-colors disabled:bg-stone-700 disabled:text-stone-500"
                        >
                            Take
                        </button>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-lg font-bold text-stone-300 mb-2">Repay Loan</h3>
                     <div className="flex gap-2">
                        <input
                            type="number"
                            value={repayAmount}
                            onChange={e => setRepayAmount(e.target.value)}
                            className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2"
                        />
                        <button 
                            onClick={handleRepayLoan}
                            disabled={(parseFloat(repayAmount) || 0) > cash || loan.amount === 0}
                            className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 rounded transition-colors disabled:bg-stone-700 disabled:text-stone-500"
                        >
                            Repay
                        </button>
                    </div>
                     <button 
                        onClick={() => setRepayAmount(Math.min(cash, loan.amount).toString())}
                        className="text-xs text-stone-400 hover:text-amber-400 mt-2"
                        >
                        Repay Max
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default BankView;
