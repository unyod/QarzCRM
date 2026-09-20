import React, { useState, useEffect } from 'react';
import { Customer, DebtContract, NavigationPath, PaymentTransaction, SMSNotice } from './types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_DEBTS,
  INITIAL_TRANSACTIONS,
  INITIAL_SMS_LOGS
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CustomerDrawer } from './components/CustomerDrawer';
import { NewCustomerModal } from './components/Modals/NewCustomerModal';
import { BulkSmsModal } from './components/Modals/BulkSmsModal';
import { ReceiptModal } from './components/Modals/ReceiptModal';

// Views
import { DashboardView } from './views/DashboardView';
import { PaymentsView } from './views/PaymentsView';
import { CreateDebtView } from './views/CreateDebtView';
import { CustomersView } from './views/CustomersView';
import { DebtsView } from './views/DebtsView';
import { SmsMarketingView } from './views/SmsMarketingView';
import { ReportsView } from './views/ReportsView';
import { CalendarView } from './views/CalendarView';
import { AIAssistantView } from './views/AIAssistantView';
import { EmployeesView } from './views/EmployeesView';
import { ShopsView } from './views/ShopsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [debts, setDebts] = useState<DebtContract[]>(INITIAL_DEBTS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [smsLogs, setSmsLogs] = useState<SMSNotice[]>(INITIAL_SMS_LOGS);
  const [smsRemaining, setSmsRemaining] = useState<number>(1420);
  const [smsTotal] = useState<number>(2000);

  // Cross-view state & modals
  const [activeCustomerForPayment, setActiveCustomerForPayment] = useState<Customer | null>(null);
  const [activeCustomerForDrawer, setActiveCustomerForDrawer] = useState<Customer | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState<boolean>(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState<boolean>(false);
  const [isBulkSmsModalOpen, setIsBulkSmsModalOpen] = useState<boolean>(false);
  const [selectedTransactionForReceipt, setSelectedTransactionForReceipt] = useState<PaymentTransaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keyboard shortcuts (F1: Kassa to'lov, F2: Yangi qarz, Esc: Close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setCurrentPath('payments');
      } else if (e.key === 'F2') {
        e.preventDefault();
        setCurrentPath('create-debt');
      } else if (e.key === 'Escape') {
        setIsCustomerDrawerOpen(false);
        setIsNewCustomerModalOpen(false);
        setIsBulkSmsModalOpen(false);
        setIsReceiptModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for data updates
  const handleAddPaymentTransaction = (tx: PaymentTransaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Update customer balances
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === tx.customerId) {
          const newRemaining = Math.max(0, c.remainingDebt - tx.totalAmount);
          const newPaid = c.paidAmount + tx.totalAmount;
          return {
            ...c,
            remainingDebt: newRemaining,
            paidAmount: newPaid,
            status: newRemaining === 0 ? 'settled' : c.status
          };
        }
        return c;
      })
    );

    // Open receipt modal automatically
    setSelectedTransactionForReceipt(tx);
    setIsReceiptModalOpen(true);
  };

  const handleAddDebtContract = (contract: DebtContract) => {
    setDebts((prev) => [contract, ...prev]);

    // Update customer debt ledger
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === contract.customerId) {
          return {
            ...c,
            totalDebt: c.totalDebt + contract.totalAmount,
            paidAmount: c.paidAmount + contract.paidAmount,
            remainingDebt: c.remainingDebt + contract.remainingAmount,
            dueDate: contract.dueDate,
            status: 'active'
          };
        }
        return c;
      })
    );
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleSendSms = (notice: SMSNotice) => {
    setSmsLogs((prev) => [notice, ...prev]);
    setSmsRemaining((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-surface flex antialiased selection:bg-secondary/20 selection:text-secondary">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          setCurrentPath(path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        smsRemaining={smsRemaining}
        smsTotal={smsTotal}
      />

      {/* Main App Container */}
      <div className="flex-1 ml-64 flex flex-col min-w-0 min-h-screen">
        {/* Global Sticky Header */}
        <Header
          currentPath={currentPath}
          onNavigate={(path) => {
            setCurrentPath(path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenQuickDebt={() => setCurrentPath('create-debt')}
          onOpenQuickPay={() => setCurrentPath('payments')}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentPath !== 'customers') {
              setCurrentPath('customers');
            }
          }}
          searchQuery={searchQuery}
        />

        {/* Dynamic Route View Canvas */}
        <main
          id="main-viewport"
          className="flex-1 pt-16 px-gutter-desktop py-space-lg max-w-[1600px] w-full mx-auto"
        >
          {currentPath === 'dashboard' && (
            <DashboardView
              customers={customers}
              transactions={transactions}
              onNavigate={(path) => {
                setCurrentPath(path);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenQuickDebt={() => setCurrentPath('create-debt')}
              onOpenQuickPay={() => setCurrentPath('payments')}
              onOpenBulkSms={() => setIsBulkSmsModalOpen(true)}
              onSelectCustomer={(customer: Customer) => {
                setActiveCustomerForDrawer(customer);
                setIsCustomerDrawerOpen(true);
              }}
            />
          )}

          {currentPath === 'payments' && (
            <PaymentsView
              customers={customers}
              transactions={transactions}
              onAddTransaction={handleAddPaymentTransaction}
              onUpdateCustomerDebt={(customerId: string, amountPaid: number) => {
                setCustomers((prev) =>
                  prev.map((c) => {
                    if (c.id === customerId) {
                      const newRemaining = Math.max(0, c.remainingDebt - amountPaid);
                      return {
                        ...c,
                        remainingDebt: newRemaining,
                        paidAmount: c.paidAmount + amountPaid,
                        status: newRemaining === 0 ? 'settled' : c.status
                      };
                    }
                    return c;
                  })
                );
              }}
              onOpenReceiptModal={(tx: PaymentTransaction) => {
                setSelectedTransactionForReceipt(tx);
                setIsReceiptModalOpen(true);
              }}
            />
          )}

          {currentPath === 'create-debt' && (
            <CreateDebtView
              customers={customers}
              onAddDebtContract={handleAddDebtContract}
              onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
              onSuccessNavigate={() => {
                setCurrentPath('debts');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentPath === 'customers' && (
            <CustomersView
              customers={customers}
              onSelectCustomer={(customer) => {
                setActiveCustomerForDrawer(customer);
                setIsCustomerDrawerOpen(true);
              }}
              onOpenNewCustomer={() => setIsNewCustomerModalOpen(true)}
              onPayForCustomer={(customer) => {
                setActiveCustomerForPayment(customer);
                setCurrentPath('payments');
              }}
              onSendSms={(customer) => {
                setActiveCustomerForDrawer(customer);
                setIsCustomerDrawerOpen(true);
              }}
            />
          )}

          {currentPath === 'debts' && (
            <DebtsView
              debts={debts}
              customers={customers}
              onOpenCreateDebt={() => {
                setCurrentPath('create-debt');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onPayForCustomer={(customer) => {
                setActiveCustomerForPayment(customer);
                setCurrentPath('payments');
              }}
            />
          )}

          {currentPath === 'sms-marketing' && (
            <SmsMarketingView
              customers={customers}
              smsLogs={smsLogs}
              smsRemaining={smsRemaining}
              smsTotal={smsTotal}
              onSendSms={handleSendSms}
            />
          )}

          {currentPath === 'financial-reports' && (
            <ReportsView customers={customers} transactions={transactions} />
          )}

          {currentPath === 'debt-calendar' && (
            <CalendarView
              customers={customers}
              onSelectCustomer={(customer) => {
                setActiveCustomerForDrawer(customer);
                setIsCustomerDrawerOpen(true);
              }}
            />
          )}

          {currentPath === 'employees' && <EmployeesView />}

          {currentPath === 'shops' && <ShopsView />}

          {currentPath === 'ai-assistant' && (
            <AIAssistantView
              customers={customers}
              onSelectCustomer={(customer) => {
                setActiveCustomerForDrawer(customer);
                setIsCustomerDrawerOpen(true);
              }}
            />
          )}

          {currentPath === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Slide-Over Customer Drawer */}
      <CustomerDrawer
        customer={activeCustomerForDrawer}
        isOpen={isCustomerDrawerOpen}
        onClose={() => setIsCustomerDrawerOpen(false)}
        onPayForCustomer={(customer) => {
          setIsCustomerDrawerOpen(false);
          setActiveCustomerForPayment(customer);
          setCurrentPath('payments');
        }}
        onSendSms={() => {
          setIsBulkSmsModalOpen(true);
        }}
      />

      {/* Global Modals */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onAddCustomer={handleAddCustomer}
      />

      <BulkSmsModal
        isOpen={isBulkSmsModalOpen}
        onClose={() => setIsBulkSmsModalOpen(false)}
        customers={customers}
        smsRemaining={smsRemaining}
        onSendBulkSms={(count) => {
          setSmsRemaining((prev) => Math.max(0, prev - count));
        }}
      />

      <ReceiptModal
        transaction={selectedTransactionForReceipt}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
      />
    </div>
  );
}
