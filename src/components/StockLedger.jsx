import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { BASE_URL } from '../constant/constant';
import axios from 'axios';
import Swal from 'sweetalert2';
import Alert from './Alert';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash } from 'react-bootstrap-icons';

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [stockTypes, setStockTypes] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockSizes, setSelectedStockSizes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState("");

  const fetchData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/stock/stocks/`, config);
      if (response.data) {
        setStocks(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStockTypes = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/stock/stock-type/`, config);
      if (response.data) {
        setStockTypes(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Are you sure you want to delete this stock?',
    }).then((confirm) => {
      if (confirm) {
        const config = {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        };

        axios
          .delete(`${BASE_URL}/stock/stocks/${id}/`, config)
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
  const handleEditClick = async (stock) => {
    setSelectedStock(stock);
    setEditMode(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/stock/stock-type/${stock.stock_type}/`, config);
      if (response.data && response.data.size) {
        const sizesArray = response.data.size.split(',');
        const initialSizesState = sizesArray.map(size => ({ size, quantity: '' }));
        setSelectedStockSizes(initialSizesState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;

    if (id === 'stock_type') {
      // Clear sizes when stock type changes
      setSelectedStockSizes([]);
      setSelectedStock({
        ...selectedStock,
        stock_type: value,
      });

      // Fetch sizes for the selected stock type
      if (value) {
        fetchStockSizes(value);
      }
    } else {
      setSelectedStock({
        ...selectedStock,
        [id]: value,
      });
    }
  };

  const fetchStockSizes = async (stockTypeId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get(`${BASE_URL}/stock/stock-type/${stockTypeId}/`, config);
      if (response.data && response.data.size) {
        const sizesArray = response.data.size.split(',');
        const initialSizesState = sizesArray.map(size => ({ size, quantity: '' }));
        setSelectedStockSizes(initialSizesState);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSubmit = async () => {
    // Create FormData object
    const updatedStock = new FormData();

    const quantitiesArray = selectedStockSizes.map((sizeObj) => sizeObj.quantity || 0);
    const tmp = selectedStockSizes.map((sizeObj) => sizeObj.quantity);
    if(!selectedStock?.stock_type ||  tmp.includes('')) {
      Alert.error("Fill data properly");
      return;

    }
    // Append stock_type if available
    selectedStock?.stock_type && updatedStock.append("stock_type", selectedStock?.stock_type);

    // Extract quantities in the order of increased sizes

    // Append quantities as an array
    updatedStock.append("quantity", quantitiesArray?.toString());

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.patch(`${BASE_URL}/stock/stocks/${selectedStock?.id}/`, updatedStock, config);

      Alert.success("Successfully updated data");
      fetchData(authToken);
    } catch (error) {
      console.log(error);
      Alert.error("Error updating data");
    }

    setSelectedStock(null);
    setEditMode(false);
  };


  const handleSizeQuantityChange = (index, value) => {
    // Update the quantity for the selected size in the state
    const updatedSizes = [...selectedStockSizes];
    updatedSizes[index] = { size: updatedSizes[index].size, quantity: value };
    setSelectedStockSizes(updatedSizes);
  };
  console.log(selectedStockSizes);
  const handleCloseModal = () => {
    setSelectedStock(null);
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

    // Fetch data and stock types
    fetchData(token);
    fetchStockTypes(token);
  }, [authToken]);

  return (
    <>
      <Header />
      <div className="container pt-2">
        <h4 className=''>
          Stocks
        </h4>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
            <div className="card" style={{ backgroundColor: "#f0f7ff", borderRadius: '30px', paddingTop: '10px' }}>
              <div className="card-body overflow-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {
                  (!stocks || stocks?.length === 0) &&
                  <h2 className='text-center'>
                    No stocks Found!
                  </h2>
                }
                {stocks && stocks.length > 0 &&
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Stock Name</th>
                        {/* <th>Quantity</th> */}
                        <th>Sizes and quantity(s: q)</th>

                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                      {stocks?.map((stock) => (
                        <tr key={stock.id}>
                          <td>{stock.stock_name}</td>
                          {/* <td>{stock.quantity}</td> */}
                          <td>
                            {stock.size && stock.size?.length > 0 && (
                              <ul>
                                {stock.size.split(',').map((size, index) => (
                                  <li key={index}>{`${size}: ${stock.quantity?.split(',')?.[index] || 0}`}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                          <td className='text-center'>
                            <Button
                              variant="primary"
                              size="sm"
                              className='m-2'
                              onClick={() => handleEditClick(stock)}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className='m-2'
                              onClick={() => handleDelete(stock.id)}
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
            <Modal.Title>Edit Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="stock_type">
                <Form.Label>Stock Type</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStock?.stock_type || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Select Stock Type</option>
                  {stockTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.stock_types}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {selectedStockSizes.length > 0 &&
                <Row>
                  <Col>
                    <h5>Sizes and quantity</h5>
                    <div className="d-flex flex-wrap text-center justify-content-center">
                      {selectedStockSizes.map((size, index) => (
                        <div key={index} className="mb-3 p-3 border rounded mx-2">
                          <div className="align-items-center">
                            <div className="mr-2"><strong>{size.size}:</strong></div>
                            <Form.Control
                              type="number"
                              style={{ width: '70px' }}
                              // placeholder="Quantity"
                              value={size.quantity}
                              onChange={(e) => handleSizeQuantityChange(index, e.target.value)}
                              className="mr-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              }
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

export default StockTable;
