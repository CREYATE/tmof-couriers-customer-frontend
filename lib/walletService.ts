import axios from 'axios';

export interface Wallet {
  id: number;
  balance: number;
  isActive: boolean;
  createdAt: string;
  userEmail: string;
  userName: string;
  userId?: number; // Added for WebSocket subscription
  error?: string;
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

export interface PaystackInitializeResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  error?: string;
}

export interface VerifyDepositResponse {
  success: boolean;
  error?: string;
}

class WalletService {
  private baseURL = '/api/wallet';

  async getWalletBalance(): Promise<Wallet> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    
    try {
      const response = await axios.get(`${this.baseURL}/balance`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get wallet balance error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch wallet balance');
    }
  }

  async depositToWallet(amount: number): Promise<PaystackInitializeResponse> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    
    try {
      const request: DepositRequest = { amount, paymentMethod: 'PAYSTACK' };
      const response = await axios.post(`${this.baseURL}/deposit`, request, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      console.log('Deposit response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Deposit error:', error);
      throw new Error(error.response?.data?.error || error.message || 'Deposit failed');
    }
  }

  async verifyDeposit(reference: string): Promise<VerifyDepositResponse> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }

    const maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        console.log(`Attempt ${attempt} to verify deposit with reference: ${reference}`);
        const response = await axios.post(
          `${this.baseURL}/deposit/verify`, 
          { reference }, 
          { 
            headers: { 
              Authorization: `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            } 
          }
        );

        console.log('Verify deposit response:', response.data);

        if (response.status === 200) {
          return { success: true };
        } else {
          return { 
            success: false, 
            error: response.data?.error || 'Verification failed' 
          };
        }
      } catch (error: any) {
        console.error(`Verify deposit attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          return { 
            success: false, 
            error: error.response?.data?.error || error.response?.data || error.message || 'Verification failed' 
          };
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        attempt++;
      }
    }

    return { success: false, error: 'Verification failed after multiple attempts' };
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
    
    try {
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
    } catch (error: any) {
      console.error('Get transaction history error:', error);
      
      if (error.response?.status === 403) {
        throw new Error('Access denied. Please log in again.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Failed to fetch transactions');
    }
  }

  async toggleWalletStatus(activate: boolean): Promise<Wallet> {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      throw new Error('No JWT found. Please log in.');
    }
    
    try {
      const response = await axios.post(
        `${this.baseURL}/toggle?activate=${activate}`, 
        {}, 
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Toggle wallet status error:', error);
      throw new Error(error.response?.data?.error || `Failed to ${activate ? 'activate' : 'deactivate'} wallet`);
    }
  }
}

export const walletService = new WalletService();