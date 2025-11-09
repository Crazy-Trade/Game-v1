import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { GameState, GameAction, Asset } from '../game/types';
import { formatCurrency, formatNumber } from '../utils';

interface TradeModalProps {
    assetId: string;
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    onClose: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ assetId, gameState, dispatch, onClose }) => {
    const asset = gameState.assets[assetId];
    const portfolioItem = gameState.player.portfolio[assetId];

    const [tradeType, setTradeType] = useState<'spot' | 'margin'>('spot');
    const [action, setAction] = useState<'buy' | 'sell'>('buy');
    const [quantity, setQuantity] = useState('');
    const [leverage, setLeverage] = useState<2 | 5 | 10>(2);
    
    const maxBuyable = useMemo(() => {
        if(tradeType === 'spot') {
            return gameState.player.cash / asset.price;
        } else {
            // Margin allows buying more based on leverage, but initial margin comes from cash
            return (gameState.player.cash * leverage) / asset.price;
        }
    }, [gameState.player.cash, asset.price, tradeType, leverage]);

    const maxSellable = useMemo(() => portfolioItem?.quantity || 0, [portfolioItem]);

    const quantityNum = parseFloat(quantity) || 0;
    const totalValue = quantityNum * asset.price;
    const marginRequired = totalValue / leverage;

    const handleExecute = () => {
        if (quantityNum <= 0) return;
        if (tradeType === 'spot') {
            dispatch({ type: 'EXECUTE_TRADE', payload: { assetId, quantity: quantityNum, price: asset.price, isBuy: action === 'buy' } });
        } else {
            dispatch({ type: 'OPEN_MARGIN_POSITION', payload: { assetId, quantity: quantityNum, price: asset.price, leverage, isShort: action === 'sell' } });
        }
        onClose();
    };
    
    const isButtonDisabled = () => {
        if (quantityNum <= 0) return true;
        if (action === 'buy' && tradeType === 'spot' && totalValue > gameState.player.cash) return true;
        if (action === 'buy' && tradeType === 'margin' && marginRequired > gameState.player.cash) return true;
        if (action === 'sell' && tradeType === 'spot' && quantityNum > maxSellable) return true;
        if (action === 'sell' && tradeType === 'margin' && marginRequired > gameState.player.cash) return true; // Can't short without margin
        return false;
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Trade ${asset.name}`}>
            <div className="space-y-4">
                {/* Trade Type Tabs */}
                <div className="flex bg-stone-800 rounded-lg p-1">
                    <button onClick={() => setTradeType('spot')} className={`flex-1 p-2 rounded-md text-sm font-bold ${tradeType === 'spot' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}>Spot</button>
                    <button onClick={() => setTradeType('margin')} className={`flex-1 p-2 rounded-md text-sm font-bold ${tradeType === 'margin' ? 'bg-stone-700 text-white' : 'text-stone-400'}`}>Margin</button>
                </div>

                {/* Action Tabs */}
                <div className="flex bg-stone-800 rounded-lg p-1">
                    <button onClick={() => setAction('buy')} className={`flex-1 p-2 rounded-md font-bold ${action === 'buy' ? 'bg-emerald-600 text-white' : 'text-stone-400'}`}>{tradeType === 'margin' ? 'Long' : 'Buy'}</button>
                    <button onClick={() => setAction('sell')} className={`flex-1 p-2 rounded-md font-bold ${action === 'sell' ? 'bg-rose-600 text-white' : 'text-stone-400'}`}>{tradeType === 'margin' ? 'Short' : 'Sell'}</button>
                </div>
                
                {/* Quantity Input */}
                <div>
                    <label className="text-sm text-stone-400">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-stone-800 border border-stone-700 rounded-lg p-2 mt-1 focus:ring-amber-400 focus:border-amber-400"
                    />
                     <div className="text-xs text-stone-500 mt-1">
                        {action === 'buy' ? `Max Buy: ~${formatNumber(maxBuyable, 4)}` : `Max Sell: ${formatNumber(maxSellable, 4)}`}
                     </div>
                </div>

                {/* Margin specific controls */}
                {tradeType === 'margin' && (
                    <div>
                         <label className="text-sm text-stone-400">Leverage</label>
                         <div className="flex bg-stone-800 rounded-lg p-1 mt-1">
                            {[2, 5, 10].map(l => (
                                <button key={l} onClick={() => setLeverage(l as 2|5|10)} className={`flex-1 p-2 rounded-md text-sm font-bold ${leverage === l ? 'bg-violet-600 text-white' : 'text-stone-400'}`}>{l}x</button>
                            ))}
                         </div>
                    </div>
                )}
                
                {/* Summary */}
                <div className="bg-stone-800/50 rounded-lg p-3 text-sm space-y-2">
                    <div className="flex justify-between"><span>Market Price</span> <span className="font-bold">{formatCurrency(asset.price)}</span></div>
                    {tradeType === 'spot' ? (
                        <div className="flex justify-between"><span>Total Cost</span> <span className="font-bold">{formatCurrency(totalValue)}</span></div>
                    ) : (
                        <>
                            <div className="flex justify-between"><span>Position Value</span> <span className="font-bold">{formatCurrency(totalValue)}</span></div>
                            <div className="flex justify-between"><span>Margin Required</span> <span className="font-bold">{formatCurrency(marginRequired)}</span></div>
                        </>
                    )}
                </div>

                {/* Execute Button */}
                <button
                    onClick={handleExecute}
                    disabled={isButtonDisabled()}
                    className={`w-full font-bold py-2 px-4 rounded transition-colors ${
                        isButtonDisabled() 
                        ? 'bg-stone-700 text-stone-500 cursor-not-allowed'
                        : action === 'buy'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white'
                    }`}
                >
                    {tradeType === 'margin' ? (action === 'buy' ? 'Open Long' : 'Open Short') : (action === 'buy' ? 'Execute Buy' : 'Execute Sell')}
                </button>
            </div>
        </Modal>
    );
};

export default TradeModal;
