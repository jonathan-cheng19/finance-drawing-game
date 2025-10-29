// Word pools for each round
export const WORD_POOLS = {
  1: [
    'budget',
    'debt',
    'credit card',
    'savings',
    'income',
    'expense',
    'loan',
    'interest',
    'bank',
    'cash',
    'wallet',
    'payment',
    'bill',
    'coin',
    'check'
  ],
  2: [
    'stock market',
    'emergency fund',
    'credit score',
    'mortgage',
    'investment',
    'inflation',
    'dividend',
    'retirement',
    'insurance',
    'tax',
    '401k',
    'pension',
    'bond',
    'deposit',
    'withdrawal'
  ],
  3: [
    'diversification',
    'compound interest',
    'asset allocation',
    'capital gains',
    'liquidity',
    'depreciation',
    'equity',
    'portfolio',
    'mutual fund',
    'volatility',
    'amortization',
    'appreciation',
    'net worth',
    'fiscal policy',
    'bull market'
  ]
};

// Configuration for each round
export const ROUND_CONFIG = {
  1: {
    timeLimit: 90, // seconds
    maxPoints: 1000,
    description: 'Basic Terms - 90 seconds'
  },
  2: {
    timeLimit: 75,
    maxPoints: 1500,
    description: 'Intermediate Terms - 75 seconds'
  },
  3: {
    timeLimit: 60,
    maxPoints: 2000,
    description: 'Advanced Terms - 60 seconds'
  }
};
