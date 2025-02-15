import React, { useEffect, useState } from 'react';
import transactions from './Data/mydata';

const calculatePoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2; 
    amount = 100; 
  }
  if (amount > 50) {
    points += (amount - 50) * 1; 
  }
  return points;
};

const fetchTransactions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(transactions);
    }, 1000); 
  });
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions().then((transactions) => {
      setData(transactions);
      setLoading(false);
    });
  }, []);

  const getMonth = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const calculateCustomerPoints = () => {
    const customerPoints = {};

    data.forEach((transaction) => {
      const { customerId, amountSpent, date } = transaction;
      const month = getMonth(date);
      const points = calculatePoints(amountSpent);

      if (!customerPoints[customerId]) {
        customerPoints[customerId] = {};
      }
      if (!customerPoints[customerId][month]) {
        customerPoints[customerId][month] = 0;
      }
      customerPoints[customerId][month] += points;
    });

    return customerPoints;
  };

  const customerPoints = calculateCustomerPoints();

  return (
    <div className="App">
      <h1>Customer Reward Points</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        Object.keys(customerPoints).map((customerId) => (
          <div key={customerId}>
            <h2>Customer {customerId}</h2>
            <ul>
              {Object.keys(customerPoints[customerId]).map((month) => (
                <li key={month}>
                  {month}: {customerPoints[customerId][month]} points
                </li>
              ))}
              <li>
                <strong>Total: </strong>
                {Object.values(customerPoints[customerId]).reduce(
                  (total, points) => total + points,
                  0
                )}{' '}
                points
              </li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
