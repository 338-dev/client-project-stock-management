import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';
import Swal from 'sweetalert2';
import Alert from './Alert';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'react-bootstrap-icons';

function TransactionTable() {
  const [transactions, setTransactions] = useState([]);
  const [finalAmountTotal, setFinalAmountTotal] = useState(null);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");


  const filterTransactionsByDate = (transactions) => {
    if (!startDate || !endDate) {
      return [];
    }

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
  };

  const fetchData = async (token) => {


    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(config);
      const response = await axios.get(`${BASE_URL}/galla/cash-in-cash-out/`, config); // Replace with your actual API URL
      if(response.data?.entries)
      setTransactions(response.data?.entries);

      setFinalAmountTotal(response.data?.finalAmountTotal);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   // Get auth token from localStorage
  //   const userDetails = localStorage.getItem("userDetails");
  //   if (userDetails) {
  //     const parsedDetails = JSON.parse(userDetails);
  //     setAuthToken(parsedDetails?.tokens?.access);
  //   }
  // }, []);
  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Are you sure you want to delete this transaction?',
    })
      .then((confirm) => {
        if (confirm) {
          const config = {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          };
          // Implement API call to delete transaction with id
          console.log(`Deleting transaction with id: ${id}`);
          // Update the transactions state after successful deletion
          setTransactions(transactions.filter((transaction) => transaction.id !== id));
          axios
            .delete(
              `${BASE_URL}/galla/cash-in-cash-out/${id}/`,
              config
            )
            .then((response) => {
              Alert.success('Successfully submitted!');
              fetchData(authToken);
              console.log(response.data);
              // Handle success response
            })
            .catch((error) => {
              Alert.error('Error deleting data');

              console.log("error", error);
              // Handle error
            });
        }
      });
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setEditMode(true);
  };

  const handleEditSubmit = async (event) => {
    // event.preventDefault();
    // const updatedTransaction = {
    //   // ...selectedTransaction,
    //   // Update relevant fields based on form values
    //   bill_number: selectedTransaction?.bill_number,
    //   expense_name: selectedTransaction?.expense_name,
    //   amount_debit: selectedTransaction?.amount_debit,
    //   amount_credit: selectedTransaction?.amount_credit,
    // };

    const updatedTransaction = new FormData();
    selectedTransaction?.bill_number && updatedTransaction.append("bill_number", selectedTransaction?.bill_number);
    selectedTransaction?.expense_name && updatedTransaction.append("expense_name", selectedTransaction?.expense_name);
    ![null, undefined].includes(selectedTransaction?.amount_debit) && updatedTransaction.append("amount_debit", selectedTransaction?.amount_debit);
    ![null, undefined].includes(selectedTransaction?.amount_credit) && updatedTransaction.append("amount_credit", selectedTransaction?.amount_credit);



    // Implement API call to update the transaction
    console.log(`Updating transaction:`, updatedTransaction);

    // Update the transactions state with the updated data (replace with your actual API call)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.patch(`${BASE_URL}/galla/cash-in-cash-out/${selectedTransaction?.id}/`, updatedTransaction, config);

      // const updatedTransactions = await response.data;
      fetchData(authToken)
      Alert.success("Successfully updated data");
      // setTransactions(updatedTransactions);
    } catch (error) {
      console.log(error);
      Alert.error("Error updating data");

    }
    // Handle error appropriately, e.g., display an error message to the user

    setSelectedTransaction(null);
    setEditMode(false);
  };

  const handleInputChange = (event) => {
    setSelectedTransaction({
      ...selectedTransaction,
      [event.target.id]: event.target.value,
    });
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setEditMode(false);
  };


  useEffect(() => {
    // Get auth token from localStorage
    const userDetails = localStorage.getItem("userDetails");
    const userDetailsExpire = localStorage.getItem("userDetailsExpire");

    const isValidTime = new Date() < new Date(userDetailsExpire)
    if (userDetails && isValidTime) {
      const parsedDetails = JSON.parse(userDetails);
      setAuthToken(parsedDetails?.tokens?.access);
    } else {
      navigate('/login');
    }
  }, []);



  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    const userDetailsExpire = localStorage.getItem("userDetailsExpire");
    let token;
    const isValidTime = new Date() < new Date(userDetailsExpire)
    if (userDetails && isValidTime) {
      const parsedDetails = JSON.parse(userDetails);
      token = parsedDetails?.tokens?.access;
      setAuthToken(token);
    } else {
      navigate('/login');
    }
    // Simulate API call
    fetchData(token, startDate, endDate);
  }, [startDate, endDate]);

  return (
    <>
      <Header />
      <div className="container pt-2">
        <h4 className=''>
          Cash in/Cash out Flow
        </h4>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
            <div className="card" style={{ backgroundColor: "#f0f7ff", borderRadius: '30px', paddingTop: '10px' }}>
              {finalAmountTotal!==null && <h4 className='text-center'>Final amount:
              <span className='text-danger'>
                {` ₹`+finalAmountTotal}
                </span>
                </h4>}
              <div className="card-body overflow-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {/* <Form>
                  <h5 className='text-center'>
                    Select start and end dates
                  </h5>
                  <Row className="mb-3">
                    <Col>
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </Col>

                    <Col>
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Col>
                  </Row>
                </Form> */}

                {
                  (!transactions || transactions?.length === 0) &&
                  <h2 className='text-center'>
                    No Transaction Found!
                  </h2>
                }
                {transactions && transactions.length>0 && <Table striped bordered hover responsive >
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Bill Number</th>
                      <th>Expense Name</th>
                      <th>Payment</th>
                      <th>Credit</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.map((transaction) => (
                      <React.Fragment key={transaction.id}>

                        <tr key={transaction.id}>
                          <td>{new Date(transaction.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                          <td>{transaction.bill_number || '—'}</td>
                          <td>{transaction.expense_name || '—'}</td>
                          <td className='text-success'>

                            {transaction.amount_debit
                              ? `↓ ₹ ${transaction.amount_debit}`
                              : '—'}
                          </td>
                          <td className='text-danger'>

                            {transaction.amount_credit ? `↑ ₹ ${transaction.amount_credit}` : '—'}
                          </td>
                          {/* <td>{transaction.finalAmount ? `₹ ${transaction.finalAmount}` : '—'}</td> */}
                          <td className='text-center'>
                          <Button
                    variant="primary"
                    size="sm"
                    className='m-2'
                    onClick={() => handleEditClick(transaction)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className='m-2'
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash />
                  </Button>
                          </td>
                        </tr>
                      </React.Fragment>

                    ))}
                  </tbody>
                </Table>}
              </div>
            </div>
          </div>
        </div>
        <Modal show={editMode} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Bootstrap-styled edit fields */}
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="bill_number">
                <Form.Label>Bill Number</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTransaction?.bill_number || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="expense_name">
                <Form.Label>Expense Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTransaction?.expense_name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount_debit">
                <Form.Label>Payment</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedTransaction?.amount_debit || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount_credit">
                <Form.Label>Credit</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedTransaction?.amount_credit || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>


            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleEditSubmit}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

export default TransactionTable;
