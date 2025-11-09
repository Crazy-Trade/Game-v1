export type AssetCategory = 'Commodity' | 'Tech' | 'Crypto' | 'Pharma' | 'Real Estate' | 'Global' | 'Industrial' | 'Consumer';

export interface Asset {
    id: string;
    name: string;
    category: AssetCategory;
    price: number;
    basePrice: number; // The price at the start of the day
    volatility: number;
    trend: number; // A slight long-term drift
    dna: { [key in GlobalFactor]?: number }; // Sensitivity to global factors
}

export interface PortfolioItem {
    assetId: string;
    quantity: number;
    avgCost: number;
}

export interface MarginPosition {
    assetId: string;
    quantity: number;
    entryPrice: number;
    leverage: number;
    isShort: boolean; // true for short, false for long
    liquidationPrice: number;
    initialMargin: number;
}

export type CompanyType = 'Tech' | 'Mining' | 'Pharma' | 'Media';
export interface Company {
    id: string;
    name: string;
    type: CompanyType;
    level: number;
    monthlyIncome: number;
    upgradeCost: number;
    effects?: {
        incomeFrozenUntil?: GameDate;
    };
}

export interface Loan {
    amount: number;
    interestRate: number; // Annual interest rate
    maxLoan: number;
}

export interface Player {
    cash: number;
    portfolio: { [assetId: string]: PortfolioItem };
    marginPositions: { [assetId: string]: MarginPosition };
    companies: Company[];
    loan: Loan;
    currentResidency: string; // Country ID
    residencyPermits: string[]; // List of owned permits
    politicalCapital: { [countryId: string]: number };
}

export interface GameDate {
    year: number;
    month: number;
    day: number;
    dayProgress: number; // 0-1 progress for the current day
}

export interface NewsItem {
    id: string;
    headline: string;
    date: GameDate;
    isMajor: boolean;
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    effects: { [key in GlobalFactor]?: number }; // e.g. { globalStability: -0.1 }
}

export type LogType = 'Trade' | 'Corporate' | 'System' | 'Margin' | 'Politics' | 'Bank';
export interface LogEntry {
    id: string;
    date: GameDate;
    message: string;
    type: LogType;
}

export type GlobalFactor =
    | 'globalStability' | 'usEconomy' | 'chinaEconomy' | 'euEconomy' | 'japanEconomy' | 'indiaEconomy' | 'russiaEconomy'
    | 'middleEastTension' | 'asiaTensions' | 'techInnovation' | 'globalSupplyChain' | 'oilSupply' | 'usFedPolicy'
    | 'secRegulation' | 'usJobGrowth' | 'publicSentiment' | 'climateChangeImpact' | 'pharmaDemand'
    // FIX: Added 'industrial' to the list of global factors.
    | 'industrial';

export interface GameState {
    player: Player;
    assets: { [assetId: string]: Asset };
    date: GameDate;
    dailyNews: NewsItem[]; // For the ticker
    majorEventHeadline: NewsItem | null;
    majorEventQueue: GameEvent[]; // Pop-up events
    log: LogEntry[];
    globalFactors: { [key in GlobalFactor]: number };
    gameSpeed: number; // 1, 2, 5, 10, etc.
    isPaused: boolean;
    hasStarted: boolean;
}

export interface Country {
    id: string;
    name: string;
    taxRate: number;
    companyCostModifier: number;
    localMarkets: string[]; // Asset IDs
    immigrationCost: number;
    parties: { id: string; name: string }[];
}

export type ModalType =
  | { type: 'None' }
  | { type: 'CountrySelection' }
  | { type: 'Trade'; assetId: string }
  | { type: 'Order'; assetId: string }
  | { type: 'Company' }
  | { type: 'UpgradeCompany'; companyId: string }
  | { type: 'Politics' }
  | { type: 'Immigration' }
  | { type: 'EventPopup'; event: GameEvent };

// This will be our main action type for the reducer
export type GameAction =
    | { type: 'TICK'; payload: { deltaTime: number } }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESUME_GAME' }
    | { type: 'SET_SPEED'; payload: number }
    | { type: 'NEXT_DAY' }
    | { type: 'START_GAME'; payload: { countryId: string } }
    | { type: 'EXECUTE_TRADE'; payload: { assetId: string; quantity: number; price: number; isBuy: boolean } }
    | { type: 'OPEN_MARGIN_POSITION'; payload: { assetId: string; quantity: number; price: number; leverage: number; isShort: boolean } }
    | { type: 'ESTABLISH_COMPANY'; payload: { companyType: CompanyType, name: string } }
    | { type: 'UPGRADE_COMPANY'; payload: { companyId: string } }
    | { type: 'TAKE_LOAN'; payload: { amount: number } }
    | { type: 'REPAY_LOAN'; payload: { amount: number } }
    | { type: 'APPLY_IMMIGRATION'; payload: { countryId: string } }
    | { type: 'DONATE_TO_PARTY'; payload: { countryId: string, partyId: string, amount: number } }
    | { type: 'LOBBY'; payload: { countryId: string, industry: AssetCategory } }
    | { type: 'DISMISS_EVENT_POPUP' };
