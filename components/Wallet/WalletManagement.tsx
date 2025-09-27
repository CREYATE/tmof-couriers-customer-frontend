"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TmofSpinner from "@/components/ui/TmofSpinner";
import { walletService, Wallet, WalletTransaction } from '@/lib/walletService';
import { payWithPaystack } from '@/integrations/paystack';
import { Wallet2, Plus, History, ToggleLeft, ToggleRight, ArrowUp, ArrowDown, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WalletManagement: React.FC = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [error, setError] = useState('');
  const [processingDeposit, setProcessingDeposit] = useState(false);
  const [pendingReference, setPendingReference] = useState<string | null>(null);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    loadWalletData();
    checkForPaymentCallback();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("WebSocket disconnected");
      }
    };
  }, []);

  useEffect(() => {
    if (wallet && wallet.userId) {
      setupWebSocket(wallet.userId);
    }
  }, [wallet]);

  const setupWebSocket = (userId: number) => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }

    const socket = new SockJS("http://localhost:8080/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("WebSocket connected for wallet updates");
        client.subscribe(`/topic/wallet/update/${userId}`, (message) => {
          const updatedWallet: Wallet = JSON.parse(message.body);
          console.log("WebSocket wallet update received:", updatedWallet);
          setWallet(updatedWallet);
          walletService.getTransactionHistory({ size: 10 })
            .then((data) => setTransactions(data.content))
            .catch((err) => console.warn("Failed to reload transactions:", err));
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
      },
      onWebSocketClose: () => {
        console.log("WebSocket disconnected");
      },
    });
    client.activate();
    stompClientRef.current = client;
  };

  const checkForPaymentCallback = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const trxref = urlParams.get('trxref');
    
    if (reference || trxref) {
      const ref = reference || trxref;
      console.log('Detected Paystack callback with reference:', ref);
      setPendingReference(ref);
      setShowVerifyButton(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const walletData = await walletService.getWalletBalance();
      setWallet(walletData);
      
      try {
        const transactionsData = await walletService.getTransactionHistory({ size: 10 });
        setTransactions(transactionsData.content);
      } catch (transactionError: any) {
        console.warn('Could not load transactions:', transactionError);
        setTransactions([]);
      }
      
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to load wallet data';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Wallet data loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDeposit = async (reference: string) => {
    try {
      setProcessingDeposit(true);
      setError('');
      
      console.log('Verifying deposit with reference:', reference);
      const result = await walletService.verifyDeposit(reference);
      
      if (result.success) {
        toast.success('Deposit verified successfully! Funds added to your wallet.');
        await loadWalletData();
        setShowVerifyButton(false);
        setPendingReference(null);
      } else {
        const errorMsg = result.error || 'Deposit verification failed';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Deposit verification failed';
      console.error('Deposit verification error:', error);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessingDeposit(false);
    }
  };

  const toggleDepositForm = () => {
    console.log('toggleDepositForm called, current showDeposit:', showDeposit); // Debug log
    const newState = !showDeposit;
    console.log('Setting showDeposit to:', newState); // Debug log
    setShowDeposit(newState);
    
    if (!newState) {
      console.log('Clearing deposit form'); // Debug log
      setDepositAmount('');
      setError('');
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid amount');
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setError('');
      setProcessingDeposit(true);

      console.log('Starting deposit process with amount:', depositAmount);

      const response = await walletService.depositToWallet(parseFloat(depositAmount));
      console.log('Deposit initialization response:', response);

      if (!response.authorizationUrl && !response.reference) {
        throw new Error('Payment initialization failed - no authorization data received');
      }

      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackPublicKey) {
        throw new Error('Paystack configuration error. Please contact support.');
      }

      let userEmail = wallet?.userEmail;
      if (!userEmail) {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
          try {
            const payload = JSON.parse(atob(jwt.split('.')[1]));
            userEmail = payload.sub || payload.email;
          } catch (e) {
            console.warn('Could not extract email from JWT');
          }
        }
      }

      if (!userEmail) {
        throw new Error('Could not determine user email for payment');
      }

      console.log('Using Paystack with:', {
        key: paystackPublicKey.substring(0, 10) + '...',
        email: userEmail,
        amount: parseFloat(depositAmount) * 100,
        reference: response.reference
      });

      const paystackOptions = {
        key: paystackPublicKey,
        email: userEmail,
        amount: parseFloat(depositAmount) * 100,
        currency: 'ZAR',
        ref: response.reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Wallet Deposit",
              variable_name: "wallet_deposit",
              value: "true"
            }
          ]
        },
        onSuccess: (paymentResponse: any) => {
          console.log('Paystack payment success:', paymentResponse);
          setPendingReference(paymentResponse.reference);
          setShowVerifyButton(true);
          toast.success('Payment completed. Click "Complete Deposit" to add funds.');
          setProcessingDeposit(false);
        },
        onClose: () => {
          console.log('Paystack payment window closed');
          toast('Payment window closed. If you completed payment, click "Complete Deposit" when ready.');
          setProcessingDeposit(false);
        }
      };

      payWithPaystack(paystackOptions);

    } catch (error: any) {
      console.error('Deposit error:', error);
      const errorMessage = error.message || 'Deposit failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setProcessingDeposit(false);
    }
  };

  const handleSimpleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid amount');
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setError('');
      setProcessingDeposit(true);
      
      console.log('Starting simple deposit process with amount:', depositAmount);
      
      const response = await walletService.depositToWallet(parseFloat(depositAmount));
      console.log('Deposit response:', response);
      
      if (response.authorizationUrl) {
        setPendingReference(response.reference);
        setShowVerifyButton(true);
        window.location.href = response.authorizationUrl;
      } else {
        throw new Error('No payment URL received from server');
      }
      
    } catch (error: any) {
      console.error('Simple deposit error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Deposit failed';
      setError(errorMessage);
      toast.error(errorMessage);
      setProcessingDeposit(false);
    }
  };

  const toggleWalletStatus = async () => {
    if (!wallet) return;

    try {
      setError('');
      const newStatus = !wallet.isActive;
      const updatedWallet = await walletService.toggleWalletStatus(newStatus);
      setWallet(updatedWallet);
      toast.success(`Wallet ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to update wallet status';
      setError(errorMsg);
      toast.error(errorMsg);
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
          onClick={() => {
            console.log('Add Funds/Cancel button clicked'); // Debug log
            toggleDepositForm();
          }}
          className="bg-[#ffd215] hover:bg-[#e5bd13] text-black font-medium"
          disabled={processingDeposit}
        >
          {showDeposit ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showVerifyButton && pendingReference && (
        <Card className="border-2 border-green-500 animate-in fade-in duration-300 bg-green-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-4">Payment Completed?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you have finished the payment process, click the button below to verify and add funds to your wallet.
            </p>
            <Button
              onClick={() => verifyDeposit(pendingReference)}
              disabled={processingDeposit}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {processingDeposit ? (
                <>
                  <TmofSpinner show={true} />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                'Complete Deposit'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

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
              disabled={!wallet || processingDeposit}
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

      {showDeposit && (
        <Card className="border-2 border-[#ffd215] animate-in fade-in duration-300 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-600">✅ Add Funds to Wallet</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('Close deposit form button clicked'); // Debug log
                  toggleDepositForm();
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
                  disabled={processingDeposit}
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setDepositAmount('100')}
                  variant="outline"
                  className="flex-1"
                  disabled={processingDeposit}
                >
                  R100
                </Button>
                <Button
                  onClick={() => setDepositAmount('500')}
                  variant="outline"
                  className="flex-1"
                  disabled={processingDeposit}
                >
                  R500
                </Button>
                <Button
                  onClick={() => setDepositAmount('1000')}
                  variant="outline"
                  className="flex-1"
                  disabled={processingDeposit}
                >
                  R1,000
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={handleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || processingDeposit}
                  className="w-full bg-[#ffd215] hover:bg-[#e5bd13] text-black"
                >
                  {processingDeposit ? (
                    <>
                      <TmofSpinner show={true} />
                      <span className="ml-2">Processing Payment...</span>
                    </>
                  ) : (
                    'Proceed to Payment (Inline)'
                  )}
                </Button>
                
                <Button
                  onClick={handleSimpleDeposit}
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0 || processingDeposit}
                  variant="outline"
                  className="w-full"
                >
                  Proceed to Payment (Redirect)
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                If one method doesn't work, try the other. Both will process your payment securely.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

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
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;