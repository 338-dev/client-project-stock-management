import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';
import Swal from 'sweetalert2';
import Alert from './Alert';
import { Pencil, Trash } from 'react-bootstrap-icons';
import Header from './header';

function BankLedger() {
  const [entries, setEntries] = useState([]);
  const [finalAmountTotal, setFinalAmountTotal] = useState(null);

  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [authToken, setAuthToken] = useState("");

  const fetchData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/stock/bank/`, config);
      if (response.data?.entries) {
        setEntries(response.data?.entries);
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
      text: 'Are you sure you want to delete this entry?',
    })
      .then((confirm) => {
        if (confirm) {
          const config = {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          };

          axios
            .delete(
              `${BASE_URL}/stock/bank/${id}`,
              config
            )
            .then(() => {
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

  const handleEditClick = (entry) => {
    setSelectedEntry(entry);
    setEditMode(true);
  };

  const handleEditSubmit = async () => {
    const updatedEntry = new FormData();
    ![null, undefined].includes(selectedEntry?.amount_debit) && updatedEntry.append("amount_debit", selectedEntry?.amount_debit);
    ![null, undefined].includes(selectedEntry?.amount_credit) && updatedEntry.append("amount_credit", selectedEntry?.amount_credit);
    updatedEntry.append("debit_from", selectedEntry?.debit_from || '');
    updatedEntry.append("credit_from", selectedEntry?.credit_from || '');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      await axios.patch(`${BASE_URL}/stock/bank/${selectedEntry?.id}/`, updatedEntry, config);
      fetchData(authToken);
      Alert.success("Successfully updated data");
    } catch (error) {
      console.log(error);
      Alert.error("Error updating data");
    }

    setSelectedEntry(null);
    setEditMode(false);
  };

  const handleInputChange = (event) => {
    setSelectedEntry({
      ...selectedEntry,
      [event.target.id]: event.target.value,
    });
  };

  const handleCloseModal = () => {
    setSelectedEntry(null);
    setEditMode(false);
  };

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
      // Redirect to login page or handle unauthorized access
    }

    fetchData(token);
  }, []);

  return (
    <>
    <Header/>
      <div className="container pt-2">
        <h4 className=''>
          Bank Ledger Entries
        </h4>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
            <div className="card" style={{ backgroundColor: "#f0f7ff", borderRadius: '30px', paddingTop: '10px' }}>
            {
                  (!entries || entries?.length === 0) &&
                  <h2 className='text-center'>
                    No Bank entries Found!
                  </h2>
                }
              {finalAmountTotal!==null && <h4 className='text-center'>Final amount:
              <span className={Number(finalAmountTotal)<0?'text-danger': 'text-success'}>
                {` ₹`+finalAmountTotal}
                </span>
                </h4>}
              <div className="card-body overflow-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount Debit</th>
              <th>Amount Credit</th>
              <th>Debit From</th>
              <th>Credit From</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                <td className={'text-danger'}>{entry.amount_debit?'↓ ₹'+entry.amount_debit : '—'}</td>
                <td className={'text-success'}>{entry.amount_credit?'↑ ₹'+entry.amount_credit : '—'}</td>
                <td>{entry.debit_from || '—'}</td>
                <td>{entry.credit_from || '—'}</td>
                <td className='text-center'>
                  <Button
                    variant="primary"
                    size="sm"
                    className='m-2'
                    onClick={() => handleEditClick(entry)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className='m-2'
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
</div>
</div>
</div>
</div>

        <Modal show={editMode} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="amount_debit">
                <Form.Label>Amount Debit</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEntry?.amount_debit || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount_credit">
                <Form.Label>Amount Credit</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedEntry?.amount_credit || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="debit_from">
                <Form.Label>Debit From</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedEntry?.debit_from || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="credit_from">
                <Form.Label>Credit From</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedEntry?.credit_from || ''}
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

export default BankLedger;
