
'use client';

import { useState, useMemo, useCallback, useEffect, type ElementType } from 'react';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
import Image from 'next/image';
import {
  ChevronRight,
  Send,
  Wallet,
  ReceiptText,
  Search,
  Plus,
  X,
  User,
  Clapperboard,
  CreditCard,
  ShoppingCart,
  Home,
  Building,
} from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import TransactionHistory from '@/components/dashboard/transaction-history';
import { transactions } from '@/lib/data';
import { FavoriteTransaction } from '@/app/api/favorites/route';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';


const transferActions = [
  { name: 'Transfer', icon: Send, href: '/transfer/recipients', description: "To any bank account" },
  { name: 'Pay Bills', icon: ReceiptText, href: '/bills', description: "PLN, BPJS, TV, etc." },
  { name: 'Top Up', icon: Wallet, href: '/transfer/top-up', description: "GoPay, OVO, Credit" },
];

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
}).format(amount);

const favoriteSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }).max(25, { message: 'Name cannot be longer than 25 characters.' }),
  amount: z.coerce.number().min(1000, { message: 'Minimum amount is IDR 1,000.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  icon: z.string().min(1, { message: 'An icon is required.' }),
});

const availableIcons: { [key: string]: ElementType } = {
  User,
  Clapperboard,
  CreditCard,
  Wallet,
  ShoppingCart,
  Home,
  Building,
};
type IconName = keyof typeof availableIcons;

const iconSelectItems = [
  { value: 'User', label: 'Person / User' },
  { value: 'Clapperboard', label: 'Entertainment / Movie' },
  { value: 'CreditCard', label: 'Credit Card / Bill' },
  { value: 'Wallet', label: 'Wallet / Top Up' },
  { value: 'ShoppingCart', label: 'Shopping' },
  { value: 'Home', label: 'Rent / Mortgage' },
  { value: 'Building', label: 'Apartment / Bills' },
];


export default function TransferPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<FavoriteTransaction[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: FavoriteTransaction[] = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        toast({ title: 'Error', description: 'Failed to load favorites.', variant: 'destructive' });
      }
    };

    fetchFavorites();
  }, []);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const form = useForm<z.infer<typeof favoriteSchema>>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: { name: '', amount: 0, category: '', icon: '' },
  });

  const onAddFavorite = (values: z.infer<typeof favoriteSchema>) => {
    const newFavorite: FavoriteTransaction = {
      id: `fav-${Date.now()}`,
      ...values,
      amount: Number(values.amount)
    };
    // TODO: Implement API call to add favorite to backend
    setFavorites([...favorites, newFavorite]);
    setIsAddDialogOpen(false);
    form.reset();
    toast({ title: 'Favorite Added!', description: `"${values.name}" is now saved.` });
  };

  const handleRemoveFavorite = (id: string) => {
    // TODO: Implement API call to remove favorite from backend
    setFavorites(favorites.filter(f => f.id !== id));
    toast({
      variant: 'destructive',
      title: 'Favorite Removed',
    });
  };

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions;
    return transactions.filter(t =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, transactions]);
  
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-popover border-border">
          <DialogHeader>
            <DialogTitle>Create a New Favorite</DialogTitle>
            <DialogDescription>This creates a reusable template for quick payments.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddFavorite)} className="space-y-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Favorite Name</FormLabel><FormControl><Input placeholder="e.g. Monthly Rent" {...field} maxLength={25} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="amount" render={({ field }) => (
                <FormItem><FormLabel>Amount (IDR)</FormLabel><FormControl><Input type="number" placeholder="e.g. 5000000" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input placeholder="e.g. Housing" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="icon" render={({ field }) => (
                <FormItem><FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select an icon" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {iconSelectItems.map(item => (
                      <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage /></FormItem>
              )}/>
              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Favorite</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <div className="space-y-8 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold mb-1 font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Pay & Transfer
          </h1>
          <p className="text-muted-foreground">Your central hub for all payments.</p>
        </div>

        <Link
            href="/transfer/qris"
            className="p-[2px] rounded-2xl bg-gradient-to-r from-primary to-accent block"
        >
          <div className="w-full h-full bg-card rounded-[calc(1rem-2px)] p-5 flex items-center justify-center border-2 border-dashed border-card">
              <span className="font-semibold text-xl text-white flex items-center gap-3">
                  Pay with <Image src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS Logo" width={80} height={37} className="dark:invert w-20 h-auto" />
              </span>
          </div>
        </Link>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white font-serif">Favorites</h2>
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-5 h-5" />
                </Button>
                <Button variant="link" size="sm" className="text-primary pr-0">
                  See All
                </Button>
              </div>
            </div>
            
            <div className="w-full">
              <div className="overflow-hidden -ml-4" ref={emblaRef}>
                <div className="flex">
                  {favorites.map((fav, index) => {
                    const Icon = availableIcons[fav.icon as IconName] || Wallet;
                    return (
                      <div
                        key={fav.id}
                        className="flex-[0_0_10rem] pl-2 min-w-0" // Added min-w-0 to prevent overflow
                      >
                         <div className="w-full h-40">
                           <div className={cn(
                            "relative group w-full h-full bg-card p-4 rounded-2xl flex flex-col justify-between border border-border shadow-lg cursor-pointer transition-transform duration-300 ease-out",
                             index === selectedIndex ? 'scale-100 opacity-100 shadow-primary/20' : 'scale-90 opacity-60'
                           )}>
                               <Button onClick={() => handleRemoveFavorite(fav.id)} variant="ghost" size="icon" className="absolute top-1 right-1 w-7 h-7 bg-secondary/50 text-muted-foreground hover:bg-destructive/80 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                 <X className="w-4 h-4" />
                               </Button>
                               <div className="bg-gradient-to-br from-primary to-accent w-12 h-12 rounded-xl shadow-lg text-white flex items-center justify-center flex-shrink-0">
                                 <Icon className="w-6 h-6" />
                               </div>
                               <div className="min-w-0 flex-1 flex flex-col justify-end overflow-hidden">
                                 <p className="font-semibold text-sm text-white truncate mb-1" title={fav.name}>{fav.name}</p>
                                 <p className="text-xs text-muted-foreground font-mono truncate">{formatCurrency(fav.amount)}</p>
                               </div>
                           </div>
                         </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {scrollSnaps.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === selectedIndex ? "bg-accent w-6" : "bg-muted hover:bg-muted-foreground/50"
                        )}
                    />
                ))}
              </div>
            </div>
        </div>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Services</h2>
            <div className="grid grid-cols-1 gap-4">
              {transferActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="w-full text-left bg-card p-5 rounded-2xl flex items-center gap-5 hover:bg-secondary transition-all duration-300 border border-border shadow-lg group"
                >
                  <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-lg">
                      <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">{action.name}</p>
                    <p className="text-muted-foreground text-sm">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white font-serif">Recent Transactions</h2>
              <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                      type="text"
                      placeholder="Search transactions..."
                      className="bg-input border-border h-14 pl-12 text-base placeholder:text-muted-foreground"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                  />
              </div>
              <TransactionHistory transactions={filteredTransactions} />
        </div>
      </div>
    </>
  );
}
