import React, { useState } from 'react';
import { LogEntry, LogType } from '../../game/types';

interface LogViewProps {
    log: LogEntry[];
}

const LOG_TYPE_COLORS: { [key in LogType]: string } = {
    System: 'bg-stone-600',
    Trade: 'bg-sky-600',
    Margin: 'bg-violet-600',
    Corporate: 'bg-amber-600',
    Politics: 'bg-rose-600',
    Bank: 'bg-emerald-600',
};

const ALL_LOG_TYPES: LogType[] = ['System', 'Trade', 'Margin', 'Corporate', 'Politics', 'Bank'];

const LogView: React.FC<LogViewProps> = ({ log }) => {
    const [filter, setFilter] = useState<LogType | 'All'>('All');

    const filteredLogs = filter === 'All' ? log : log.filter(entry => entry.type === filter);

    return (
        <div className="bg-stone-900/70 rounded-lg border border-stone-800 p-4">
            <div className="flex gap-2 mb-4 border-b border-stone-800 pb-4">
                <button 
                    onClick={() => setFilter('All')} 
                    className={`px-3 py-1 text-sm rounded-md font-bold ${filter === 'All' ? 'bg-amber-500 text-white' : 'bg-stone-700 text-stone-300'}`}
                >
                    All
                </button>
                {ALL_LOG_TYPES.map(type => (
                     <button 
                        key={type}
                        onClick={() => setFilter(type)} 
                        className={`px-3 py-1 text-sm rounded-md font-bold ${filter === type ? `${LOG_TYPE_COLORS[type]} text-white` : 'bg-stone-700 text-stone-300'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {filteredLogs.length > 0 ? filteredLogs.map(entry => (
                    <div key={entry.id} className="text-sm flex gap-4 items-start">
                        <div className="w-40 text-stone-500 tabular-nums">
                            {`${entry.date.year}-${String(entry.date.month).padStart(2,'0')}-${String(entry.date.day).padStart(2,'0')}`}
                        </div>
                        <div className="w-28 flex-shrink-0">
                             <span className={`px-2 py-0.5 text-xs font-bold rounded-full text-white/90 ${LOG_TYPE_COLORS[entry.type]}`}>
                                {entry.type}
                            </span>
                        </div>
                        <div className="text-stone-300 flex-grow">{entry.message}</div>
                    </div>
                )) : (
                    <p className="text-stone-500 text-center p-8">No log entries for this filter.</p>
                )}
            </div>
        </div>
    );
};

export default LogView;
import React, { useState } from 'react';
import { LogEntry, LogType } from '../../game/types';

interface LogViewProps {
    log: LogEntry[];
}

const LOG_TYPE_COLORS: { [key in LogType]: string } = {
    System: 'bg-stone-600',
    Trade: 'bg-sky-600',
    Margin: 'bg-violet-600',
    Corporate: 'bg-amber-600',
    Politics: 'bg-rose-600',
    Bank: 'bg-emerald-600',
};

const ALL_LOG_TYPES: LogType[] = ['System', 'Trade', 'Margin', 'Corporate', 'Politics', 'Bank'];

const LogView: React.FC<LogViewProps> = ({ log }) => {
    const [filter, setFilter] = useState<LogType | 'All'>('All');

    const filteredLogs = filter === 'All' ? log : log.filter(entry => entry.type === filter);

    return (
        <div className="bg-stone-900/70 rounded-lg border border-stone-800 p-4">
            <div className="flex gap-2 mb-4 border-b border-stone-800 pb-4">
                <button 
                    onClick={() => setFilter('All')} 
                    className={`px-3 py-1 text-sm rounded-md font-bold ${filter === 'All' ? 'bg-amber-500 text-white' : 'bg-stone-700 text-stone-300'}`}
                >
                    All
                </button>
                {ALL_LOG_TYPES.map(type => (
                     <button 
                        key={type}
                        onClick={() => setFilter(type)} 
                        className={`px-3 py-1 text-sm rounded-md font-bold ${filter === type ? `${LOG_TYPE_COLORS[type]} text-white` : 'bg-stone-700 text-stone-300'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {filteredLogs.length > 0 ? filteredLogs.map(entry => (
                    <div key={entry.id} className="text-sm flex gap-4 items-start">
                        <div className="w-40 text-stone-500 tabular-nums">
                            {`${entry.date.year}-${String(entry.date.month).padStart(2,'0')}-${String(entry.date.day).padStart(2,'0')}`}
                        </div>
                        <div className="w-28 flex-shrink-0">
                             <span className={`px-2 py-0.5 text-xs font-bold rounded-full text-white/90 ${LOG_TYPE_COLORS[entry.type]}`}>
                                {entry.type}
                            </span>
                        </div>
                        <div className="text-stone-300 flex-grow">{entry.message}</div>
                    </div>
                )) : (
                    <p className="text-stone-500 text-center p-8">No log entries for this filter.</p>
                )}
            </div>
        </div>
    );
};

export default LogView;
