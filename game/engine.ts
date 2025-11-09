// Implements the core game logic through a reducer function.

import { GameState, GameAction, Asset, MarginPosition, LogEntry } from './types';
import { COUNTRIES, COMPANY_TYPES, getInitialState } from './database';
import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';

const TICKS_PER_DAY = 1000;

function addLog(state: GameState, type: LogEntry['type'], message: string) {
    state.log.unshift({
        id: state.nextLogId++,
        date: { year: state.date.year, month: state.date.month, day: state.date.day },
        type,
        message,
    });
    if (state.log.length > 200) {
        state.log.pop();
    }
}

export const gameReducer = produce((draft: GameState, action: GameAction): void => {
    switch (action.type) {
        case 'START_GAME': {
            draft.hasStarted = true;
            draft.isPaused = false;
            draft.player.currentResidency = action.payload.countryId;
            draft.player.residencyPermits.push(action.payload.countryId);
            draft.player.politicalCapital[action.payload.countryId] = 0;
            addLog(draft, 'System', `Simulation started. Residency established in ${COUNTRIES[action.payload.countryId].name}.`);
            return;
        }

        case 'PAUSE_GAME':
            draft.isPaused = true;
            return;

        case 'RESUME_GAME':
            draft.isPaused = false;
            return;

        case 'SET_SPEED':
            draft.gameSpeed = action.payload;
            return;
        
        case 'DISMISS_EVENT_POPUP':
            draft.majorEventQueue.shift();
            return;

        case 'TICK': {
            if (draft.isPaused || !draft.hasStarted) return;
            
            const effectiveDeltaTime = action.payload.deltaTime * draft.gameSpeed;
            draft.date.ticks += effectiveDeltaTime;
            draft.date.dayProgress = (draft.date.ticks % TICKS_PER_DAY) / TICKS_PER_DAY;

            // Update asset prices
            Object.values(draft.assets).forEach((asset: Asset) => {
                const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
                const priceChange = asset.price * asset.volatility * (randomFactor / 50); // smaller changes per tick
                asset.price += priceChange;
            });

            // Check for liquidations
            Object.values(draft.player.marginPositions).forEach((pos: MarginPosition) => {
                const asset = draft.assets[pos.assetId];
                const shouldLiquidate = pos.isShort
                    ? asset.price >= pos.liquidationPrice
                    : asset.price <= pos.liquidationPrice;
                
                if (shouldLiquidate) {
                    draft.player.cash -= pos.initialMargin; // simplified loss
                    addLog(draft, 'Margin', `Position for ${asset.name} was liquidated. Loss: ${formatCurrency(pos.initialMargin)}`);
                    delete draft.player.marginPositions[pos.assetId];
                }
            });


            if (draft.date.ticks >= TICKS_PER_DAY) {
                // New Day
                draft.date.ticks = 0;
                draft.date.day++;
                if (draft.date.day > 30) { // Simplified month
                    draft.date.day = 1;
                    draft.date.month++;
                    
                    // Monthly events
                    let totalIncome = 0;
                    draft.player.companies.forEach(company => {
                        totalIncome += company.monthlyIncome;
                    });
                    draft.player.cash += totalIncome;
                     if(totalIncome > 0) addLog(draft, 'Corporate', `Received ${formatCurrency(totalIncome)} in income from companies.`);

                    if (draft.player.loan.amount > 0) {
                        const interest = draft.player.loan.amount * (draft.player.loan.interestRate / 12);
                        draft.player.cash -= interest;
                        addLog(draft, 'Bank', `Paid ${formatCurrency(interest)} in loan interest.`);
                    }

                    if (draft.date.month > 12) {
                        draft.date.month = 1;
                        draft.date.year++;
                    }
                }
                
                // Reset base prices for the day
                 Object.values(draft.assets).forEach(asset => {
                    asset.basePrice = asset.price;
                });
            }
            return;
        }

        case 'NEXT_DAY': {
             draft.date.day++;
             draft.date.ticks = 0;
             draft.date.dayProgress = 0;
              if (draft.date.day > 30) {
                draft.date.day = 1;
                draft.date.month++;
                 if (draft.date.month > 12) {
                    draft.date.month = 1;
                    draft.date.year++;
                }
            }
             Object.values(draft.assets).forEach(asset => {
                asset.basePrice = asset.price;
            });
            return;
        }

        case 'EXECUTE_TRADE': {
            const { assetId, quantity, price, isBuy } = action.payload;
            const cost = quantity * price;
            const currentPosition = draft.player.portfolio[assetId];

            if (isBuy) {
                if (draft.player.cash < cost) return;
                draft.player.cash -= cost;
                if (currentPosition) {
                    const newTotalQuantity = currentPosition.quantity + quantity;
                    const newTotalCost = (currentPosition.avgCost * currentPosition.quantity) + cost;
                    currentPosition.avgCost = newTotalCost / newTotalQuantity;
                    currentPosition.quantity = newTotalQuantity;
                } else {
                    draft.player.portfolio[assetId] = { assetId, quantity, avgCost: price };
                }
                 addLog(draft, 'Trade', `Bought ${quantity.toFixed(4)} of ${draft.assets[assetId].name} for ${formatCurrency(cost)}.`);
            } else { // Sell
                if (!currentPosition || currentPosition.quantity < quantity) return;
                draft.player.cash += cost;
                currentPosition.quantity -= quantity;
                if (currentPosition.quantity <= 0.00001) { // Floating point safety
                    delete draft.player.portfolio[assetId];
                }
                 addLog(draft, 'Trade', `Sold ${quantity.toFixed(4)} of ${draft.assets[assetId].name} for ${formatCurrency(cost)}.`);
            }
            return;
        }

        case 'OPEN_MARGIN_POSITION': {
            const { assetId, quantity, price, leverage, isShort } = action.payload;
            const positionValue = quantity * price;
            const marginRequired = positionValue / leverage;

            if (draft.player.cash < marginRequired) return;
            draft.player.cash -= marginRequired;

            // Simplified liquidation price calculation
            const liquidationPrice = isShort
                ? price * (1 + (1 / leverage) * 0.9)
                : price * (1 - (1 / leverage) * 0.9);

            draft.player.marginPositions[assetId] = {
                assetId,
                quantity,
                entryPrice: price,
                leverage,
                isShort,
                initialMargin: marginRequired,
                liquidationPrice,
            };
            addLog(draft, 'Margin', `Opened ${isShort ? 'short' : 'long'} position on ${draft.assets[assetId].name} for ${formatCurrency(positionValue)}.`);
            return;
        }
        
        case 'ESTABLISH_COMPANY': {
            const { companyType, name } = action.payload;
            const typeData = COMPANY_TYPES[companyType];
            const countryModifier = COUNTRIES[draft.player.currentResidency].companyCostModifier;
            const cost = typeData.baseCost * countryModifier;

            if (draft.player.cash < cost) return;
            draft.player.cash -= cost;

            const newCompany = {
                id: uuidv4(),
                name: name || `${typeData.name} #${draft.player.companies.length + 1}`,
                type: companyType,
                level: 1,
                monthlyIncome: typeData.baseIncome,
                upgradeCost: typeData.baseCost * 2
            };
            draft.player.companies.push(newCompany);
            addLog(draft, 'Corporate', `Established new company: ${newCompany.name}.`);
            return;
        }
        
        case 'UPGRADE_COMPANY': {
            const company = draft.player.companies.find(c => c.id === action.payload.companyId);
            if (!company || draft.player.cash < company.upgradeCost) return;
            
            draft.player.cash -= company.upgradeCost;
            company.level += 1;
            company.monthlyIncome *= 1.5;
            company.upgradeCost *= 2;
            addLog(draft, 'Corporate', `Upgraded ${company.name} to level ${company.level}.`);
            return;
        }

        case 'DONATE_TO_PARTY': {
            const { countryId, amount } = action.payload;
            if (draft.player.cash < amount) return;

            draft.player.cash -= amount;
            const capitalGained = amount / 10000;
            draft.player.politicalCapital[countryId] = (draft.player.politicalCapital[countryId] || 0) + capitalGained;
            addLog(draft, 'Politics', `Donated ${formatCurrency(amount)}, gained ${capitalGained.toFixed(2)} political capital.`);
            return;
        }
        
        case 'LOBBY': {
            const { countryId, industry } = action.payload;
            const cost = 100;
            const currentCapital = draft.player.politicalCapital[countryId] || 0;
            if (currentCapital < cost) return;

            draft.player.politicalCapital[countryId] -= cost;
            // Simplified effect: boost trend of related assets
            Object.values(draft.assets).forEach(asset => {
                if(asset.category === industry) {
                    asset.trend = Math.min(1, asset.trend + 0.1);
                }
            });
            addLog(draft, 'Politics', `Lobbied for ${industry} industry, costing ${cost} political capital.`);
            return;
        }

        case 'APPLY_IMMIGRATION': {
            const { countryId } = action.payload;
            const country = COUNTRIES[countryId];
            const isPermitHolder = draft.player.residencyPermits.includes(countryId);

            if (isPermitHolder) { // Moving
                draft.player.currentResidency = countryId;
                 addLog(draft, 'Politics', `Moved residency to ${country.name}.`);
            } else { // Applying
                if (draft.player.cash < country.immigrationCost) return;
                draft.player.cash -= country.immigrationCost;
                draft.player.residencyPermits.push(countryId);
                if (!draft.player.politicalCapital[countryId]) {
                    draft.player.politicalCapital[countryId] = 0;
                }
                addLog(draft, 'Politics', `Acquired residency permit for ${country.name}.`);
            }
            return;
        }

        case 'TAKE_LOAN': {
            const { amount } = action.payload;
            if (draft.player.loan.amount + amount > draft.player.loan.maxLoan) return;

            draft.player.loan.amount += amount;
            draft.player.cash += amount;
            addLog(draft, 'Bank', `Took out a loan for ${formatCurrency(amount)}.`);
            return;
        }

        case 'REPAY_LOAN': {
            const { amount } = action.payload;
            const repayAmount = Math.min(amount, draft.player.loan.amount, draft.player.cash);
            if (repayAmount <= 0) return;
            
            draft.player.cash -= repayAmount;
            draft.player.loan.amount -= repayAmount;
            addLog(draft, 'Bank', `Repaid ${formatCurrency(repayAmount)} of loan.`);
            return;
        }
    }
});

function formatCurrency(value: number): string {
     return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}
