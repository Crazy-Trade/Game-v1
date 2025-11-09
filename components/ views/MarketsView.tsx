import React from 'react';
import { GameState, ModalType, Asset } from '../../game/types';
import { formatCurrency, formatPercent } from '../../utils';
import { COUNTRIES } from '../../game/database';
import { ArrowDownIcon, ArrowUpIcon } from '../Icons';

interface MarketsViewProps {
    gameState: GameState;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

const MarketsView: React.FC<MarketsViewProps> = ({ gameState, setActiveModal }) => {
    const { assets, player } = gameState;
    const currentCountry = COUNTRIES[player.currentResidency];
    
    const isAssetLocked = (asset: Asset) => {
        const localMarkets = Object.values(COUNTRIES).flatMap(c => c.localMarkets);
        if (!localMarkets.includes(asset.id)) return false; // Not a local market asset
        
        return !player.residencyPermits.some(permit => COUNTRIES[permit].localMarkets.includes(asset.id));
    };

    return (
         <div className="bg-stone-900/70 rounded-lg border border-stone-800 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-stone-800 text-sm text-stone-400 uppercase">
                    <tr>
                        <th className="p-4">Asset</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Market Price</th>
                        <th className="p-4 text-right">Day's Change</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-800">
                    {Object.values(assets).map(asset => {
                        const change = asset.price - asset.basePrice;
                        const changePercent = asset.basePrice > 0 ? (change / asset.basePrice) * 100 : 0;
                        const isGain = change >= 0;
                        const locked = isAssetLocked(asset);

                        return (
                            <tr key={asset.id} className={`hover:bg-stone-800/50 ${locked ? 'opacity-50' : ''}`}>
                                <td className="p-4 font-bold">{asset.name}</td>
                                <td className="p-4 text-stone-400 text-sm">{asset.category}</td>
                                <td className="p-4 text-right tabular-nums font-semibold">{formatCurrency(asset.price)}</td>
                                <td className={`p-4 text-right tabular-nums font-bold ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <div className="flex items-center justify-end gap-2">
                                        {isGain ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        <span>{formatCurrency(change, true)} ({formatPercent(changePercent)})</span>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    {locked ? (
                                        <span className="text-xs text-stone-500 font-bold">LOCKED</span>
                                    ) : (
                                        <div className="space-x-2">
                                            <button onClick={() => setActiveModal({ type: 'Trade', assetId: asset.id })} className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Trade</button>
                                            <button onClick={() => setActiveModal({ type: 'Order', assetId: asset.id })} className="bg-stone-600 hover:bg-stone-500 text-white font-bold py-1 px-3 rounded text-sm transition-colors">Order</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MarketsView;
