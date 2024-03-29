import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Alert from './Alert';
import { BASE_URL } from '../constant/constant';
import Header from './header';

const STOCK_SALES_URL = `${BASE_URL}/stock/sales/`;
const STOCK_TYPES_URL = `${BASE_URL}/stock/stock-type/`;

function StockSalesTable() {
  const [sales, setSales] = useState([]);
  const [stockTypes, setStockTypes] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [selectedStockType, setSelectedStockType] = useState(null);
  const [selectedSaleSizes, setSelectedSaleSizes] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleStockTypeChange = (event) => {
    setSelectedStockType(event.target.value);
    // setSizes(selectedType ? selectedType.size.split(',') : []);

  };

  const RenderSaleSizes = ({ stockTypeId, quantities }) => {
    // Find the stock type based on stockTypeId
    const stockType = stockTypes.find((type) => type.id === stockTypeId);

    if (!stockType || !stockType.size) {
      return null;
    }

    const sizes = stockType.size.split(',');

    return (
      <ul>
        {sizes.map((size, index) => (
          <li key={index}>{`${size}: ${quantities.split(',')?.[index] || 0}`}</li>
        ))}
      </ul>
    );
  };
  const handleSizeQuantityChange = (index, value) => {
    // Update the quantity for the selected size in the state
    const updatedSizes = [...selectedSaleSizes];
    updatedSizes[index] = { size: sizes[index], quantity: value };
    setSelectedSaleSizes(updatedSizes);
  };

console.log(selectedSaleSizes,"lllllllllllllllllll");
  const RenderStockSizes = () => {
    if (!selectedStockType) {
      return null;
    }
    const selectedType = stockTypes.find(type => type.stock_types === selectedStockType);
    
    if (!selectedType || !selectedType.size) {
      return null;
    }
    console.log(selectedSaleSizes);

    const sizes = selectedType.size.split(',');
    const handleSizeQuantityChange = (index, value) => {
      // Update the quantity for the selected size in the state
      const updatedSizes = [...selectedSaleSizes];
      updatedSizes[index] = { size: sizes[index], quantity: value };
      setSelectedSaleSizes(updatedSizes);
    };
  
    return (
      sizes.length > 0 &&
        <Row>
          <Col>
            <h5>Sizes and quantity</h5>
            <div className="d-flex flex-wrap text-center justify-content-center">
              {sizes.map((size, index) => (
                <div key={index} className="mb-3 p-3 border rounded mx-2">
                  <div className="align-items-center">
                    <div className="mr-2"><strong>{size}:</strong></div>
                    <Form.Control
                      type="number"
                      style={{ width: '70px' }}
                      // placeholder="Quantity"
                      value={selectedSaleSizes?.[index]?.quantity}
                      onChange={(e) => handleSizeQuantityChange(index, e.target.value)}
                      className="mr-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
    );
  };


  const fetchData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const salesResponse = await axios.get(STOCK_SALES_URL, config);
      const typesResponse = await axios.get(STOCK_TYPES_URL, config);

      const allStockTypes = await typesResponse.data;
      const salesData = await salesResponse.data;

      const salesWithSizes = salesData.map((sale) => {
        const stockType = allStockTypes.find((type) => type.id === sale.stock_type);
        return {
          ...sale,
          stockType,
        };
      });
      setSales(salesWithSizes);
      setStockTypes(typesResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Warning!',
      text: 'Are you sure you want to delete this sale entry?',
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
              `${STOCK_SALES_URL}${id}/`,
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

  const handleEditClick = (sale) => {
    setSelectedSale(sale);
    setEditMode(true);
    setSelectedStockType(null)
    setSelectedSaleSizes([])
    setSizes([]);
  };

console.log(selectedSale?.stock_type);
  const handleEditSubmit = async () => {
    const updatedSale = new FormData();

    const quantitiesArray = selectedSaleSizes?.map((sizeObj) => sizeObj?.quantity || 0);
    const tmp = selectedSaleSizes?.map((sizeObj) => sizeObj?.quantity) || [];

    console.log(tmp,"ppppppppp");
    if(!selectedStockType || (selectedStockType &&  (tmp.length===0 || tmp?.includes('')))) {
      Alert.error("Fill data properly");
      return;

    }
    updatedSale.append("customer_name", selectedSale?.customer_name || '');
    updatedSale.append("amount", selectedSale?.amount || '');
    updatedSale.append("quantity", quantitiesArray.toString() || '');
    updatedSale.append("payment_type", selectedSale?.payment_type || '');
    updatedSale.append("stock_type", selectedSale?.stock_type || '');
    updatedSale.append("bill_number", selectedSale?.bill_number || '');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      };
      await axios.patch(`${STOCK_SALES_URL}${selectedSale?.id}/`, updatedSale, config);
      fetchData(authToken);
      Alert.success("Successfully updated data");
    } catch (error) {
      console.log(error);
      Alert.error("Error updating data");
    }

    setSelectedSale(null);
    setEditMode(false);
  };

  const handleInputChange = (event) => {
    console.log(event.target.value);
    if (event.target.id === 'stock_type') {
      // Clear sizes when stock type changes
      setSelectedSaleSizes([]);
      setSelectedStockType(event.target.value);
      const selectedType = stockTypes?.find(type => type.stock_types === event.target.value);
    const stockSizes = selectedType?.size?.split(',');
    const initialSizesState = stockSizes.map(size => ({ size, quantity: '' }));
setSelectedSaleSizes(initialSizesState)
    console.log(stockSizes,'[[[[[[[[[[[[[[[[[[[[[[[');
      setSizes(stockSizes);
console.log(sizes);
      // Fetch sizes for the selected stock type
      // if (value) {
      //   fetchStockSizes(value);
      // }
    } else
    setSelectedSale({
      ...selectedSale,
      [event.target.id]: event.target.value,
    });
  };

  const handleCloseModal = () => {
    setSelectedSale(null);
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

  const RenderSaleSizesEdit = ({ sizes, quantities, handleSizeQuantityChange }) => {
    if (!sizes || sizes.length === 0) {
      return null;
    }
  
    return (
      <div className="mt-3">
        {sizes.map((size, index) => (
          <div key={index} className="mb-3">
            <div className="alert alert-primary" role="alert">
              {size}
            </div>
            <Form.Group controlId={`quantity-${index}`}>
              <Form.Label>Quantity for {size}</Form.Label>
              <Form.Control
                type="number"
                placeholder={`Enter quantity for ${size}`}
                value={quantities[index] || ''}
                onChange={(e) => handleSizeQuantityChange(index, e.target.value)}
              />
            </Form.Group>
          </div>
        ))}
      </div>
    );
  };
  const stockTypesMap = stockTypes.reduce((map, type) => {
    map[type.id] = type.stock_types;
    return map;
  }, {});
  console.log(selectedStockType)

  return (
    <>
    <Header/>
      <div className="container pt-2">
        <h4 className=''>
          Stock Sales Entries
        </h4>
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-10 col-sm-10 col-xs-10">
            <div className="card" style={{ backgroundColor: "#f0f7ff", borderRadius: '30px', paddingTop: '10px' }}>
              {/* {finalAmountTotal!==null && <h4 className='text-center'>Final amount:
              <span className={Number(finalAmountTotal)<0?'text-danger': 'text-success'}>
                {` ₹`+finalAmountTotal}
                </span>
                </h4>} */}
              <div className="card-body overflow-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Bill Number</th>
              <th>Amount</th>
              <th>Quantity</th>
              <th>Payment Type</th>
              <th>Stock Type</th>
              <th>Sizes and Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales?.map((sale) => (
              <tr key={sale.id}>
                <td>{new Date(sale.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                <td>{sale.customer_name || '—'}</td>
                <td>{sale.bill_number || '—'}</td>
                <td>{sale.amount || '—'}</td>
                <td>{sale.quantity || '—'}</td>
                <td>{sale.payment_type || '—'}</td>
                <td>{stockTypesMap[sale.stock_type] || '—'}</td>
                <td>
                <RenderSaleSizes stockTypeId={sale.stock_type} quantities={sale.quantity} />
                </td>
                <td className='text-center'>
                  <Button
                    variant="primary"
                    size="sm"
                    className='m-2'
                    onClick={() => handleEditClick(sale)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className='m-2'
                    onClick={() => handleDelete(sale.id)}
                  >
                    Delete
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
            <Modal.Title>Edit Sale Entry</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="customer_name">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSale?.customer_name || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="bill_number">
                <Form.Label>Bill Number</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSale?.bill_number || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="amount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedSale?.amount || ''}
                  onChange={handleInputChange}
                />
              </Form.Group>
              {/* <Form.Group controlId="quantity">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedSale?.quantity || ''}
                  onChange={handleInputChange}
                />
              </Form.Group> */}
              <Form.Group controlId="payment_type">
                <Form.Label>Payment Type</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedSale?.payment_type || ''}
                  onChange={(e)=>{handleInputChange(e);}}
                >
                  <option value="cash">Cash</option>
                  <option value="credit">Credit</option>
                  <option value="bank">Bank</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="stock_type">
              <Form.Label>Stock Type</Form.Label>
              <Form.Control
                as="select"
                value={selectedStockType || ''}
                // id={selectedSale?.stock_type}
                onChange={(e) => {
                  handleInputChange(e);
                  // handleStockTypeChange({ target: { value: selectedSale?.stock_type } });
                }}
              >
                <option value="">Select Stock Type</option>
                {stockTypes.map((type) => (
                  <option key={type.id} value={type.stock_types}>
                    {type.stock_types}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
{/* <RenderStockSizes/> */}
{sizes?.length> 0 && <Row>
          <Col>
            <h5>Sizes and quantity</h5>
            <div className="d-flex flex-wrap text-center justify-content-center">
              {sizes.map((size, index) => (
                <div key={index} className="mb-3 p-3 border rounded mx-2">
                  <div className="align-items-center">
                    <div className="mr-2"><strong>{size}:</strong></div>
                    <Form.Control
                      type="number"
                      style={{ width: '70px' }}
                      // placeholder="Quantity"
                      value={selectedSaleSizes?.[index]?.quantity}
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

export default StockSalesTable;
