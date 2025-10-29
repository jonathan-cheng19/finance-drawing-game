// Alliterative finance-related team names
const TEAM_NAMES = [
  'Budget Bandits',
  'Cash Crusaders',
  'Dividend Dynamos',
  'Equity Eagles',
  'Finance Falcons',
  'Growth Gurus',
  'Investment Interns',
  'Penny Pinchers',
  'Savings Savants',
  'Trading Titans',
  'Wealth Wizards',
  'Asset Avengers',
  'Capital Commanders',
  'Debt Destroyers',
  'Market Mavericks',
  'Portfolio Pirates',
  'Revenue Rangers',
  'Stock Sharks',
  'Tax Tacticians',
  'Value Victors',
  'Bullish Buffalos',
  'Compound Crusaders',
  'Diversified Dragons',
  'Economic Experts',
  'Fiscal Falcons',
  'Hedge Heroes',
  'Liquidity Legends',
  'Money Makers',
  'Net Worth Ninjas',
  'Profit Prophets'
];

// Track used team names per session to avoid duplicates
const usedNames = new Set();

export function generateTeamName() {
  // Get available names
  const availableNames = TEAM_NAMES.filter(name => !usedNames.has(name));

  // If all names used, reset
  if (availableNames.length === 0) {
    usedNames.clear();
    return generateTeamName();
  }

  // Select random name
  const name = availableNames[Math.floor(Math.random() * availableNames.length)];
  usedNames.add(name);

  return name;
}

export function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

export function resetTeamNames() {
  usedNames.clear();
}
