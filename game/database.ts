import { GameState, Asset, Country, CompanyType } from './types';

export const COUNTRIES: { [id: string]: Country } = {
    USA: { id: 'USA', name: 'United States', taxRate: 0.25, companyCostModifier: 1.0, localMarkets: ['AAPL', 'GOOGL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'PFE', 'MRNA', 'JNJ', 'CAT', 'PG', 'NY_RealEstate'], immigrationCost: 10000000, parties: [{id: 'D', name: 'Democrats'}, {id: 'R', name: 'Republicans'}] },
    CHN: { id: 'CHN', name: 'China', taxRate: 0.20, companyCostModifier: 0.7, localMarkets: ['TCEHY', 'BABA'], immigrationCost: 15000000, parties: [{id: 'CCP', name: 'Communist Party'}] },
    DEU: { id: 'DEU', name: 'Germany', taxRate: 0.30, companyCostModifier: 1.2, localMarkets: ['VOW3', 'SIE'], immigrationCost: 8000000, parties: [{id: 'CDU', name: 'CDU/CSU'}, {id: 'SPD', name: 'SPD'}] },
    JPN: { id: 'JPN', name: 'Japan', taxRate: 0.28, companyCostModifier: 1.1, localMarkets: ['TM', 'TYO_RealEstate'], immigrationCost: 12000000, parties: [{id: 'LDP', name: 'Liberal Democratic Party'}] },
    IND: { id: 'IND', name: 'India', taxRate: 0.18, companyCostModifier: 0.6, localMarkets: ['TATA'], immigrationCost: 5000000, parties: [{id: 'BJP', name: 'Bharatiya Janata Party'}, {id: 'INC', name: 'Indian National Congress'}] },
    RUS: { id: 'RUS', name: 'Russia', taxRate: 0.15, companyCostModifier: 0.8, localMarkets: [], immigrationCost: 20000000, parties: [{id: 'UR', name: 'United Russia'}] },
    FRA: { id: 'FRA', name: 'France', taxRate: 0.32, companyCostModifier: 1.3, localMarkets: ['LVMH'], immigrationCost: 9000000, parties: [{id: 'RE', name: 'Renaissance'}, {id: 'RN', name: 'National Rally'}] },
    KOR: { id: 'KOR', name: 'South Korea', taxRate: 0.22, companyCostModifier: 0.9, localMarkets: ['SSNLF'], immigrationCost: 11000000, parties: [{id: 'DP', name: 'Democratic Party'}, {id: 'PPP', name: 'People Power Party'}] },
    NLD: { id: 'NLD', name: 'Netherlands', taxRate: 0.26, companyCostModifier: 1.2, localMarkets: ['ASML'], immigrationCost: 7000000, parties: [{id: 'VVD', name: 'VVD'}, {id: 'PVV', name: 'PVV'}] },
    CHE: { id: 'CHE', name: 'Switzerland', taxRate: 0.18, companyCostModifier: 1.5, localMarkets: ['ROG', 'NVS'], immigrationCost: 18000000, parties: [{id: 'SVP', name: 'Swiss People\'s Party'}] },
    CAN: { id: 'CAN', name: 'Canada', taxRate: 0.27, companyCostModifier: 1.0, localMarkets: ['VAN_RealEstate'], immigrationCost: 6000000, parties: [{id: 'LIB', name: 'Liberal Party'}, {id: 'CON', name: 'Conservative Party'}] },
    ARE: { id: 'ARE', name: 'UAE', taxRate: 0.09, companyCostModifier: 1.4, localMarkets: ['SAOC', 'DXB_RealEstate'], immigrationCost: 16000000, parties: [] },
};

export const COMPANY_TYPES: { [key in CompanyType]: { name: string, baseCost: number, baseIncome: number } } = {
    Tech: { name: 'Tech Startup', baseCost: 1500000, baseIncome: 75000 },
    Mining: { name: 'Mining Operation', baseCost: 2000000, baseIncome: 100000 },
    Pharma: { name: 'Pharma Lab', baseCost: 1800000, baseIncome: 90000 },
    Media: { name: 'Media Group', baseCost: 1000000, baseIncome: 50000 },
}

export const ASSETS: { [id: string]: Asset } = {
    // Commodities
    OIL: { id: 'OIL', name: 'Crude Oil', category: 'Commodity', price: 80, basePrice: 80, volatility: 0.03, trend: 0.0001, dna: { oilSupply: -2.0, middleEastTension: 1.5, globalStability: -0.8, usEconomy: 0.5, chinaEconomy: 0.6 } },
    GOLD: { id: 'GOLD', name: 'Gold', category: 'Commodity', price: 2300, basePrice: 2300, volatility: 0.015, trend: 0.0002, dna: { globalStability: -1.5, usFedPolicy: -1.2, publicSentiment: -1.0 } },
    SILVER: { id: 'SILVER', name: 'Silver', category: 'Commodity', price: 29, basePrice: 29, volatility: 0.025, trend: 0.0001, dna: { globalStability: -1.0, usFedPolicy: -0.8, industrial: 0.5 } },
    COPPER: { id: 'COPPER', name: 'Copper', category: 'Commodity', price: 4.5, basePrice: 4.5, volatility: 0.02, trend: 0.0003, dna: { globalSupplyChain: -0.7, techInnovation: 0.5, chinaEconomy: 1.2, climateChangeImpact: 0.8 } },
    PLATINUM: { id: 'PLATINUM', name: 'Platinum', category: 'Commodity', price: 1000, basePrice: 1000, volatility: 0.022, trend: 0.0001, dna: { globalStability: -0.5, industrial: 0.7, russiaEconomy: -0.5 } },

    // Tech
    AAPL: { id: 'AAPL', name: 'Apple Inc.', category: 'Tech', price: 190, basePrice: 190, volatility: 0.018, trend: 0.0005, dna: { usEconomy: 1.2, techInnovation: 0.8, globalSupplyChain: -0.6, chinaEconomy: 0.4, publicSentiment: 0.5 } },
    GOOGL: { id: 'GOOGL', name: 'Alphabet Inc.', category: 'Tech', price: 175, basePrice: 175, volatility: 0.017, trend: 0.0006, dna: { usEconomy: 1.0, techInnovation: 1.2, secRegulation: -0.7, publicSentiment: 0.6 } },
    NVDA: { id: 'NVDA', name: 'NVIDIA Corp.', category: 'Tech', price: 120, basePrice: 120, volatility: 0.035, trend: 0.001, dna: { techInnovation: 2.5, globalSupplyChain: -1.0, chinaEconomy: 0.5, usEconomy: 0.8 } },
    TSLA: { id: 'TSLA', name: 'Tesla, Inc.', category: 'Tech', price: 180, basePrice: 180, volatility: 0.04, trend: 0.0008, dna: { techInnovation: 1.0, oilSupply: 0.8, chinaEconomy: 0.7, publicSentiment: 1.5, secRegulation: -1.0 } },
    MSFT: { id: 'MSFT', name: 'Microsoft Corp.', category: 'Tech', price: 440, basePrice: 440, volatility: 0.015, trend: 0.0004, dna: { usEconomy: 1.3, techInnovation: 1.1, globalStability: 0.5 } },
    AMZN: { id: 'AMZN', name: 'Amazon.com, Inc.', category: 'Tech', price: 185, basePrice: 185, volatility: 0.019, trend: 0.0003, dna: { usEconomy: 1.5, publicSentiment: 0.8, globalSupplyChain: -0.4, usJobGrowth: 0.5 } },

    // Crypto
    BTC: { id: 'BTC', name: 'Bitcoin', category: 'Crypto', price: 68000, basePrice: 68000, volatility: 0.05, trend: 0.0007, dna: { usFedPolicy: -1.5, globalStability: -1.0, secRegulation: -2.0, publicSentiment: 1.8, techInnovation: 0.5 } },
    ETH: { id: 'ETH', name: 'Ethereum', category: 'Crypto', price: 3800, basePrice: 3800, volatility: 0.06, trend: 0.0008, dna: { usFedPolicy: -1.2, globalStability: -0.8, secRegulation: -1.8, publicSentiment: 1.5, techInnovation: 1.2 } },
    XRP: { id: 'XRP', name: 'Ripple', category: 'Crypto', price: 0.5, basePrice: 0.5, volatility: 0.08, trend: 0.0001, dna: { secRegulation: -3.0, publicSentiment: 2.0 } },
    SOL: { id: 'SOL', name: 'Solana', category: 'Crypto', price: 165, basePrice: 165, volatility: 0.09, trend: 0.0012, dna: { techInnovation: 1.5, publicSentiment: 1.8, globalStability: -0.5 } },
    ADA: { id: 'ADA', name: 'Cardano', category: 'Crypto', price: 0.45, basePrice: 0.45, volatility: 0.07, trend: 0.0005, dna: { techInnovation: 1.0, publicSentiment: 1.2 } },
    DOGE: { id: 'DOGE', name: 'Dogecoin', category: 'Crypto', price: 0.16, basePrice: 0.16, volatility: 0.15, trend: 0.0, dna: { publicSentiment: 3.0 } },
    SHIB: { id: 'SHIB', name: 'Shiba Inu', category: 'Crypto', price: 0.000025, basePrice: 0.000025, volatility: 0.20, trend: 0.0, dna: { publicSentiment: 3.5 } },

    // Pharma
    PFE: { id: 'PFE', name: 'Pfizer Inc.', category: 'Pharma', price: 28, basePrice: 28, volatility: 0.012, trend: 0.0001, dna: { pharmaDemand: 1.5, globalStability: 0.3 } },
    MRNA: { id: 'MRNA', name: 'Moderna, Inc.', category: 'Pharma', price: 150, basePrice: 150, volatility: 0.04, trend: 0.0002, dna: { pharmaDemand: 2.0, techInnovation: 0.8 } },
    JNJ: { id: 'JNJ', name: 'Johnson & Johnson', category: 'Pharma', price: 145, basePrice: 145, volatility: 0.01, trend: 0.0001, dna: { pharmaDemand: 1.0, globalStability: 0.5 } },
    ROG: { id: 'ROG', name: 'Roche Holding AG', category: 'Pharma', price: 250, basePrice: 250, volatility: 0.011, trend: 0.0002, dna: { pharmaDemand: 1.2, euEconomy: 0.8 } },
    NVS: { id: 'NVS', name: 'Novartis AG', category: 'Pharma', price: 105, basePrice: 105, volatility: 0.01, trend: 0.0001, dna: { pharmaDemand: 1.1, euEconomy: 0.7 } },
    AZN: { id: 'AZN', name: 'AstraZeneca PLC', category: 'Pharma', price: 79, basePrice: 79, volatility: 0.013, trend: 0.0001, dna: { pharmaDemand: 1.3, euEconomy: 0.5 } },

    // Real Estate
    NY_RealEstate: { id: 'NY_RealEstate', name: 'New York Real Estate', category: 'Real Estate', price: 1500, basePrice: 1500, volatility: 0.005, trend: 0.0003, dna: { usEconomy: 1.5, usFedPolicy: -2.0, globalStability: 0.8 } },
    VAN_RealEstate: { id: 'VAN_RealEstate', name: 'Vancouver Real Estate', category: 'Real Estate', price: 1200, basePrice: 1200, volatility: 0.006, trend: 0.0004, dna: { chinaEconomy: 1.2, asiaTensions: 1.0, globalStability: 0.5 } },
    DXB_RealEstate: { id: 'DXB_RealEstate', name: 'Dubai Real Estate', category: 'Real Estate', price: 1000, basePrice: 1000, volatility: 0.008, trend: 0.0005, dna: { middleEastTension: -1.0, globalStability: 1.2, oilSupply: 0.8 } },
    TYO_RealEstate: { id: 'TYO_RealEstate', name: 'Tokyo Real Estate', category: 'Real Estate', price: 1300, basePrice: 1300, volatility: 0.004, trend: 0.0002, dna: { japanEconomy: 1.8, globalStability: 0.7 } },

    // Global Stocks
    TCEHY: { id: 'TCEHY', name: 'Tencent Holdings', category: 'Global', price: 48, basePrice: 48, volatility: 0.025, trend: 0.0004, dna: { chinaEconomy: 1.8, asiaTensions: -1.0, secRegulation: -0.8 } },
    BABA: { id: 'BABA', name: 'Alibaba Group', category: 'Global', price: 80, basePrice: 80, volatility: 0.03, trend: 0.0003, dna: { chinaEconomy: 2.0, asiaTensions: -1.2, globalSupplyChain: 0.5 } },
    SAOC: { id: 'SAOC', name: 'Saudi Aramco', category: 'Global', price: 7.5, basePrice: 7.5, volatility: 0.015, trend: 0.0001, dna: { oilSupply: 1.5, middleEastTension: 1.0 } },
    TM: { id: 'TM', name: 'Toyota Motor Corp', category: 'Global', price: 200, basePrice: 200, volatility: 0.012, trend: 0.0002, dna: { japanEconomy: 1.2, globalSupplyChain: -0.8, oilSupply: -0.3 } },
    SSNLF: { id: 'SSNLF', name: 'Samsung Electronics', category: 'Global', price: 1500, basePrice: 1500, volatility: 0.02, trend: 0.0005, dna: { techInnovation: 1.0, globalSupplyChain: -1.2, asiaTensions: -0.8 } },
    LVMH: { id: 'LVMH', name: 'LVMH', category: 'Global', price: 780, basePrice: 780, volatility: 0.015, trend: 0.0003, dna: { euEconomy: 1.2, chinaEconomy: 0.8, publicSentiment: 0.7 } },
    ASML: { id: 'ASML', name: 'ASML Holding', category: 'Global', price: 1050, basePrice: 1050, volatility: 0.028, trend: 0.0009, dna: { techInnovation: 2.2, globalSupplyChain: -2.0, chinaEconomy: -1.0 } },
    VOW3: { id: 'VOW3', name: 'Volkswagen AG', category: 'Global', price: 120, basePrice: 120, volatility: 0.018, trend: 0.0001, dna: { euEconomy: 1.0, globalSupplyChain: -0.7, oilSupply: -0.5 } },
    TATA: { id: 'TATA', name: 'Tata Group', category: 'Global', price: 115, basePrice: 115, volatility: 0.02, trend: 0.0006, dna: { indiaEconomy: 2.0, globalStability: 0.5 } },

    // Industrial
    CAT: { id: 'CAT', name: 'Caterpillar Inc.', category: 'Industrial', price: 330, basePrice: 330, volatility: 0.014, trend: 0.0002, dna: { usEconomy: 1.3, globalSupplyChain: -0.5, usJobGrowth: 0.8 } },
    SIE: { id: 'SIE', name: 'Siemens AG', category: 'Industrial', price: 170, basePrice: 170, volatility: 0.013, trend: 0.0002, dna: { euEconomy: 1.5, globalSupplyChain: -0.6, techInnovation: 0.4 } },

    // Consumer
    PG: { id: 'PG', name: 'Procter & Gamble', category: 'Consumer', price: 168, basePrice: 168, volatility: 0.008, trend: 0.0001, dna: { usEconomy: 0.8, globalStability: 0.6, publicSentiment: 0.4 } },
    NEST: { id: 'NEST', name: 'Nestlé S.A.', category: 'Consumer', price: 102, basePrice: 102, volatility: 0.007, trend: 0.0001, dna: { euEconomy: 0.7, globalStability: 0.7 } },
};

export const getInitialState = (): GameState => ({
    player: {
        cash: 1000000,
        portfolio: {},
        marginPositions: {},
        companies: [],
        loan: { amount: 0, interestRate: 0.05, maxLoan: 100000 },
        currentResidency: '',
        residencyPermits: [],
        politicalCapital: {},
    },
    assets: JSON.parse(JSON.stringify(ASSETS)),
    date: { year: 2024, month: 1, day: 1, dayProgress: 0 },
    dailyNews: [{ id: '1', headline: 'Market opens for the new year!', date: { year: 2024, month: 1, day: 1, dayProgress: 0 }, isMajor: false }],
    majorEventHeadline: null,
    majorEventQueue: [],
    log: [],
    globalFactors: {
        globalStability: 0.5, usEconomy: 0.6, chinaEconomy: 0.7, euEconomy: 0.5, japanEconomy: 0.4, indiaEconomy: 0.6, russiaEconomy: 0.3,
        middleEastTension: 0.4, asiaTensions: 0.3, techInnovation: 0.6, globalSupplyChain: 0.7, oilSupply: 0.5, usFedPolicy: 0.5,
        secRegulation: 0.5, usJobGrowth: 0.6, publicSentiment: 0.5, climateChangeImpact: 0.2, pharmaDemand: 0.4,
        // FIX: Add 'industrial' to the initial state to align with the type definition.
        industrial: 0.5
    },
    gameSpeed: 1,
    isPaused: true, // Start paused for country selection
    hasStarted: false,
});
