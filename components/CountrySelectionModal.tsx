import React from 'react';
import Modal from './Modal';
import { COUNTRIES } from '../game/database';
import type { Country } from '../game/types';

interface CountrySelectionModalProps {
    onSelect: (countryId: string) => void;
}

const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({ onSelect }) => {
    return (
        <Modal isOpen={true} onClose={null} title="Choose Your Starting Country">
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                <p className="text-sm text-stone-400 mb-2">Your country of residence determines your starting tax rate, local market access, and company costs.</p>
                {Object.values(COUNTRIES).map((country: Country) => (
                    <button
                        key={country.id}
                        onClick={() => onSelect(country.id)}
                        className="w-full text-left p-4 bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700"
                    >
                        <h3 className="font-bold text-lg text-stone-100">{country.name}</h3>
                        <div className="text-sm text-stone-300 grid grid-cols-2 gap-x-4">
                            <span>Tax Rate: <span className="font-semibold text-amber-400">{country.taxRate * 100}%</span></span>
                            <span>Company Cost: <span className="font-semibold text-amber-400">{country.companyCostModifier * 100}%</span></span>
                        </div>
                    </button>
                ))}
            </div>
        </Modal>
    );
};

export default CountrySelectionModal;
