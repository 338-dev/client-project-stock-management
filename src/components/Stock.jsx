import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, InputGroup, FormControl } from "react-bootstrap";
import Swal from "sweetalert2";

const StockManagementModal = ({
  showStockModal,
  setShowStockModal,
  authToken,
}) => {
  // const [showStockModal, setShowStockModal] = useState(false);
  const [stockTypes, setStockTypes] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState("");
  const [stockTypeDetails, setStockTypeDetails] = useState({});
  const [quantity, setQuantity] = useState({});
  const [selectedStockSizes, setSelectedStockSizes] = useState([]);
  const [stockPhoto, setStockPhoto] = useState();

  useEffect(() => {
    // Fetch stock types when the component mounts
    fetchStockTypes();
  }, []);

  const fetchStockTypes = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };
    console.log(config, "=====");
    await axios
      .get("https://stock-management-be.vercel.app/stock/stock-type/", config)
      .then((response) => {
        setStockTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock types: ", error);
      });
  };

  const handleStockClick = () => {
    setShowStockModal(true);
  };
  console.log(selectedStockSizes);
  const handleStockTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedStockType(selectedType);
    const selectedStockObj = stockTypes.find((res) => res.id == selectedType);
    console.log(selectedType, selectedStockObj);
    if (selectedStockObj?.size) {
      setSelectedStockSizes(selectedStockObj.size.split(","));
      // selectedStockObj?.size.map((size) => {
      //   quantity[size] = 0;
      // });
      setQuantity({ ...quantity });
    } else {
      setSelectedStockSizes([]);
      // setQuantity({});
    }

    // Fetch details for the selected stock type
    // fetchStockTypeDetails(selectedType);
  };

  console.log(quantity, "]]]]]]]]]]]]]]]]]]]");
  const handleModalSubmit = async () => {
    if (!stockTypes || !stockPhoto) {
      Swal.fire({
        icon: "warning",
        // title: "Error!",
        text: "Fill all the details",
      });
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const formData = new FormData();
    const orderedQuantity = [];
    selectedStockSizes.map((res) => {
      orderedQuantity.push(quantity[res] ?? 0);
    });
    formData.append("quantity", orderedQuantity);
    formData.append("stock_type", selectedStockType);
    formData.append("stock_photo", stockPhoto);

    console.log(config, "=====");

    await axios
      .patch(
        "https://stock-management-be.vercel.app/stock/stocks/",
        formData,
        config
      )
      .then((response) => {
        setStockTypes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching stock types: ", error);
      });
  };
  // Handle form submission
  // You can access selectedStockType and quantity state variables here
  console.log("Selected Stock Type: ", selectedStockType);
  console.log("Quantity: ", quantity);
  // Implement your logic to submit data

  return (
    <Modal show={showStockModal} onHide={() => setShowStockModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select Stock Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="stockType">
          <Form.Label>Select Stock Type</Form.Label>
          <Form.Control
            as="select"
            onChange={handleStockTypeChange}
            value={selectedStockType}
          >
            <option value="">Select Stock Type</option>
            {stockTypes.map((stockType) => (
              <option key={stockType.id} value={stockType.id}>
                {stockType.stock_types}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {/* {Object.keys(stockTypeDetails).length > 0 && ( */}
        <Form>
          {selectedStockSizes.length > 0 && (
            <>
              <h5>Sizes and quantity</h5>
              <div className="d-flex flex-wrap text-center justify-content-center">
                {selectedStockSizes.map((size, index) => (
                  <div key={index} className="mb-3 p-3 border rounded mx-2">
                    <div className="align-items-center">
                      <div className="mr-2">
                        <strong>{size}:</strong>
                      </div>
                      <Form.Control
                        type="number"
                        style={{ width: "70px" }}
                        // placeholder="Quantity"
                        value={quantity[size]}
                        onChange={(e) =>
                          setQuantity({
                            ...quantity,
                            [size]: e.target.value,
                          })
                        }
                        className="mr-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Form>

        <Form.Group controlId="receipt">
          <Form.Label>Stock Photo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setStockPhoto(e.target.files[0])}
            required
          />
          {/* {formErrors.receipt && (
                        <Form.Text className="text-danger">
                          {formErrors.receipt}
                        </Form.Text>
                      )} */}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowStockModal(false)}>
          Close
        </Button>
        <Button variant="primary" onClick={handleModalSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StockManagementModal;
