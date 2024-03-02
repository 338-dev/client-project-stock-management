import React, { useEffect, useState } from "react";
import "./Home.css";
import TitleCard from "../components/TiltleCard/TitleCard";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import StockManagementModal from "../components/Stock";
import Header from "../components/header";
const Home = () => {
  const [showGallaModal, setShowGallaModal] = useState(false);
  const [selectedGallaOption, setSelectedGallaOption] = useState(null);
  const [selectedCashInOption, setSelectedCashInOption] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);


  const navigate = useNavigate();

  useEffect(()=>{
    if(!localStorage.getItem('userDetails')){
      navigate('/login');
    }
  },[])
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

  const onHideModal = () => {
    setShowCustomerModal(false);
    // setSelectedGallaOption(null);
    // setSelectedCashInOption(null);
  };

  const onHideTailorModal = () => {
    setShowTailorModal(false);
    // setSelectedGallaOption(null);
    // setSelectedCashInOption(null);
  };

  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const [selectedTailorAction, setSelectedTailorAction] = useState('');
  const [tailorData, setTailorData] = useState({
    name: '',
    code: '',
  });

  const handleTailorActionClick = (action) => {
    setSelectedTailorAction(action);
    setTailorData({ name: '', code: '' }); // Clear form data on action change
  };

  const handleTailorInputChange = (event) => {
    setTailorData({ ...tailorData, [event.target.id]: event.target.value });
  };


  return (
    <>
      <Header/>

      <div className="home">
        <div className="card-group">
          <TitleCard title="Stock" onClick={()=>setShowStockModal(true)}/>
          <TitleCard title="Galla" onClick={handleGallaClick} />
          <TitleCard title="Sales" />
          <TitleCard title="Purchase" />
          <TitleCard title="Bank" />
          <TitleCard title="Tailor Ledger" />
          <TitleCard title="Customer Ledger" />
          <TitleCard title="Shop Expense" />
          <TitleCard title="Personal Expense" />
          <TitleCard title="Price List" />
          <TitleCard title="Customer Code" onClick={()=>setShowCustomerModal(true)}/>
          <TitleCard title="Tailor Code"  onClick={()=>setShowTailorModal(true)}/>
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

        <Modal show={showCustomerModal} onHide={onHideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Customer Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="primary" onClick={() => handleOptionClick('Create Customer')}>
          Create Customer
        </Button>
        <Button variant="secondary" onClick={() => handleOptionClick('Delete Customer')}>
          Delete Customer
        </Button>

        {selectedOption === 'Create Customer' && (
          <Form>
            <Form.Group controlId="customerName">
              <Form.Label>Customer Name</Form.Label>
              <Form.Control type="text" placeholder="Enter customer name" />
            </Form.Group>
            <Form.Group controlId="customerCode">
              <Form.Label>Customer Code</Form.Label>
              <Form.Control type="text" placeholder="Enter customer code" />
            </Form.Group>
          </Form>
        )}

        {selectedOption === 'Delete Customer' && (
          <Form>
            <Form.Group controlId="customerCode">
              <Form.Label>Customer Code</Form.Label>
              <Form.Control type="text" placeholder="Enter customer code" />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHideModal}>
          Close
        </Button>
        <Button variant="primary" disabled={!selectedOption}>
          {selectedOption === 'Create Customer' ? 'Save Customer' : 'Delete Customer'}
        </Button>
      </Modal.Footer>
    </Modal>
    

    <Modal show={showTailorModal} onHide={onHideTailorModal}>
      <Modal.Header closeButton>
        <Modal.Title>Tailor Management</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button variant="primary" onClick={() => handleTailorActionClick('addTailor')}>
          Add Tailor
        </Button>
        <Button variant="secondary" onClick={() => handleTailorActionClick('deleteTailor')}>
          Delete Tailor
        </Button>

        {selectedTailorAction === 'addTailor' && (
          <Form onSubmit={()=>{}}>
            <Form.Group controlId="name">
              <Form.Label>Tailor Name</Form.Label>
              <Form.Control type="text" placeholder="Enter tailor name" value={tailorData.name} onChange={handleTailorInputChange} required />
            </Form.Group>
            <Form.Group controlId="code">
              <Form.Label>Tailor Code</Form.Label>
              <Form.Control type="text" placeholder="Enter tailor code" value={tailorData.code} onChange={handleTailorInputChange} required />
            </Form.Group>
          </Form>
        )}

        {selectedTailorAction === 'deleteTailor' && (
          <>
          <p>Tailor Code</p>
          <Form.Control type="text" placeholder="Tailor Code" id="code" value={tailorData.code} onChange={handleTailorInputChange} />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
      <Button variant="primary" type="submit" onClick={()=>{}}>
          {selectedTailorAction === 'addTailor' ? 'Save Tailor' : 'Delete Tailor'}
          </Button>
        <Button variant="secondary" onClick={onHideTailorModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    <StockManagementModal onHideStockModal={()=>setShowStockModal(false)} showStockModal={showStockModal}/>
      </div>
    </>
  );
};

export default Home;
