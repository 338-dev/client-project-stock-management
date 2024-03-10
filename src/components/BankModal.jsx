import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { BASE_URL } from '../constant/constant';
import Alert from './Alert';

const BankTransactionModal = ({ show, handleClose, auth }) => {
  const [transactionType, setTransactionType] = useState(null);
  const [amount, setAmount] = useState('');
  const [debitFrom, setDebitFrom] = useState('');
  const [creditFrom, setCreditFrom] = useState('');

  const handleTransactionType = (type) => {
    setTransactionType(type);
    setAmount('');
    setDebitFrom('');
    setCreditFrom('');
  };
  const handleTransactionSubmit = async () => {
    try {
      if (!transactionType || !amount) {
        Alert.error('Please select a transaction type and fill in the amount.');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      };
  
      const data = new FormData();
      if (transactionType === 'debit') {
        data.append('amount_debit', amount);
        data.append('debit_from', debitFrom);
      } else if (transactionType === 'credit') {
        data.append('amount_credit', amount);
        data.append('credit_from', creditFrom);
      }
  
      await axios.post(`${BASE_URL}/stock/bank/`, data, config);
  
      Alert.success('Transaction Successful');
      handleClose();
    } catch (error) {
      console.error(error);
      Alert.error('Error processing transaction');
    }
  };
  
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bank Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="primary" className="mr-2" onClick={() => handleTransactionType('debit')}>
          Debit
        </Button>
        <Button variant="success" onClick={() => handleTransactionType('credit')}>
          Credit
        </Button>

        {transactionType && (
          <Form className="mt-3">
            <Form.Group controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>

            {transactionType === 'debit' && (
              <Form.Group controlId="debitFrom">
                <Form.Label>Debit From</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter debit from"
                  value={debitFrom}
                  onChange={(e) => setDebitFrom(e.target.value)}
                />
              </Form.Group>
            )}

            {transactionType === 'credit' && (
              <Form.Group controlId="creditFrom">
                <Form.Label>Credit From</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter credit from"
                  value={creditFrom}
                  onChange={(e) => setCreditFrom(e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleTransactionSubmit}>
          Submit
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BankTransactionModal;
