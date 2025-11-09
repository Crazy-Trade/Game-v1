import { GameState, GameAction, Asset, PortfolioItem, GlobalFactor, GameEvent, LogEntry, MarginPosition, Company, CompanyType, NewsItem } from './types';
import { ASSETS, COMPANY_TYPES, COUNTRIES } from './database';

// --- Helper Functions ---
function addLog(log: LogEntry[], message: string, type: LogEntry['type']): LogEntry[] {
    const newLogEntry: LogEntry = {
        id: Date.now().toString() + Math.random().toString(),
        date: { year: 0, month: 0, day: 0, dayProgress: 0 }, // Will be replaced by current game date
        message,
        type,
    };
    return [newLogEntry, ...log].slice(0, 100); // Keep log size manageable
}

function calculateLiquidationPrice(entryPrice: number, leverage: number, isShort: boolean): number {
    const marginFraction = 1 / leverage;
    if (isShort) {
        // For shorts, liquidation happens if price goes UP
        return entryPrice * (1 + marginFraction);
    } else {
        // For longs, liquidation happens if price goes DOWN
        return entryPrice * (1 - marginFraction);
    }
}

// --- Core Game Logic Sub-functions ---

function applyIntradayNoise(assets: { [id: string]: Asset }, deltaTime: number, gameSpeed: number): { [id: string]: Asset } {
    const newAssets = { ...assets };
    // Apply noise less frequently for visual stability
    const noiseFactor = (deltaTime * gameSpeed) / 1000; // a factor based on time passed

    for (const assetId in newAssets) {
        const asset = { ...newAssets[assetId] };
        // Volatility is a daily concept, so scale it down significantly
        // Cryptos are more volatile intraday
        const intradayVolatilityFactor = asset.category === 'Crypto' ? 0.2 : 0.05;
        const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
        const change = randomFactor * asset.volatility * intradayVolatilityFactor * noiseFactor;
        
        asset.price = Math.max(0.000001, asset.price * (1 + change));
        newAssets[assetId] = asset;
    }
    return newAssets;
}

function checkLiquidations(state: GameState): GameState {
    let newState = { ...state };
    let player = { ...newState.player };
    let newLog = [...newState.log];

    for (const assetId in player.marginPositions) {
        const position = player.marginPositions[assetId];
        const asset = newState.assets[assetId];
        
        let shouldLiquidate = false;
        if (position.isShort && asset.price >= position.liquidationPrice) {
            shouldLiquidate = true;
        } else if (!position.isShort && asset.price <= position.liquidationPrice) {
            shouldLiquidate = true;
        }

        if (shouldLiquidate) {
            const loss = position.initialMargin; // Total loss of initial margin
            player = {
                ...player,
                cash: player.cash - loss,
                marginPositions: { ...player.marginPositions }
            };
            delete player.marginPositions[assetId];
            newLog = addLog(newLog, `POSITION LIQUIDATED: ${position.quantity} of ${asset.name}. Loss: $${loss.toFixed(2)}`, 'Margin');
        }
    }

    return { ...newState, player, log: newLog };
}

function processNextDay(state: GameState): GameState {
    let newState = { ...state };
    let { player, globalFactors, log } = newState;
    
    // 1. Generate Events (simple placeholder logic)
    if (Math.random() < 0.1) { // 10% chance of a major event
        const factorKeys = Object.keys(globalFactors) as GlobalFactor[];
        const randomFactor = factorKeys[Math.floor(Math.random() * factorKeys.length)];
        const change = (Math.random() - 0.5) * 0.2; // -0.1 to 0.1 change
        const newEvent: GameEvent = {
            id: `evt_${Date.now()}`,
            title: `Major Shift in ${randomFactor}`,
            description: `Reports indicate a significant and unexpected shift in ${randomFactor}, causing market jitters. The new value is ${(globalFactors[randomFactor] + change).toFixed(2)}.`,
            effects: { [randomFactor]: change }
        };
        newState.majorEventQueue = [...newState.majorEventQueue, newEvent];
        const headline: NewsItem = {
            id: `news_${Date.now()}`,
            headline: newEvent.title,
            date: newState.date,
            isMajor: true,
        };
        newState.majorEventHeadline = headline;
        log = addLog(log, `Major Event: ${newEvent.title}`, 'System');
    }
    
    // 2. Update Global Factors based on events or random drift
    for(const factor in globalFactors) {
        globalFactors[factor as GlobalFactor] += (Math.random() - 0.5) * 0.05; // small daily drift
        globalFactors[factor as GlobalFactor] = Math.max(0, Math.min(1, globalFactors[factor as GlobalFactor])); // Clamp between 0 and 1
    }

    // 3. updateAllPrices (The Interday Jump)
    let newAssets = { ...newState.assets };
    for (const assetId in newAssets) {
        const asset = { ...newAssets[assetId] };
        let dnaChange = 0;
        for (const factor in asset.dna) {
            const sensitivity = asset.dna[factor as GlobalFactor] || 0;
            const factorValue = globalFactors[factor as GlobalFactor];
            // Simple model: change is proportional to sensitivity and factor's deviation from 0.5 (neutral)
            dnaChange += sensitivity * (factorValue - 0.5);
        }
        
        const randomShock = (Math.random() - 0.5) * asset.volatility * 0.5; // Bigger nightly random shock
        const totalChangePercent = (dnaChange / 50) + asset.trend + randomShock; // Scaled DNA change
        
        asset.basePrice = Math.max(0.000001, asset.basePrice * (1 + totalChangePercent));
        asset.price = asset.basePrice;
        newAssets[assetId] = asset;
    }
    newState.assets = newAssets;

    // 4. Monthly Updates (if it's the 1st of the month)
    if (newState.date.day === 1) {
        // Company Income
        player.companies.forEach(company => {
            if (!company.effects?.incomeFrozenUntil || isDatePast(newState.date, company.effects.incomeFrozenUntil)) {
                 player.cash += company.monthlyIncome;
                 log = addLog(log, `${company.name} generated $${company.monthlyIncome.toFixed(2)} in income.`, 'Corporate');
            } else {
                 log = addLog(log, `${company.name} income is frozen this month.`, 'Corporate');
            }
        });
        
        // Loan Interest
        if (player.loan.amount > 0) {
            const monthlyInterest = player.loan.amount * (player.loan.interestRate / 12);
            player.cash -= monthlyInterest;
            log = addLog(log, `Paid $${monthlyInterest.toFixed(2)} in loan interest.`, 'Bank');
        }
    }
    
    // 5. Advance Date
    const newDate = new Date(newState.date.year, newState.date.month - 1, newState.date.day);
    newDate.setDate(newDate.getDate() + 1);
    
    return {
        ...newState,
        player,
        log,
        date: {
            ...newState.date,
            year: newDate.getFullYear(),
            month: newDate.getMonth() + 1,
            day: newDate.getDate(),
            dayProgress: 0,
        },
    };
}

function isDatePast(currentDate: GameState['date'], targetDate: GameState['date']): boolean {
    if (currentDate.year > targetDate.year) return true;
    if (currentDate.year === targetDate.year && currentDate.month > targetDate.month) return true;
    if (currentDate.year === targetDate.year && currentDate.month === targetDate.month && currentDate.day >= targetDate.day) return true;
    return false;
}

// --- The Main Reducer ---

export const gameReducer = (state: GameState, action: GameAction): GameState => {
    let newState = { ...state };
    let player = { ...newState.player };
    let log = [...newState.log];

    // Add current game date to all new log entries
    log = log.map(l => l.date.year === 0 ? { ...l, date: state.date } : l);

    switch (action.type) {
        case 'TICK': {
            if (state.isPaused || !state.hasStarted) return state;

            const DAY_DURATION_MS = 120 * 1000; // 2 minutes per day at 1x speed
            let newDayProgress = state.date.dayProgress + (action.payload.deltaTime / DAY_DURATION_MS);

            if (newDayProgress >= 1) {
                return processNextDay(state);
            }

            let tickState = { ...state };
            tickState.assets = applyIntradayNoise(tickState.assets, action.payload.deltaTime, state.gameSpeed);
            tickState = checkLiquidations(tickState);
            tickState.date.dayProgress = newDayProgress;

            return tickState;
        }

        case 'PAUSE_GAME':
            return { ...state, isPaused: true };

        case 'RESUME_GAME':
            return { ...state, isPaused: false };

        case 'SET_SPEED':
            return { ...state, gameSpeed: action.payload };

        case 'NEXT_DAY':
            return processNextDay(state);

        case 'START_GAME': {
            const countryId = action.payload.countryId;
            player.currentResidency = countryId;
            player.residencyPermits = [countryId];
            Object.values(COUNTRIES).forEach(c => {
                player.politicalCapital[c.id] = 0;
            });
            log = addLog(log, `Game started. Residency established in ${COUNTRIES[countryId].name}.`, 'System');
            return { ...state, player, hasStarted: true, isPaused: false, log };
        }
        
        case 'EXECUTE_TRADE': {
            const { assetId, quantity, price, isBuy } = action.payload;
            const totalCost = quantity * price;
            const portfolioItem = player.portfolio[assetId] || { assetId, quantity: 0, avgCost: 0 };

            if (isBuy) {
                if (player.cash < totalCost) {
                    log = addLog(log, 'Trade failed: Insufficient funds.', 'System');
                    return { ...state, log };
                }
                player.cash -= totalCost;
                const newTotalQuantity = portfolioItem.quantity + quantity;
                const newAvgCost = ((portfolioItem.avgCost * portfolioItem.quantity) + totalCost) / newTotalQuantity;
                player.portfolio[assetId] = { ...portfolioItem, quantity: newTotalQuantity, avgCost: newAvgCost };
                log = addLog(log, `Bought ${quantity} of ${assetId} @ $${price.toFixed(2)}`, 'Trade');
            } else {
                if (portfolioItem.quantity < quantity) {
                    log = addLog(log, 'Trade failed: Not enough assets to sell.', 'System');
                    return { ...state, log };
                }
                player.cash += totalCost;
                portfolioItem.quantity -= quantity;
                if (portfolioItem.quantity <= 0) {
                    delete player.portfolio[assetId];
                } else {
                    player.portfolio[assetId] = portfolioItem;
                }
                log = addLog(log, `Sold ${quantity} of ${assetId} @ $${price.toFixed(2)}`, 'Trade');
            }
            return { ...state, player, log };
        }
        
        case 'OPEN_MARGIN_POSITION': {
            const { assetId, quantity, price, leverage, isShort } = action.payload;
            const totalValue = quantity * price;
            const initialMargin = totalValue / leverage;

            if(player.cash < initialMargin) {
                log = addLog(log, `Margin trade failed: Insufficient cash for margin requirement of $${initialMargin.toFixed(2)}.`, 'Margin');
                return {...state, log };
            }

            player.cash -= initialMargin;
            const newPosition: MarginPosition = {
                assetId,
                quantity,
                entryPrice: price,
                leverage,
                isShort,
                liquidationPrice: calculateLiquidationPrice(price, leverage, isShort),
                initialMargin,
            };
            player.marginPositions[assetId] = newPosition;
            log = addLog(log, `Opened ${isShort ? 'SHORT' : 'LONG'} position on ${assetId} with x${leverage} leverage.`, 'Margin');
            return {...state, player, log};
        }

        case 'ESTABLISH_COMPANY': {
            const { companyType, name } = action.payload;
            const typeData = COMPANY_TYPES[companyType];
            const countryModifier = COUNTRIES[player.currentResidency].companyCostModifier;
            const cost = typeData.baseCost * countryModifier;

            if (player.cash < cost) {
                log = addLog(log, 'Failed to establish company: Insufficient funds.', 'Corporate');
                return { ...state, log };
            }
            player.cash -= cost;
            const newCompany: Company = {
                id: `comp_${Date.now()}`,
                name: name || `${typeData.name} #${player.companies.length + 1}`,
                type: companyType,
                level: 1,
                monthlyIncome: typeData.baseIncome,
                upgradeCost: typeData.baseCost * 1.5,
            };
            player.companies.push(newCompany);
            log = addLog(log, `Established ${newCompany.name} for $${cost.toFixed(2)}.`, 'Corporate');
            return { ...state, player, log };
        }

        case 'UPGRADE_COMPANY': {
            const companyIndex = player.companies.findIndex(c => c.id === action.payload.companyId);
            if (companyIndex === -1) return state;
            
            const company = { ...player.companies[companyIndex] };
            if(player.cash < company.upgradeCost) {
                log = addLog(log, `Upgrade failed for ${company.name}: Insufficient funds.`, 'Corporate');
                return { ...state, log };
            }
            
            player.cash -= company.upgradeCost;
            
            const outcome = Math.random();
            if(outcome < 0.05) { // 5% chance of complication
                const extraCost = company.upgradeCost * 0.1;
                player.cash -= extraCost;
                 const nextMonth = new Date(state.date.year, state.date.month, state.date.day); // month is 0-indexed, so state.date.month is already next month
                company.effects = { incomeFrozenUntil: { year: nextMonth.getFullYear(), month: nextMonth.getMonth()+1, day: nextMonth.getDate(), dayProgress: 0 }};
                log = addLog(log, `COMPLICATION! Upgrade for ${company.name} had issues. Extra cost: $${extraCost.toFixed(2)} and income is frozen for 1 month.`, 'Corporate');
            } else if (outcome < 0.15) { // 10% chance of breakthrough (5% + 10%)
                company.level += 2;
                const costRefund = company.upgradeCost * 0.5;
                player.cash += costRefund;
                 log = addLog(log, `BREAKTHROUGH! ${company.name} upgrade was a massive success! Leveled up to ${company.level} and refunded $${costRefund.toFixed(2)}!`, 'Corporate');
            } else { // Normal success
                company.level += 1;
                log = addLog(log, `Successfully upgraded ${company.name} to Level ${company.level}.`, 'Corporate');
            }

            const typeData = COMPANY_TYPES[company.type];
            company.monthlyIncome = typeData.baseIncome * company.level * (1 + (company.level-1)*0.1); // scaling income
            company.upgradeCost = typeData.baseCost * Math.pow(1.5, company.level); // exponential cost
            
            player.companies[companyIndex] = company;

            return { ...state, player, log };
        }

        case 'TAKE_LOAN': {
            const amount = action.payload.amount;
            if (player.loan.amount + amount > player.loan.maxLoan) {
                log = addLog(log, 'Failed to take loan: Exceeds maximum loan amount.', 'Bank');
                return {...state, log};
            }
            player.cash += amount;
            player.loan.amount += amount;
            log = addLog(log, `Took a loan of $${amount.toFixed(2)}.`, 'Bank');
            return {...state, player, log};
        }

        case 'REPAY_LOAN': {
            let amount = action.payload.amount;
            if(amount > player.cash) amount = player.cash;
            if(amount > player.loan.amount) amount = player.loan.amount;

            if(amount <= 0) return state;

            player.cash -= amount;
            player.loan.amount -= amount;
            log = addLog(log, `Repaid $${amount.toFixed(2)} of loan.`, 'Bank');
            return {...state, player, log};
        }

        case 'APPLY_IMMIGRATION': {
            const { countryId } = action.payload;
            const cost = COUNTRIES[countryId].immigrationCost;
            if (player.cash < cost) {
                log = addLog(log, `Immigration to ${COUNTRIES[countryId].name} failed: Insufficient funds.`, 'Politics');
                return {...state, log};
            }
            player.cash -= cost;
            player.currentResidency = countryId;
            if(!player.residencyPermits.includes(countryId)) {
                player.residencyPermits.push(countryId);
            }
            log = addLog(log, `Successfully immigrated to ${COUNTRIES[countryId].name}.`, 'Politics');
            return {...state, player, log};
        }

        case 'DONATE_TO_PARTY': {
            const { countryId, amount } = action.payload;
            if (player.cash < amount) {
                log = addLog(log, `Donation failed: Insufficient funds.`, 'Politics');
                return {...state, log};
            }
            player.cash -= amount;
            // Simple conversion: $10,000 = 1 Political Capital
            const capitalGained = amount / 10000;
            player.politicalCapital[countryId] = (player.politicalCapital[countryId] || 0) + capitalGained;
            log = addLog(log, `Donated $${amount.toFixed(2)} gaining ${capitalGained.toFixed(2)} political capital in ${COUNTRIES[countryId].name}.`, 'Politics');
            return {...state, player, log};
        }

        case 'LOBBY': {
            // Placeholder for a more complex system
            const { countryId, industry } = action.payload;
            const cost = 100; // Political capital cost
            if((player.politicalCapital[countryId] || 0) < cost) {
                log = addLog(log, `Lobbying for ${industry} failed: Insufficient political capital.`, 'Politics');
                return {...state, log};
            }
            player.politicalCapital[countryId] -= cost;
            log = addLog(log, `Spent ${cost} political capital lobbying for the ${industry} industry in ${COUNTRIES[countryId].name}.`, 'Politics');
            // This is where you would trigger a positive event for that industry
            return {...state, player, log};
        }

        case 'DISMISS_EVENT_POPUP': {
            const [dismissedEvent, ...remainingQueue] = state.majorEventQueue;
            let newGlobalFactors = { ...state.globalFactors };
            if(dismissedEvent?.effects) {
                for(const key in dismissedEvent.effects) {
                    const factor = key as GlobalFactor;
                    const change = dismissedEvent.effects[factor]!;
                    newGlobalFactors[factor] = Math.max(0, Math.min(1, newGlobalFactors[factor] + change));
                }
            }
            return { ...state, majorEventQueue: remainingQueue, globalFactors: newGlobalFactors };
        }

        default:
            return state;
    }
};
