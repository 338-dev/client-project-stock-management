import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';
import Swal from 'sweetalert2';
import Alert from './Alert';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'react-bootstrap-icons';

function CustomerPaymentTable() {
  const [customerPayments, setCustomerPayments] = useState([]);
  const [selectedCustomerPayment, setSelectedCustomerPayment] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");
  const [finalAmountTotal, setFinalAmountTotal] = useState(null);

  const fetchData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/galla/customer-payment/`, config);
      if (response.data?.entries) {
        setCustomerPayments(response.data.entries);
      }
      setFinalAmountTotal(response.data?.finalAmountTotal);

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Are you sure you want to delete this customer payment?',
    }).then((confirm) => {
      if (confirm) {
        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };

        axios
          .delete(`${BASE_URL}/galla/customer-payment/${id}/`, config)
          .then((response) => {
            Alert.success('Successfully deleted!');
            fetchData(authToken);
          })
          .catch((error) => {
            Alert.error('Error deleting data');
            console.log("error", error);
          });
      }
    });
  };

  const handleEditClick = (customerPayment) => {
    setSelectedCustomerPayment(customerPayment);
    setEditMode(true);
  };

  const handleEditSubmit = async () => {
    const updatedCustomerPayment = new FormData();
    selectedCustomerPayment?.amount_credit && updatedCustomerPayment.append("amount_credit", selectedCustomerPayment?.amount_credit);
    selectedCustomerPayment?.customer_code && updatedCustomerPayment.append("customer_code", selectedCustomerPayment?.customer_code);
    selectedCustomerPayment?.customer_name && updatedCustomerPayment.append("customer_name", selectedCustomerPayment?.customer_name);
    selectedCustomerPayment?.amount_debit && updatedCustomerPayment.append("amount_debit", selectedCustomerPayment?.amount_debit);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      const response = await axios.patch(`${BASE_URL}/galla/customer-payment/${selectedCustomerPayment?.id}/`, updatedCustomerPayment, config);

      Alert.success("Successfully updated data");
      fetchData(authToken);
    } catch (error) {
      console.log(error);
      Alert.error("Error updating data");
    }

    setSelectedCustomerPayment(null);
    setEditMode(false);
  };

  const handleInputChange = (event) => {
    setSelectedCustomerPayment({
      ...selectedCustomerPayment,
      [event.target.id]: event.target.value,
    });
  };

  const handleCloseModal = () => {
    setSelectedCustomerPayment(null);
    setEditMode(false);
  };

  useEffect(() => {
    const userDetails = localStorage.getItem("userDetails");
    const userDetailsExpire = localStorage.getItem("userDetailsExpire");
    const isValidTime = new Date() < new Date(userDetailsExpire);

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
    const isValidTime = new Date() < new Date(userDetailsExpire);

    if (userDetails && isValidTime) {
      const parsedDetails = JSON.parse(userDetails);
      token = parsedDetails?.tokens?.access;
      setAuthToken(token);
    } else {
      navigate('/login');
    }

    fetchData(token);
  }, [authToken]);

  return (
    <>
      <Header />
      <div className="container pt-2">
        <h4 className=''>
          Customer Payments
        </h4>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
            <div className="card" style={{ backgroundColor: "#f0f7ff", borderRadius: '30px', paddingTop: '10px' }}>
            {finalAmountTotal!==null && <h4 className='text-center'>Final amount:
              <span className={Number(finalAmountTotal)<0?'text-danger': 'text-success'}>
                {` ₹`+finalAmountTotal}
                </span>
                </h4>}
              <div className="card-body overflow-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {
                  (!customerPayments || customerPayments?.length === 0) &&
                  <h2 className='text-center'>
                    No customer payments Found!
                  </h2>
                }
                {customerPayments && customerPayments.length > 0 &&
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Amount Debit</th>
                        <th>Amount Credit</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerPayments.map((customerPayment) => (
                        <tr key={customerPayment.id}>
                          <td>{customerPayment.customer_code || '—'}</td>
                          <td>{customerPayment.customer_name || '—'}</td>
                          <td className={'text-danger'}>{
                          customerPayment.amount_debit?`↓ ₹`+customerPayment.amount_debit : '—'}</td>
                          <td className={'text-success'}>{customerPayment.amount_credit? '↑ ₹'+ customerPayment.amount_credit : '—'}</td>
                          <td className='text-center'>
                            <Button
                              variant="primary"
                              size="sm"
                              className='m-2'
                              onClick={() => handleEditClick(customerPayment)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className='m-2'
                              onClick={() => handleDelete(customerPayment.id)}
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                }
              </div>
            </div>
          </div>
        </div>
        <Modal show={editMode} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="customer_code">
                <Form.Label>Customer Code</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCustomerPayment?.customer_code || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="customer_name">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedCustomerPayment?.customer_name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount_debit">
                <Form.Label>Amount Debit</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedCustomerPayment?.amount_debit || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount_credit">
                <Form.Label>Amount Credit</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedCustomerPayment?.amount_credit || ''}
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

export default CustomerPaymentTable;
