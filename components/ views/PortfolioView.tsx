import React from 'react';
import { GameState, ModalType } from '../../game/types';
import { formatCurrency, formatNumber, formatPercent } from '../../utils';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons';

interface PortfolioViewProps {
    gameState: GameState;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ gameState, setActiveModal }) => {
    const { player, assets } = gameState;
    const portfolioItems = Object.values(player.portfolio);
    const marginPositions = Object.values(player.marginPositions);

    const hasHoldings = portfolioItems.length > 0 || marginPositions.length > 0;

    if (!hasHoldings) {
        return (
            <div className="text-center p-8 bg-stone-800/50 rounded-lg">
                <p>Your portfolio is empty. Go to the Markets tab to start trading.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Spot Holdings */}
            {portfolioItems.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-stone-300 mb-4">Spot Holdings</h2>
                    <div className="bg-stone-900/70 rounded-lg border border-stone-800 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-stone-800 text-sm text-stone-400 uppercase">
                                <tr>
                                    <th className="p-4">Asset</th>
                                    <th className="p-4 text-right">Quantity</th>
                                    <th className="p-4 text-right">Avg. Cost</th>
                                    <th className="p-4 text-right">Market Price</th>
                                    <th className="p-4 text-right">Market Value</th>
                                    <th className="p-4 text-right">P/L</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800">
                                {portfolioItems.map(item => {
                                    const asset = assets[item.assetId];
                                    if (!asset) return null;

                                    const marketValue = item.quantity * asset.price;
                                    const totalCost = item.quantity * item.avgCost;
                                    const pnl = marketValue - totalCost;
                                    const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
                                    const isGain = pnl >= 0;

                                    return (
                                        <tr key={item.assetId} className="hover:bg-stone-800/50">
                                            <td className="p-4 font-bold">{asset.name}</td>
                                            <td className="p-4 text-right tabular-nums">{formatNumber(item.quantity, 4)}</td>
                                            <td className="p-4 text-right tabular-nums">{formatCurrency(item.avgCost)}</td>
                                            <td className="p-4 text-right tabular-nums font-semibold">{formatCurrency(asset.price)}</td>
                                            <td className="p-4 text-right tabular-nums">{formatCurrency(marketValue)}</td>
                                            <td className={`p-4 text-right tabular-nums font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                <div className="flex items-center justify-end gap-2">
                                                    {isGain ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                                    <span>{formatCurrency(pnl, true)} ({formatPercent(pnlPercent)})</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => setActiveModal({ type: 'Trade', assetId: asset.id })} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Trade</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Margin Positions */}
            {marginPositions.length > 0 && (
                 <div>
                    <h2 className="text-xl font-bold text-stone-300 mb-4">Margin Positions</h2>
                    <div className="bg-stone-900/70 rounded-lg border border-stone-800 overflow-hidden">
                        <table className="w-full text-left">
                             <thead className="bg-stone-800 text-sm text-stone-400 uppercase">
                                <tr>
                                    <th className="p-4">Asset</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4 text-right">Size</th>
                                    <th className="p-4 text-right">Entry Price</th>
                                    <th className="p-4 text-right">Market Price</th>
                                    <th className="p-4 text-right">Liq. Price</th>
                                    <th className="p-4 text-right">P/L</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="divide-y divide-stone-800">
                                {marginPositions.map(pos => {
                                    const asset = assets[pos.assetId];
                                    if (!asset) return null;

                                    const currentValue = pos.quantity * asset.price;
                                    const entryValue = pos.quantity * pos.entryPrice;
                                    // FIX: Corrected a typo where 'pnl' was used in its own declaration.
                                    const pnl = pos.isShort ? entryValue - currentValue : currentValue - entryValue;
                                    const pnlPercent = pos.initialMargin > 0 ? (pnl / pos.initialMargin) * 100 : 0;
                                    const isGain = pnl >= 0;

                                    return (
                                        <tr key={pos.assetId} className="hover:bg-stone-800/50">
                                            <td className="p-4 font-bold">{asset.name}</td>
                                            <td className={`p-4 font-bold ${pos.isShort ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {pos.isShort ? `SHORT x${pos.leverage}` : `LONG x${pos.leverage}`}
                                            </td>
                                            <td className="p-4 text-right tabular-nums">{formatNumber(pos.quantity, 4)}</td>
                                            <td className="p-4 text-right tabular-nums">{formatCurrency(pos.entryPrice)}</td>
                                            <td className="p-4 text-right tabular-nums font-semibold">{formatCurrency(asset.price)}</td>
                                            <td className="p-4 text-right tabular-nums text-amber-400">{formatCurrency(pos.liquidationPrice)}</td>
                                            <td className={`p-4 text-right tabular-nums font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                 <div className="flex items-center justify-end gap-2">
                                                    {isGain ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                                    <span>{formatCurrency(pnl, true)} ({formatPercent(pnlPercent)})</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button onClick={() => setActiveModal({ type: 'Trade', assetId: asset.id })} className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Close</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioView;
