import React from 'react';

interface TimeControlsProps {
    isPaused: boolean;
    onTogglePlay: () => void;
    speed: number;
    onSetSpeed: (speed: number) => void;
    onNextDay: () => void;
    dayProgress: number;
}

const TimeControls: React.FC<TimeControlsProps> = ({ isPaused, onTogglePlay, speed, onSetSpeed, onNextDay, dayProgress }) => {
    const speeds = [1, 2, 5, 10, 25, 50, 100];
    return (
        <div className="bg-stone-950/80 backdrop-blur-sm border-t border-stone-800">
            <div className="w-full bg-stone-700 h-1">
                <div className="bg-amber-400 h-1" style={{ width: `${dayProgress * 100}%` }}></div>
            </div>
            <div className="p-2 flex justify-center items-center space-x-4">
                <button onClick={onTogglePlay} className="text-stone-300 hover:text-white px-4 py-1 rounded w-20 text-center font-bold text-lg">
                    {isPaused ? '▶' : '❚❚'}
                </button>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-stone-400">Speed:</span>
                    {speeds.map(s => (
                        <button
                            key={s}
                            onClick={() => onSetSpeed(s)}
                            className={`px-3 py-1 rounded transition-colors ${
                                speed === s ? 'text-amber-400 font-bold bg-stone-700' : 'text-stone-300'
                            } hover:bg-stone-600 text-sm`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>
                 <button onClick={onNextDay} className="text-stone-300 hover:text-white px-4 py-1 rounded text-sm hover:bg-stone-700 transition-colors">
                    Next Day &raquo;
                </button>
            </div>
        </div>
    );
};

export default TimeControls;
