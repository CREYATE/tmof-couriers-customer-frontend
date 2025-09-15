import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface WalletTransaction {
	id: string;
	amount: number;
	transaction_type: 'credit' | 'debit';
	description: string;
	order_id?: string;
	payment_reference?: string;
	created_at: string;
}

export const useWallet = () => {
	const { user } = useAuth();
	const [balance, setBalance] = useState<number>(0);
	const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
	const [loading, setLoading] = useState(true);

		const fetchWalletData = async () => {
			// Mock wallet logic only
			await new Promise(res => setTimeout(res, 300));
			setBalance(500);
			setTransactions([
				{
					id: 'mock-tx-1',
					amount: 200,
					transaction_type: 'credit',
					description: 'Initial top-up',
					created_at: new Date().toISOString(),
				},
				{
					id: 'mock-tx-2',
					amount: 50,
					transaction_type: 'debit',
					description: 'Order payment',
					created_at: new Date().toISOString(),
				},
			]);
			setLoading(false);
		};

		const topUpWallet = async (amount: number, paymentReference: string) => {
			await new Promise(res => setTimeout(res, 300));
			setBalance(prev => prev + amount);
			toast.success(`Wallet topped up with R${amount.toFixed(2)}`);
			return true;
		};

		const deductFromWallet = async (amount: number, description: string, orderId?: string) => {
			await new Promise(res => setTimeout(res, 300));
			if (balance < amount) {
				toast.error('Insufficient wallet balance');
				return false;
			}
			setBalance(prev => prev - amount);
			toast.success(`Wallet debited R${amount.toFixed(2)}`);
			return true;
		};

	useEffect(() => {
		fetchWalletData();
	}, [user]);

	return {
		balance,
		transactions,
		loading,
		topUpWallet,
		deductFromWallet,
		refreshWallet: fetchWalletData
	};
};