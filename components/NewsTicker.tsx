import React from 'react';
import { NewsItem } from '../game/types';

interface NewsTickerProps {
    news: NewsItem[];
}

const NewsTicker: React.FC<NewsTickerProps> = ({ news }) => {
    // We only want minor news for the ticker
    const tickerNews = news.filter(n => !n.isMajor).map(n => n.headline).join(' ••• ');

    if (!tickerNews) {
        return null;
    }

    return (
        <div className="bg-stone-800 text-sm text-stone-400 p-2 overflow-hidden whitespace-nowrap ticker-wrap">
            <div className="ticker-move">
                <span>{tickerNews}</span>
            </div>
        </div>
    );
};

export default NewsTicker;
