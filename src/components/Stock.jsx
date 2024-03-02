import React, { useState } from 'react';
import { Button, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';

const StockManagementModal = ({ showStockModal, onHideStockModal }) => {
  const [selectedStockAction, setSelectedStockAction] = useState('');
  const [stockData, setStockData] = useState({
    name: '',
    photo: null,
    size: '',
    quantity: '',
  });

  const handleStockActionClick = (action) => {
    setSelectedStockAction(action);
    setStockData({ name: '', photo: null, size: '', quantity: '' }); // Clear form data on action change
  };

  const handleInputChange = (event) => {
    setStockData({ ...stockData, [event.target.id]: event.target.value });
  };

  const handleImageUpload = (event) => {
    setStockData({ ...stockData, photo: event.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your logic to add or remove stock based on selectedStockAction and stockData
    console.log('Submitted stock data:', stockData);
    onHideStockModal(); // Close the modal after submission (optional)
  };

  return (
    <Modal show={showStockModal} onHide={onHideStockModal}>
      <Modal.Header closeButton>
        <Modal.Title>Stock Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="primary" onClick={() => handleStockActionClick('addStock')}>
          Add Stock
        </Button>
        <Button variant="secondary" onClick={() => handleStockActionClick('removeStock')}>
          Remove Stock
        </Button>

        {selectedStockAction === 'addStock' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Stock Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter stock name" value={stockData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Stock Photo:</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
            </Form.Group>
            <Form.Group controlId="size">
              <Form.Label>Size:</Form.Label>
              <Form.Control type="text" placeholder="Enter size" value={stockData.size} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" placeholder="Enter quantity" value={stockData.quantity} onChange={handleInputChange} />
            </Form.Group>
           
          </Form>
        )}

        {selectedStockAction === 'removeStock' && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Stock Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter stock name" value={stockData.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group controlId="size">
              <Form.Label>Size:</Form.Label>
              <Form.Control type="text" placeholder="Enter size" value={stockData.size} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="quantity">
              <Form.Label>Quantity:</Form.Label>
              <Form.Control type="number" placeholder="Enter quantity" value={stockData.quantity} onChange={handleInputChange} />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" onClick={onHideStockModal}>
      {selectedStockAction === 'removeStock'? 'Remove Stock': 'Add Stock'}
      </Button>
        <Button variant="secondary" onClick={onHideStockModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StockManagementModal;
