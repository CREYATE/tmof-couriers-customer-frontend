import axios from 'axios';

export interface Wallet {
  id: number;
  balance: number;
  isActive: boolean;
  createdAt: string;
  userEmail: string;
  userName: string;
  error?: string; // Added to handle backend error messages
}

export interface WalletTransaction {
  id: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'REFUND';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference: string;
  description: string;
  transactionDate: string;
  orderTrackingNumber?: string;
}

export interface DepositRequest {
  amount: number;
  paymentMethod?: string;
}

export interface TransactionHistoryRequest {
  page?: number;
  size?: number;
  transactionType?: string;
}

class WalletService {
  private baseURL = '/api/wallet';

  async getWalletBalance(): Promise<Wallet> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    const response = await axios.get(`${this.baseURL}/balance`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    const data = response.data as Wallet;
    if (data.error) {
      throw new Error(data.error);
    }
    return data;
  }

  async depositToWallet(amount: number): Promise<any> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    const request: DepositRequest = { amount, paymentMethod: 'PAYSTACK' };
    const response = await axios.post(`${this.baseURL}/deposit`, request, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  }

  async verifyDeposit(reference: string): Promise<boolean> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    const response = await axios.post(`${this.baseURL}/deposit/verify`, 
      { reference }, 
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    if (response.data && typeof response.data === 'string') {
      throw new Error(response.data);
    }
    return response.status === 200;
  }

  async getTransactionHistory(params: TransactionHistoryRequest = {}): Promise<{
    content: WalletTransaction[];
    totalPages: number;
    totalElements: number;
  }> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    const response = await axios.get(`${this.baseURL}/transactions`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: {
        page: params.page || 0,
        size: params.size || 20,
        type: params.transactionType,
      },
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data;
  }

  async toggleWalletStatus(activate: boolean): Promise<Wallet> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    try {
      const response = await axios.post(`${this.baseURL}/toggle?activate=${activate}`, {}, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = response.data as Wallet;
      if (data.error) {
        throw new Error(data.error);
      }
      return data;
    } catch (error: any) {
      // Enhance error message for better user feedback
      const errorMessage = error.response?.data?.error || `Failed to ${activate ? 'activate' : 'deactivate'} wallet`;
      throw new Error(errorMessage);
    }
  }
}

export const walletService = new WalletService();