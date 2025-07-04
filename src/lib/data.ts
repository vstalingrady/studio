
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export async function getLoginHistory(userId: string) {
  const historyCollection = collection(db, 'users', userId, 'login_history');
  const q = query(historyCollection, orderBy('timestamp', 'desc'), limit(10));
  const querySnapshot = await getDocs(q);
  const history = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return history;
}

export type CryptoHolding = {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number; // in IDR
  logoUrl: string;
}

export type Account = {
  id: string;
  name: string;
  type: 'bank' | 'e-wallet' | 'investment' | 'loan';
  balance: number;
  accountNumber: string;
  holdings?: CryptoHolding[];
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  accountId: string;
};

export type VaultMember = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Vault = {
  id: string;
  name: string;
  icon: string;
  currentAmount: number;
  targetAmount: number;
  sourceAccountIds: string[];
  destinationAccountId: string;
  autoSaveEnabled?: boolean;
  autoSaveFrequency?: 'daily' | 'weekly' | 'monthly';
  autoSaveAmount?: number;
  roundUpEnabled?: boolean;
  isShared?: boolean;
  members?: VaultMember[];
  imageUrl?: string;
};

export type Beneficiary = {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
};

export type Budget = {
  id: string;
  name: string;
  category: string;
  amount: number;
  startDate: string; // "YYYY-MM-DD"
  endDate: string; // "YYYY-MM-DD"
};

export type FinancialInstitution = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  type: 'bank' | 'e-wallet' | 'other';
};

export const financialInstitutions: FinancialInstitution[] = [
  // Major National Banks
  { id: 'bca', slug: 'bca', name: 'BCA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia_logo.svg', type: 'bank' },
  { id: 'mandiri', slug: 'mandiri', name: 'Mandiri', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo.svg', type: 'bank' },
  { id: 'bri', slug: 'bri', name: 'BRI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg', type: 'bank' },
  { id: 'bni', slug: 'bni', name: 'BNI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/55/BNI_logo.svg', type: 'bank' },
  { id: 'cimb', slug: 'cimb', name: 'CIMB Niaga', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/CIMB_Niaga_logo.svg', type: 'bank' },
  { id: 'permata', slug: 'permata', name: 'Permata Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/a/a0/PermataBank_logo.svg/2560px-PermataBank_logo.svg.png', type: 'bank' },
  { id: 'danamon', slug: 'danamon', name: 'Bank Danamon', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Danamon_logo.svg/2560px-Danamon_logo.svg.png', type: 'bank' },

  // E-Wallets
  { id: 'gopay', slug: 'gopay', name: 'GoPay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg', type: 'e-wallet' },
  { id: 'ovo', slug: 'ovo', name: 'OVO', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg', type: 'e-wallet' },
  { id: 'dana', slug: 'dana', name: 'DANA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_DANA_blue.svg', type: 'e-wallet' },
  { id: 'shopeepay', slug: 'shopeepay', name: 'ShopeePay', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/ShopeePay_logo.svg/2560px-ShopeePay_logo.svg.png', type: 'e-wallet' },
  { id: 'linkaja', slug: 'linkaja', name: 'LinkAja', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/LinkAja.svg/2560px-LinkAja.svg.png', type: 'e-wallet' },

  // Other Supported Banks
  { id: 'bsi', slug: 'bsi', name: 'BSI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/2560px-Bank_Syariah_Indonesia.svg.png', type: 'bank' },
  { id: 'btn', slug: 'btn', name: 'BTN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Bank_Tabungan_Negara_logo.svg/2560px-Bank_Tabungan_Negara_logo.svg.png', type: 'bank' },
  { id: 'ocbc', slug: 'ocbc', name: 'OCBC NISP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/OCBC_NISP_logo.svg/2560px-OCBC_NISP_logo.svg.png', type: 'bank' },
  { id: 'panin', slug: 'panin', name: 'Panin Bank', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Panin_Bank_logo.svg/2560px-Panin_Bank_logo.svg.png', type: 'bank' },
  { id: 'dbs', slug: 'dbs', name: 'DBS Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/DBS_Bank_logo.svg/2560px-DBS_Bank_logo.svg.png', type: 'bank' },
  { id: 'uob', slug: 'uob', name: 'UOB Indonesia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/UOB_Logo.svg/1280px-UOB_Logo.svg.png', type: 'bank' },
  { id: 'maybank', slug: 'maybank', name: 'Maybank', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Maybank_logo.svg/2560px-Maybank_logo.svg.png', type: 'bank' },
  { id: 'sinarmas', slug: 'sinarmas', name: 'Bank Sinarmas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bank-sinarmas-logo.svg/2560px-Bank-sinarmas-logo.svg.png', type: 'bank' },
  { id: 'mega', slug: 'mega', name: 'Bank Mega', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Logo_Bank_Mega.svg/2560px-Logo_Bank_Mega.svg.png', type: 'bank' },
  { id: 'jenius', slug: 'jenius', name: 'Jenius', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Jenius-logo.svg/2560px-Jenius-logo.svg.png', type: 'bank' },
  
  // Mobile Credit & Data
  { id: 'telkomsel', slug: 'telkomsel', name: 'Telkomsel', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Telkomsel_2021_icon.svg/1024px-Telkomsel_2021_icon.svg.png', type: 'other' },
  { id: 'indosat', slug: 'indosat', name: 'Indosat', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Indosat_Ooredoo_Hutchison_logo.svg/2560px-Indosat_Ooredoo_Hutchison_logo.svg.png', type: 'other' },
  { id: 'xl-axiata', slug: 'xl-axiata', name: 'XL Axiata', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/XL_logo_2016.svg/2560px-XL_logo_2016.svg.png', type: 'other' },
  { id: 'smartfren', slug: 'smartfren', name: 'Smartfren', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Smartfren_logo.svg/2560px-Smartfren_logo.svg.png', type: 'other' },

  // Utilities
  { id: 'pln', slug: 'pln', name: 'PLN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Logo_PLN.svg', type: 'other' },
  { id: 'indihome', slug: 'indihome', name: 'IndiHome', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/IndiHome_2023.svg', type: 'other' },
  { id: 'first-media', slug: 'first-media', name: 'First Media', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/First_Media_logo.svg/2560px-First_Media_logo.svg.png', type: 'other' },
  { id: 'biznet', slug: 'biznet', name: 'Biznet', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Biznet_logo.svg/2560px-Biznet_logo.svg.png', type: 'other' },

  // Government
  { id: 'bpjs', slug: 'bpjs', name: 'BPJS Kesehatan', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/BPJS_Kesehatan_logo.svg', type: 'other' },

  // Multifinance
  { id: 'adira', slug: 'adira', name: 'Adira Finance', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Adira_Finance_logo.svg/1280px-Adira_Finance_logo.svg.png', type: 'other' },
  { id: 'kredivo', slug: 'kredivo', name: 'Kredivo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kredivo_logo.svg/2560px-Kredivo_logo.svg.png', type: 'other' },

  // E-Commerce & Transport
  { id: 'shopee', slug: 'shopee', name: 'Shopee', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Shopee.svg/1200px-Shopee.svg.png', type: 'other' },
  { id: 'traveloka', slug: 'traveloka', name: 'Traveloka', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/d/d7/Traveloka_Primary_Logo.svg/2560px-Traveloka_Primary_Logo.svg.png', type: 'other' },
  { id: 'kai', slug: 'kai', name: 'KAI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Logo_KAI_Commuter_2020.svg/1024px-Logo_KAI_Commuter_2020.svg.png', type: 'other' },
  
  // Game & Digital Vouchers
  { id: 'google-play', slug: 'google-play', name: 'Google Play', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Google_Play_2022_logo.svg/2560px-Google_Play_2022_logo.svg.png', type: 'other' },
  { id: 'spotify', slug: 'spotify', name: 'Spotify', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/2560px-Spotify_logo_with_text.svg.png', type: 'other' },
  { id: 'steam', slug: 'steam', name: 'Steam', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png', type: 'other' },
];


export const accounts: Account[] = [
  {
    id: 'bca1',
    name: 'BCA Main Account',
    type: 'bank',
    balance: 85200501,
    accountNumber: '479988776623',
  },
  {
    id: 'gopay1',
    name: 'GoPay',
    type: 'e-wallet',
    balance: 1068000,
    accountNumber: '081234560812',
  },
  {
    id: 'ovo1',
    name: 'OVO Premier',
    type: 'e-wallet',
    balance: 310001,
    accountNumber: '085711227829',
  },
  {
    id: 'bibit1',
    name: 'Bibit Portfolio',
    type: 'investment',
    balance: 125000000,
    accountNumber: 'Invst'
  },
  {
    id: 'pintu1',
    name: 'Pintu Crypto',
    type: 'investment',
    balance: 75000000,
    accountNumber: 'Crpto',
    holdings: [
      { id: 'btc', name: 'Bitcoin', symbol: 'BTC', amount: 0.65, value: 45000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'eth', name: 'Ethereum', symbol: 'ETH', amount: 5, value: 25000000, logoUrl: 'https://placehold.co/48x48.png' },
      { id: 'sol', name: 'Solana', symbol: 'SOL', amount: 50, value: 5000000, logoUrl: 'https://placehold.co/48x48.png' },
    ]
  },
  {
    id: 'kredivo1',
    name: 'Kredivo PayLater',
    type: 'loan',
    balance: 5500000, // Represents outstanding debt
    accountNumber: 'Loan'
  }
];

export const beneficiaries: Beneficiary[] = [
  {
    id: 'ben1',
    name: 'Budi Santoso',
    bankName: 'BCA',
    accountNumber: '1234567890',
  },
  {
    id: 'ben2',
    name: 'John Smith',
    bankName: 'Mandiri',
    accountNumber: '0987654321',
  },
  {
    id: 'ben3',
    name: 'Mom',
    bankName: 'BNI',
    accountNumber: '1122334455',
  },
];

export const vaults: Vault[] = [
  {
    id: 'vault1',
    name: 'Emergency Fund',
    icon: 'Emergency',
    currentAmount: 2000000,
    targetAmount: 50000000,
    sourceAccountIds: ['bca1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: true,
    autoSaveFrequency: 'weekly',
    autoSaveAmount: 250000,
    roundUpEnabled: true,
  },
  {
    id: 'vault2',
    name: 'Bali Holiday',
    icon: 'Holiday',
    currentAmount: 3200000,
    targetAmount: 15000000,
    sourceAccountIds: ['gopay1', 'ovo1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: false,
  },
   {
    id: 'vault3',
    name: 'New Phone',
    icon: 'New Gadget',
    currentAmount: 850000,
    targetAmount: 25000000,
    sourceAccountIds: ['bca1', 'gopay1'],
    destinationAccountId: 'bca1',
    autoSaveEnabled: true,
    autoSaveFrequency: 'monthly',
    autoSaveAmount: 1000000,
  },
  {
    id: 'vault4',
    name: 'Honeymoon Fund',
    icon: 'Wedding',
    currentAmount: 7500000,
    targetAmount: 75000000,
    sourceAccountIds: ['bca1'],
    destinationAccountId: 'bca1',
    isShared: true,
    members: [
      { id: 'user1', name: 'Budi Santoso', avatarUrl: 'https://placehold.co/48x48.png' },
      { id: 'user2', name: 'Jane Doe', avatarUrl: 'https://placehold.co/48x48.png' },
    ],
    imageUrl: 'https://placehold.co/600x400.png',
  }
];

export const budgets: Budget[] = [
  { id: 'bud1', name: 'Monthly Food & Drink', category: 'Food & Drink', amount: 5000000, startDate: '2024-07-01', endDate: '2024-07-31' },
  { id: 'bud2', name: 'Monthly Transport', category: 'Transportation', amount: 1500000, startDate: '2024-07-01', endDate: '2024-07-31' },
  { id: 'bud3', name: 'July Shopping', category: 'Shopping', amount: 10000000, startDate: '2024-07-01', endDate: '2024-07-31' },
];



export const transactions: Transaction[] = [
  // July 2024
  { id: 't1', date: '2024-07-28T13:00:00Z', description: 'Lunch at Paul', amount: -350000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't2', date: '2024-07-27T18:00:00Z', description: 'Spotify Premium', amount: -54999, category: 'Bills', accountId: 'ovo1'},
  { id: 't3', date: '2024-07-27T15:00:00Z', description: 'Shopping at Zara', amount: -2500000, category: 'Shopping', accountId: 'bca1'},
  { id: 't4', date: '2024-07-26T19:30:00Z', description: 'GoFood McDonald\'s', amount: -120000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't5', date: '2024-07-25T09:05:00Z', description: 'Salary Deposit', amount: 55000000, category: 'Income', accountId: 'bca1'},
  { id: 't6', date: '2024-07-25T09:10:00Z', description: 'Auto-invest Bibit', amount: -5000000, category: 'Investment', accountId: 'bca1'},
  { id: 't7', date: '2024-07-24T20:00:00Z', description: 'Dinner at SKYE', amount: -1800000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't8', date: '2024-07-23T18:00:00Z', description: 'Gojek Ride', amount: -35000, category: 'Transportation', accountId: 'gopay1'},
  { id: 't9', date: '2024-07-22T10:00:00Z', description: 'Netflix Subscription', amount: -186000, category: 'Bills', accountId: 'ovo1'},
  { id: 't10', date: '2024-07-21T16:00:00Z', description: 'Groceries at Grand Lucky', amount: -1200000, category: 'Groceries', accountId: 'bca1'},
  { id: 't11', date: '2024-07-20T11:00:00Z', description: 'Starbucks', amount: -65000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't12', date: '2024-07-19T14:00:00Z', description: 'Garuda Flight to Bali', amount: -3200000, category: 'Travel', accountId: 'bca1'},
  { id: 't13', date: '2024-07-18T16:30:00Z', description: 'Uniqlo Purchase', amount: -799000, category: 'Shopping', accountId: 'bca1'},
  { id: 't14', date: '2024-07-17T08:00:00Z', description: 'Fitness First Membership', amount: -850000, category: 'Health', accountId: 'bca1'},
  { id: 't15', date: '2024-07-15T10:00:00Z', description: 'Top Up Pintu Crypto', amount: -10000000, category: 'Investment', accountId: 'bca1'},
  { id: 't16', date: '2024-07-12T13:00:00Z', description: 'Apple Store (iPhone)', amount: -25000000, category: 'Electronics', accountId: 'bca1'},
  { id: 't17', date: '2024-07-10T12:00:00Z', description: 'Transfer to Mom', amount: -2000000, category: 'Family', accountId: 'bca1'},
  { id: 't18', date: '2024-07-08T09:00:00Z', description: 'Kopi Kenangan', amount: -22000, category: 'Food & Drink', accountId: 'gopay1'},
  { id: 't19', date: '2024-07-05T11:00:00Z', description: 'PLN Bill', amount: -750000, category: 'Bills', accountId: 'ovo1'},
  { id: 't20', date: '2024-07-03T12:30:00Z', description: 'Business Lunch', amount: -500000, category: 'Food & Drink', accountId: 'bca1'},
  { id: 't21', date: '2024-07-01T10:00:00Z', description: 'Freelance Payment Received', amount: 7500000, category: 'Income', accountId: 'bca1'},

  // June 2024
  { id: 't22', date: '2024-06-28T19:00:00Z', description: 'CGV Sphere X', amount: -250000, category: 'Entertainment', accountId: 'ovo1'},
  { id: 't23', date: '2024-06-25T09:00:00Z', description: 'Salary Deposit', amount: 55000000, category: 'Income', accountId: 'bca1'},
  { id: 't24', date: '2024-06-25T09:05:00Z', description: 'Auto-invest Bibit', amount: -5000000, category: 'Investment', accountId: 'bca1'},
  { id: 't25', date: '2024-06-20T17:00:00Z', description: 'Tokopedia Gadgets', amount: -1500000, category: 'Electronics', accountId: 'gopay1'},
]
