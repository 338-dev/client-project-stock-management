import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Authentication/Login'; // Import your Login component
import Registration from './Authentication/Register'; // Import your Registration component (not included in provided prompt)
import Home from './pages/Home'; // Add a Home page (optional)
import TransactionTable from './components/CashInCashOut';
import BankLedger from './components/BankLedger';
import StockSalesTable from './components/SalesLedger';
import CustomerPaymentTable from './components/CustomerLedger';
import StockTable from './components/StockLedger';


const App = () => {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} index />
        <Route path="/register" element={<Registration />} />
        <Route path="/galla-ledger" element={<TransactionTable />} />
        <Route path="/stock-bank-ledger" element={<BankLedger />} />
        {/* <Route path="/sales-ledger" element={<StockSalesTable />} /> */}
        <Route path="/customer-ledger" element={<CustomerPaymentTable />} />
        <Route path="/stock-ledger" element={<StockTable />} />
        <Route path="/" element={<Home />} /> {/* Replace Home component with your protected route if needed */}
      </Routes>
    </Router>
    </div>
  );
};

export default App;
