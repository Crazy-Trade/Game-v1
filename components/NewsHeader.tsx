import React from 'react';
import { NewsItem } from '../game/types';
import NewsTicker from './NewsTicker';

interface NewsHeaderProps {
    headline: NewsItem | null;
    dailyNews: NewsItem[];
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ headline, dailyNews }) => {
    return (
        <div className="sticky top-[81px] z-30 border-b border-t border-stone-800 bg-stone-900/50 backdrop-blur-sm">
            <div className="container mx-auto">
                <div className="p-2 text-center">
                    <span className="font-bold text-rose-500 mr-2 text-sm uppercase">Major Event:</span>
                    <span className="text-stone-100 font-semibold">{headline ? headline.headline : 'All quiet on the global front.'}</span>
                </div>
            </div>
            <NewsTicker news={dailyNews} />
        </div>
    );
};

export default NewsHeader;
