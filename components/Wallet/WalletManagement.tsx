// components/Wallet/WalletManagement.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { walletService, Wallet, WalletTransaction } from '@/lib/walletService';
import {Wallet2, Plus, History, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';

const WalletManagement: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const [walletData, transactionsData] = await Promise.all([
        walletService.getWalletBalance(),
        walletService.getTransactionHistory({ size: 10 })
      ]);
      setWallet(walletData);
      setTransactions(transactionsData.content);
    } catch (error: any) {
      setError('Failed to load wallet data');
      console.error('Wallet data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setError('');
      const response = await walletService.depositToWallet(parseFloat(depositAmount));
      
      // Redirect to Paystack
      if (response.authorizationUrl) {
        window.location.href = response.authorizationUrl;
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Deposit failed');
    }
  };

  const toggleWalletStatus = async () => {
    if (!wallet) return;

    try {
      const newStatus = !wallet.isActive;
      const updatedWallet = await walletService.toggleWalletStatus(newStatus);
      setWallet(updatedWallet);
    } catch (error: any) {
      setError('Failed to update wallet status');
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <ArrowDown className="h-4 w-4 text-green-500" />;
      case 'WITHDRAWAL': return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'REFUND': return <ArrowDown className="h-4 w-4 text-blue-500" />;
      default: return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'text-green-600 bg-green-50';
      case 'WITHDRAWAL': return 'text-red-600 bg-red-50';
      case 'REFUND': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <TmofSpinner show={true} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <Button
          onClick={() => setShowDeposit(!showDeposit)}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Funds
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Wallet Overview */}
      <Card className="border border-[#ffd215] bg-gradient-to-r from-[#ffd215]/5 to-[#ffd215]/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#ffd215] rounded-full">
                <Wallet2 className="h-6 w-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                  {wallet ? formatAmount(wallet.balance) : 'R0.00'}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    className={wallet?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {wallet?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Since {wallet ? new Date(wallet.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={toggleWalletStatus}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {wallet?.isActive ? (
                <ToggleRight className="h-4 w-4 text-green-600" />
              ) : (
                <ToggleLeft className="h-4 w-4 text-gray-400" />
              )}
              <span>{wallet?.isActive ? 'Disable' : 'Enable'} Wallet</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Form */}
      {showDeposit && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add Funds to Wallet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (ZAR)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ffd215] focus:border-transparent"
                  min="1"
                  step="0.01"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setDepositAmount('100')}
                  variant="outline"
                  className="flex-1"
                >
                  R100
                </Button>
                <Button
                  onClick={() => setDepositAmount('500')}
                  variant="outline"
                  className="flex-1"
                >
                  R500
                </Button>
                <Button
                  onClick={() => setDepositAmount('1000')}
                  variant="outline"
                  className="flex-1"
                >
                  R1,000
                </Button>
              </div>
              <Button
                onClick={handleDeposit}
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
              >
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Recent Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </p>
                      {transaction.orderTrackingNumber && (
                        <p className="text-xs text-blue-600">
                          Order: {transaction.orderTrackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'DEPOSIT' || transaction.type === 'REFUND' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' || transaction.type === 'REFUND' ? '+' : '-'}
                      {formatAmount(transaction.amount)}
                    </p>
                    <Badge className={getTransactionColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          {transactions.length > 0 && (
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => {/* Navigate to full history */}}>
                View All Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;