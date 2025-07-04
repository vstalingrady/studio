
'use client';

import { Landmark, Briefcase, Wallet, Coins } from 'lucide-react';
import { cn } from "@/lib/utils"
import { accounts, transactions, type Account } from '@/lib/data';
import TotalBalance from '@/components/dashboard/total-balance';
import { useMemo } from 'react';

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const formatDisplayNumber = (account: Account): string => {
  const { accountNumber, type } = account;
  if (type === 'investment') {
    return ''; // No subtitle needed, name is descriptive
  }
  if (type === 'loan') {
    return 'Outstanding debt';
  }
  if (accountNumber && accountNumber.length > 4) {
    const firstTwo = accountNumber.substring(0, 2);
    const lastTwo = accountNumber.substring(accountNumber.length - 2);
    return `${firstTwo}********${lastTwo}`;
  }
  return `...${accountNumber}`; // Fallback
};

const MockAccountCard = ({ icon, name, displayNumber, balance, isLoan = false }: { icon: React.ReactNode, name: string, displayNumber: string, balance: string, isLoan?: boolean }) => (
    <div className="bg-card/80 p-3 rounded-xl flex justify-between items-center border border-border/20 shadow-sm">
        <div className="flex items-center flex-1 min-w-0">
            {icon}
            <div className="flex-1 min-w-0 flex flex-col items-start text-left">
                <div className="font-semibold text-white truncate text-sm text-left">{name}</div>
                {displayNumber && <div className="text-muted-foreground text-xs text-left">{displayNumber}</div>}
            </div>
        </div>
        <div className="text-right ml-2">
            <div className={cn(
                "font-semibold text-sm",
                isLoan ? "text-destructive" : "text-white"
            )}>
                {balance}
            </div>
        </div>
    </div>
);

const getAccountIcon = (type: string, name: string) => {
    const baseClasses = "w-10 h-10 rounded-lg mr-3 flex items-center justify-center text-xs font-bold shadow-md flex-shrink-0";
    const lowerName = name.toLowerCase();
    if (lowerName.includes('bca')) return <div className={cn(baseClasses, "bg-blue-600")}>BCA</div>;
    if (lowerName.includes('gopay')) return <div className={cn(baseClasses, "bg-sky-500")}>GP</div>;
    if (lowerName.includes('ovo')) return <div className={cn(baseClasses, "bg-purple-600")}>OVO</div>;
    if (lowerName.includes('bibit')) return <div className={cn(baseClasses, "bg-green-500")}>BB</div>;
    if (lowerName.includes('pintu')) return <div className={cn(baseClasses, "bg-indigo-500")}>PT</div>;
    if (lowerName.includes('kredivo')) return <div className={cn(baseClasses, "bg-orange-500")}>KR</div>;
    return <div className={cn(baseClasses, "bg-secondary")}>AC</div>;
}


export default function DashboardMockup({ isActive }: { isActive?: boolean }) {
    const { totalAssets, totalLiabilities, netWorth, accountGroups } = useMemo(() => {
        const totalAssets = accounts
            .filter(acc => acc.type !== 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
        
        const totalLiabilities = accounts
            .filter(acc => acc.type === 'loan')
            .reduce((sum, acc) => sum + acc.balance, 0);
            
        const netWorth = totalAssets - totalLiabilities;

        const accountGroups = {
            bank: accounts.filter(a => a.type === 'bank'),
            ewallet: accounts.filter(a => a.type === 'e-wallet'),
            investment: accounts.filter(a => a.type === 'investment'),
            loan: accounts.filter(a => a.type === 'loan'),
        };

        return { totalAssets, totalLiabilities, netWorth, accountGroups };
    }, []);

  return (
    <div className="h-full w-full p-2 bg-background">
      <div className="h-full space-y-3 rounded-xl bg-background/50 overflow-y-auto custom-scrollbar">
            {/* Total Balance Card */}
            <TotalBalance title="Total Net Worth" amount={netWorth} transactions={transactions} showHistoryLink={false} isActive={isActive} />
            
            {/* Accounts Section */}
            <div className="space-y-2">
                <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Landmark className='w-4 h-4' />
                        <span>Banks</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         {accountGroups.bank.map(account => (
                            <MockAccountCard 
                                key={account.id}
                                icon={getAccountIcon('bank', account.name)}
                                name={account.name}
                                displayNumber={formatDisplayNumber(account)}
                                balance={formatCurrency(account.balance)}
                            />
                        ))}
                    </div>
                </div>
                 <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Wallet className='w-4 h-4' />
                        <span>E-Money</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         {accountGroups.ewallet.map(account => (
                            <MockAccountCard 
                                key={account.id}
                                icon={getAccountIcon('e-wallet', account.name)}
                                name={account.name}
                                displayNumber={formatDisplayNumber(account)}
                                balance={formatCurrency(account.balance)}
                            />
                        ))}
                    </div>
                </div>
                 <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Briefcase className='w-4 h-4' />
                        <span>Investments</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         {accountGroups.investment.map(account => (
                            <MockAccountCard 
                                key={account.id}
                                icon={getAccountIcon('investment', account.name)}
                                name={account.name}
                                displayNumber={formatDisplayNumber(account)}
                                balance={formatCurrency(account.balance)}
                            />
                        ))}
                    </div>
                </div>
                 <div className="bg-card p-4 rounded-xl border-none shadow-md">
                     <div className='flex items-center gap-3 text-white font-semibold text-sm'>
                        <Coins className='w-4 h-4' />
                        <span>Loans</span>
                    </div>
                    <div className="pt-2 space-y-2">
                         {accountGroups.loan.map(account => (
                            <MockAccountCard 
                                key={account.id}
                                icon={getAccountIcon('loan', account.name)}
                                name={account.name}
                                displayNumber={formatDisplayNumber(account)}
                                balance={`-${formatCurrency(account.balance)}`}
                                isLoan={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
