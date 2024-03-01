import React, { useEffect, useState } from "react";
import "./Home.css";
import TitleCard from "../components/TiltleCard/TitleCard";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
const Home = () => {
  const [showGallaModal, setShowGallaModal] = useState(false);
  const [selectedGallaOption, setSelectedGallaOption] = useState(null);
  const [selectedCashInOption, setSelectedCashInOption] = useState(null);
  const [customerCode, setCustomerCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [formErrors, setFormErrors] = useState({}); // State to track form errors

  useEffect(() => {
    // Get auth token from localStorage
    const userDetails = localStorage.getItem("userDetails");
    if (userDetails) {
      const parsedDetails = JSON.parse(userDetails);
      setAuthToken(parsedDetails?.tokens?.access);
    }
  }, []);

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

  const handleCustomerPaymentSubmit = (e) => {
    // e.preventDefault();

    // Check for form validation
    const errors = {};
    if (!customerCode.trim()) {
      errors.customerCode = "Customer code is required";
    }
    if (!customerName.trim()) {
      errors.customerName = "Customer name is required";
    }
    if (!amount.trim()) {
      errors.amount = "Amount is required";
    }
    if (!receipt) {
      errors.receipt = "Receipt is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("amount_credit", amount);
    formData.append("bill_image", receipt);
    formData.append("customer_code", customerCode);
    formData.append("customer_name", customerName);

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        "https://stock-management-be.vercel.app/galla/customer-payment/",
        formData,
        config
      )
      .then((response) => {
        console.log(response.data);
        // Handle success response
      })
      .catch((error) => {
        console.log("error", error);
        // Handle error
      });
  };

  const handleModalSubmit = () => {
    if (
      selectedGallaOption === "Cash In" &&
      selectedCashInOption === "Customer Payment"
    ) {
      handleCustomerPaymentSubmit();
    } else {
      // handleCashInOutSubmit();
    }
  };

  return (
    <>
      <h3>Stock Management</h3>

      <div className="home">
        <div className="card-group">
          <TitleCard title="Stock" color="#FF5733" />
          <TitleCard title="Galla" onClick={handleGallaClick} color="#FFC300" />
          <TitleCard title="Sales" color="#FF5733" />
          <TitleCard title="Purchase" color="#33FFBD" />
          <TitleCard title="Bank" color="#338DFF" />
          <TitleCard title="Tailor Ledger" color="#8D33FF" />
          <TitleCard title="Customer Ledger" color="#FF33E9" />
          <TitleCard title="Shop Expense" color="#FF5733" />
          <TitleCard title="Personal Expense" color="#FFC300" />
          <TitleCard title="Price List" color="#FF5733" />
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
                    <Form.Group controlId="customerCode">
                      <Form.Label>Customer Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer code"
                        value={customerCode}
                        onChange={(e) => setCustomerCode(e.target.value)}
                        required
                      />
                      {formErrors.customerCode && (
                        <Form.Text className="text-danger">
                          {formErrors.customerCode}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="customerName">
                      <Form.Label>Customer Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter customer name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                      />
                      {formErrors.customerName && (
                        <Form.Text className="text-danger">
                          {formErrors.customerName}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="amount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      {formErrors.amount && (
                        <Form.Text className="text-danger">
                          {formErrors.amount}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="receipt">
                      <Form.Label>Upload Receipt</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setReceipt(e.target.files[0])}
                        required
                      />
                      {formErrors.receipt && (
                        <Form.Text className="text-danger">
                          {formErrors.receipt}
                        </Form.Text>
                      )}
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
            <Button variant="primary" onClick={handleModalSubmit}>
              {selectedGallaOption === "Cash In" &&
              selectedCashInOption === "Customer Payment"
                ? "Submit Customer Payment"
                : "Submit Cash In/Out"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Add modals for other options as needed */}
      </div>
    </>
  );
};

export default Home;
