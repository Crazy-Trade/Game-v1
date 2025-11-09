import React from 'react';
import { GameState, MarginPosition, PortfolioItem, Company } from '../game/types';
import { formatCurrency } from '../utils';

interface HeaderProps {
    gameState: GameState;
}

const Header: React.FC<HeaderProps> = ({ gameState }) => {
    const { player, assets, date } = gameState;

    const portfolioValue = (Object.values(player.portfolio) as PortfolioItem[]).reduce((acc, item) => {
        const asset = assets[item.assetId];
        return acc + (asset ? asset.price * item.quantity : 0);
    }, 0);
    
    const marginEquity = (Object.values(player.marginPositions) as MarginPosition[]).reduce((acc, position) => {
        const asset = assets[position.assetId];
        if (!asset) return acc;
        const currentValue = asset.price * position.quantity;
        const entryValue = position.entryPrice * position.quantity;
        const pnl = position.isShort ? entryValue - currentValue : currentValue - entryValue;
        return acc + position.initialMargin + pnl;
    }, 0);

    const companyValue = player.companies.reduce((acc, company: Company) => {
        return acc + (company.upgradeCost / 1.5); // Valuation based on upgrade cost
    }, 0);

    const netWorth = player.cash + portfolioValue + marginEquity + companyValue - player.loan.amount;
    
    const formattedDate = new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-stone-950/80 backdrop-blur-sm border-b border-stone-800 p-4 sticky top-0 z-40">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-2xl font-bold text-amber-400 tracking-wider">
                    Deep Trading Sim <span className="text-xs text-stone-500 font-light">v16</span>
                </div>
                {gameState.hasStarted && (
                    <div className="flex items-center space-x-6 text-right">
                        <div>
                            <div className="text-xs text-stone-400">Cash</div>
                            <div className="text-lg font-semibold text-emerald-400 tabular-nums">{formatCurrency(player.cash)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-stone-400">Net Worth</div>
                            <div className="text-lg font-semibold text-sky-400 tabular-nums">{formatCurrency(netWorth)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-stone-400">Date</div>
                            <div className="text-lg font-semibold text-stone-300 tabular-nums">{formattedDate}</div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
