import React, { useState } from "react";
import "./Home.css";
import TitleCard from "../components/TiltleCard/TitleCard";
import { Modal, Button, Form } from "react-bootstrap";
const Home = () => {
  const [showGallaModal, setShowGallaModal] = useState(false);
  const [selectedGallaOption, setSelectedGallaOption] = useState(null);
  const [selectedCashInOption, setSelectedCashInOption] = useState(null);

  const handleGallaClick = () => {
    setShowGallaModal(true);
  };

  const handleGallaOptionClick = (option) => {
    setSelectedGallaOption(option);
    setShowGallaModal(true);
  };

  const handleCashInOptionClick = (option) => {
    setSelectedCashInOption(option);
  };

  const handleCloseModal = () => {
    setShowGallaModal(false);
    setSelectedGallaOption(null);
    setSelectedCashInOption(null);
  };

  return (
    <>
      <h3>Stock Management</h3>

      <div className="home">
        <div className="card-group">
          <TitleCard title="Stock" />
          <TitleCard title="Galla" onClick={handleGallaClick} />
          <TitleCard title="Sales" />
          <TitleCard title="Purchase" />
          <TitleCard title="Bank" />
          <TitleCard title="Tailor Ledger" />
          <TitleCard title="Customer Ledger" />
          <TitleCard title="Shop Expense" />
          <TitleCard title="Personal Expense" />
          <TitleCard title="Price List" />
        </div>

        {/* Galla Modal */}
        <Modal show={showGallaModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Galla Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Cash In Options */}
            <Button
              variant="primary"
              onClick={() => handleGallaOptionClick("Cash In")}
            >
              Cash In
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={() => handleGallaOptionClick("Cash Out")}
            >
              Cash Out
            </Button>
            {selectedGallaOption === "Cash In" && (
              <>
                <h5>Choose Cash In Option:</h5>
                <Button
                  onClick={() => handleCashInOptionClick("Customer Payment")}
                  className="mr-2"
                >
                  Customer Payment
                </Button>
                <Button onClick={() => handleCashInOptionClick("Cash Payment")}>
                  Cash Payment
                </Button>
                {/* Selected Cash In Option: Customer Payment */}
                {selectedCashInOption === "Customer Payment" && (
                  <Form>
                    <Form.Group controlId="customerName">
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                      />
                    </Form.Group>
                    <Form.Group controlId="amount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control type="number" placeholder="Enter amount" />
                    </Form.Group>
                    <Form.Group controlId="receipt">
                      <Form.Label>Upload Receipt</Form.Label>
                      <Form.Control type="file" />
                    </Form.Group>
                  </Form>
                )}
                {/* Selected Cash In Option: Cash Payment */}
                {selectedCashInOption === "Cash Payment" && (
                  <Form>
                    <Form.Group controlId="amount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control type="number" placeholder="Enter amount" />
                    </Form.Group>
                    <Form.Group controlId="billNumber">
                      <Form.Label>Bill Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter bill number"
                      />
                    </Form.Group>
                  </Form>
                )}
              </>
            )}
            {/* Add other options and their respective forms here */}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowGallaModal(false)}
            >
              Close
            </Button>
            <Button variant="primary" onClick={() => setShowGallaModal(false)}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add modals for other options as needed */}
      </div>
    </>
  );
};

export default Home;
