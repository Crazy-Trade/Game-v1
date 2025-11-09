import React, { useState } from 'react';
import { GameState, GameAction, ModalType } from '../game/types';
import MarketsView from './views/MarketsView';
import PortfolioView from './views/PortfolioView';
import CompaniesView from './views/CompaniesView';
import PoliticsView from './views/PoliticsView';
import BankView from './views/BankView';
import LogView from './views/LogView';

interface MainContentProps {
    gameState: GameState;
    dispatch: React.Dispatch<GameAction>;
    setActiveModal: React.Dispatch<React.SetStateAction<ModalType>>;
}

type ViewType = 'Markets' | 'Portfolio' | 'Companies' | 'Politics' | 'Bank' | 'Log';

const MainContent: React.FC<MainContentProps> = ({ gameState, dispatch, setActiveModal }) => {
    const [activeView, setActiveView] = useState<ViewType>('Markets');

    const renderView = () => {
        switch (activeView) {
            case 'Markets':
                return <MarketsView gameState={gameState} setActiveModal={setActiveModal} />;
            case 'Portfolio':
                return <PortfolioView gameState={gameState} setActiveModal={setActiveModal} />;
            case 'Companies':
                return <CompaniesView gameState={gameState} setActiveModal={setActiveModal} />;
            case 'Politics':
                return <PoliticsView gameState={gameState} setActiveModal={setActiveModal} />;
            case 'Bank':
                return <BankView gameState={gameState} dispatch={dispatch} />;
            case 'Log':
                return <LogView log={gameState.log} />;
            default:
                return null;
        }
    };

    const views: ViewType[] = ['Markets', 'Portfolio', 'Companies', 'Politics', 'Bank', 'Log'];

    return (
        <div className="space-y-4">
            <nav className="flex space-x-2 border-b border-stone-800">
                {views.map(view => (
                    <button
                        key={view}
                        onClick={() => setActiveView(view)}
                        className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${
                            activeView === view
                                ? 'border-amber-400 text-amber-400'
                                : 'border-transparent text-stone-400 hover:text-white'
                        }`}
                    >
                        {view}
                    </button>
                ))}
            </nav>
            <div className="mt-4">
                {renderView()}
            </div>
        </div>
    );
};

export default MainContent;
