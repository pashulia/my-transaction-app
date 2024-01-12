import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { server } from '../mocks/server';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  type: string;
  details: string;
}

const TransactionHistory: React.FC = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = useState<string | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<string | null>(null);
  const [error, setError] = useState<any>(null); 
  const [chartData, setChartData] = useState<any>(null);

  // const fetchTransactions = async () => {
  //   try {
  //     const response = await axios.get('/api/transactions');
  //     setTransactions(response.data as Transaction[]);
  //     setError(null); 
  //   } catch (error: any) {
  //     setError(error); 
  //     console.error('Error fetching transactions:', error.message);
  //   }
  // };

  // useEffect(() => {
  //   fetchTransactions();
  // }, []);

  useEffect(() => {
    server.listen();

    const fetchTransactions = async () => {
      try {
        const response = await axios.get('/api/transactions');
        setTransactions(response.data as Transaction[]);
        setError(null);
      } catch (error: any) {
        setError(error);
        console.error('Error fetching transactions:', error.message);
      }
    };

    fetchTransactions();

    return () => server.close();
  }, []);

  useEffect(() => {
    const filterTransactions = () => {
      let filtered = transactions;

      if (filterType) {
        filtered = filtered.filter((transaction) => transaction.type === filterType);
      }

      if (filterStartDate && filterEndDate) {
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date).getTime();
          const start = new Date(filterStartDate).getTime();
          const end = new Date(filterEndDate).getTime();
          return transactionDate >= start && transactionDate <= end;
        });
      }

      if (searchTerm) {
        filtered = filtered.filter((transaction) =>
          transaction.details.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredTransactions(filtered);
    };

    filterTransactions();
  }, [transactions, filterType, filterStartDate, filterEndDate, searchTerm]);

  const handleTransactionClick = (transactionId: number) => {
    console.log(`Clicked on transaction with ID ${transactionId}`);
  };

  const updateChartData = (filteredTransactions: Transaction[]) => {
    const categories = Array.from(new Set(filteredTransactions.map((t) => t.type)));
    const data = categories.map((category) => ({
      label: category,
      data: filteredTransactions.filter((t) => t.type === category).length,
    }));

    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Transactions',
          data: data.map((d) => d.data),
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 2,
        },
      ],
    });
  };

  const calculateTotal = (type: string) => {
    return filteredTransactions
      .filter((transaction) => transaction.type === type)
      .reduce((total, transaction) => total + transaction.amount, 0)
      .toFixed(2);
  };

  const calculateBalance = () => {
    const income = parseFloat(calculateTotal('Income'));
    const expense = parseFloat(calculateTotal('Expense'));
    return (income - expense).toFixed(2);
  };

  return (
    <div>
      <h1>{t('transactionHistory')}</h1>

      <div>
        <label>
          {t('filterType')}
          <select onChange={(e) => setFilterType(e.target.value)}>
            <option value="">{t('all')}</option>
            <option value="Income">{t('income')}</option>
            <option value="Expense">{t('expense')}</option>
          </select>
        </label>

        <label>
          {t('filterStartDate')}
          <input
            type="date"
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </label>

        <label>
          {t('filterEndDate')}
          <input
            type="date"
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </label>

        <label>
          {t('search')}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <ul>
        {filteredTransactions.map((transaction) => (
          <li key={transaction.id} onClick={() => handleTransactionClick(transaction.id)}>
            <div>
              <strong>{t('date')}: {transaction.date}</strong>
            </div>
            <div>
              <span>{t('amount')}: {transaction.amount}</span>
            </div>
            <div>
              <span>{t('type')}: {transaction.type}</span>
            </div>
            <div>
              <span>{t('details')}: {transaction.details}</span>
            </div>
          </li>
        ))}
      </ul>

      {chartData && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Bar
            data={chartData}
            options={{
              scales: {
                x: {
                  type: 'category',
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}

    {filteredTransactions.length > 0 && (
      <div style={{ marginTop: '20px' }}>
        <h2>{t('paymentOverview')}</h2>
        <p>{t('totalIncome')}: {calculateTotal('Income')} {t('currency')}</p>
        <p>{t('totalExpense')}: {calculateTotal('Expense')} {t('currency')}</p>
        <p>{t('balance')}: {calculateBalance()} {t('currency')}</p>
      </div>
    )}

      {error && (
        <div style={{ color: 'red' }}>
          {t('errorFetchingTransactions')}: {error.message}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
