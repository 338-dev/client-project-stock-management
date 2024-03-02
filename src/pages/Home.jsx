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
  const [selectedCashOutOption, setSelectedCashOutOption] = useState(null);
  const [amountTailor, setAmountTailor] = useState("");
  const [receiptTailor, setReceiptTailor] = useState(null); // State to store the uploaded file
  const [amountExpense, setAmountExpense] = useState("");
  const [reason, setReason] = useState("");
  const [amountCash, setAmountCash] = useState("");
  const [billNumber, setBillNumber] = useState("");
  const [tailorName, setTailorName] = useState("");
  const [tailorCode, setTailorCode] = useState("");
  const [tailorBillNumber, setTailorBillNumber] = useState("");

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

  const handleCustomerPaymentSubmit = () => {
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

  const handleCashPayementSubmit = () => {
    // Check for form validation
    const errors = {};
    if (!amountCash) {
      errors.amountCash = "Amount is required";
    }
    if (!billNumber) {
      errors.billNumber = "Bill Number is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("payment_type", "Cash payment");
    formData.append("amount_credit", amountCash);
    formData.append("bill_number", billNumber);

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        "https://stock-management-be.vercel.app//galla/cash-in-cash-out/",
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
  const handleCashOutOptionClick = (option) => {
    setSelectedCashOutOption(option);
  };

  const handleTailorPaymentSubmit = () => {
    // Check for form validation
    const errors = {};
    if (!tailorName.trim()) {
      errors.tailorName = "Tailor name is required";
    }
    if (!tailorCode.trim()) {
      errors.tailorCode = "Tailor code is required";
    }
    if (!amountTailor.trim()) {
      errors.amountTailor = "Amount is required";
    }
    if (!tailorBillNumber) {
      errors.tailorBillNumber = "Receipt is required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("expense_name", "Tailor payment");
    formData.append("amount_debit", amountTailor);
    formData.append("tailer_name", tailorName);
    formData.append("tailer_code", tailorCode);
    formData.append("bill_number", tailorBillNumber);

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        "https://stock-management-be.vercel.app//galla/cash-in-cash-out/",
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
  const handleShopExpenseSubmit = () => {
    // Check for form validation
    const errors = {};

    if (!amountExpense) {
      errors.amountTailor = "Amount is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("expense_name", "shop expense");

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        "https://stock-management-be.vercel.app//galla/cash-in-cash-out/",
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
  const handleShopOrPersonalyExpenseSubmit = (expanseName) => {
    // Check for form validation
    const errors = {};

    if (!amountExpense) {
      errors.amountTailor = "Amount is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("expense_name", expanseName);
    formData.append("amount_debit", amountExpense);

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        "https://stock-management-be.vercel.app//galla/cash-in-cash-out/",
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
    } else if (
      selectedGallaOption === "Cash Out" &&
      selectedCashOutOption === "Tailor Payment"
    ) {
      handleTailorPaymentSubmit();
    } else if (
      selectedGallaOption === "Cash In" &&
      selectedCashOutOption === "Cash Payment"
    ) {
      handleCashPayementSubmit();
    } else if (
      selectedGallaOption === "Cash Out" &&
      selectedCashOutOption === "Shop Expenses"
    ) {
      handleShopOrPersonalyExpenseSubmit("shop expense");
    } else if (
      selectedGallaOption === "Cash Out" &&
      selectedCashOutOption === "Personal Expense"
    ) {
      handleShopOrPersonalyExpenseSubmit("personal expense");
    }

    // Add other condition checks and corresponding function calls here
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

                {/* Selected Cash In Option: Cash Payment */}
                {selectedCashInOption === "Cash Payment" && (
                  <Form>
                    <Form.Group controlId="amountCash">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amountCash}
                        onChange={(e) => setAmountCash(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="billNumber">
                      <Form.Label>Bill Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter bill number"
                        value={billNumber}
                        onChange={(e) => setBillNumber(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Form>
                )}
              </>
            )}
            {/* Add other options and their respective forms here */}
            {/* Cash Out Options */}
            {selectedGallaOption === "Cash Out" && (
              <>
                <h5>Choose Cash Out Option:</h5>
                <Button
                  onClick={() => handleCashOutOptionClick("Tailor Payment")}
                  className="mr-2"
                >
                  Tailor Payment
                </Button>
                <Button
                  onClick={() => handleCashOutOptionClick("Shop Expenses")}
                >
                  Shop Expenses
                </Button>
                <Button
                  onClick={() => handleCashOutOptionClick("Personal Expense")}
                >
                  Personal Expense
                </Button>
                {/* Selected Cash Out Option: Tailor Payment */}
                {selectedCashOutOption === "Tailor Payment" && (
                  <Form>
                    <Form.Group controlId="tailorName">
                      <Form.Label>Tailor Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter tailor name"
                        value={tailorName}
                        onChange={(e) => setTailorName(e.target.value)}
                        required
                      />
                      {formErrors.tailorName && (
                        <Form.Text className="text-danger">
                          {formErrors.tailorName}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="tailorCode">
                      <Form.Label>Tailor Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter tailor code"
                        value={tailorCode}
                        onChange={(e) => setTailorCode(e.target.value)}
                        required
                      />
                      {formErrors.tailorCode && (
                        <Form.Text className="text-danger">
                          {formErrors.tailorCode}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="amountTailor">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amountTailor}
                        onChange={(e) => setAmountTailor(e.target.value)}
                        required
                      />
                      {formErrors.amountTailor && (
                        <Form.Text className="text-danger">
                          {formErrors.amountTailor}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="receiptTailor">
                      <Form.Label>Bill Number</Form.Label>
                      <Form.Control
                        type="text"
                        onChange={(e) => setTailorBillNumber(e.target.value)}
                        placeholder="Enter bill number"
                        value={tailorBillNumber}
                        required
                      />
                      {formErrors.billNumber && (
                        <Form.Text className="text-danger">
                          {formErrors.billNumber}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Form>
                )}
                {/* Selected Cash Out Option: Shop Expenses */}
                {selectedCashOutOption === "Shop Expenses" && (
                  <Form>
                    <Form.Group controlId="amountExpense">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amountExpense}
                        onChange={(e) => setAmountExpense(e.target.value)}
                        required
                      />
                      {formErrors.amountExpense && (
                        <Form.Text className="text-danger">
                          {formErrors.amountExpense}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="reason">
                      <Form.Label>Reason</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                      {formErrors.reason && (
                        <Form.Text className="text-danger">
                          {formErrors.reason}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Form>
                )}
                {/* Selected Cash Out Option: Personal Expense */}
                {selectedCashOutOption === "Personal Expense" && (
                  <Form>
                    <Form.Group controlId="amountExpense">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        value={amountExpense}
                        onChange={(e) => setAmountExpense(e.target.value)}
                        required
                      />
                      {formErrors.amountExpense && (
                        <Form.Text className="text-danger">
                          {formErrors.amountExpense}
                        </Form.Text>
                      )}
                    </Form.Group>
                    <Form.Group controlId="reason">
                      <Form.Label>Reason</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                      />
                      {formErrors.reason && (
                        <Form.Text className="text-danger">
                          {formErrors.reason}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Form>
                )}

                {/* Add other Cash Out options and their respective forms here */}
              </>
            )}
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
      </div>
    </>
  );
};

export default Home;
