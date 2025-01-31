import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";

const AddFirm = () => {
  const [firmName, setFirmName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);

  const handleCategoryChange = (event) => {
    const value = event.target.value; // Changed and updated value assigning to value here!
    if (category.includes(value)) {
      setCategory(category.filter((item) => item !== value));
    } else {
      setCategory([...category, value]);
    }
  };

  const handleRegionChange = (event) => {
    const value = event.target.value;
    if (region.includes(value)) {
      setRegion(region.filter((item) => item !== value));
    } else {
      setRegion([...region, value]);
    }
  };

  const handleImageUpload = (event) => {
    const selectedImage = event.target.files[0];
    setFile(selectedImage);
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();

    if (!firmName || !area) {
      alert("Firm Name and Area are required.");
      return;
    }
    try {
      const loginToken = localStorage.getItem("loginToken");
      if (!loginToken) {
        console.error("User not Authenticated");
        alert("Please log in too add to firm");
        return;
      }

      const formData = new FormData(); // Creating an instance of FormData to send form data.
      formData.append("firmName", firmName); //append means pushing the value of 'firmName' to firmName
      formData.append("area", area);
      formData.append("offer", offer);
      formData.append("image", file);

      category.forEach((value) => {
        formData.append("category", value);
      });
      region.forEach((value) => {
        formData.append("region", value);
      });

      if (file) {
        formData.append("image", file);
      }

      // Log FormData entries
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Log formData to check if everything is correct before sending
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loginToken}`,
          "Content-Type": "application/json", //'token': `${loginToken}`
        },
        body: JSON.stringify({
          firmName: firmName,
          area: area,
          category: category,
          region: region,
          offer: offer,
          image: file,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setFirmName("");
        setArea("");
        setCategory([]);
        setRegion([]);
        setOffer("");
        setFile(null);
        alert("Firm added Successfully");
      } else if (data.message === "Vendor can have only one firm") {
        alert("Firm Exists. Only 1 firm can be addded ");
      } else {
        alert("Failed to add Firm");
      }
      console.log("This is firmId", data.firmId);
      const firmId = data.firmId;
      localStorage.setItem("firmId", firmId);
    } catch (error) {
      console.error("failed to add firm ", error);
      alert("Error adding Firm");
    }
  };

  return (
    <div className="firmSection">
      <form className="tableForm" onSubmit={handleFirmSubmit}>
        <h3>Add Firm</h3>
        <label>Firm Name</label>
        <input
          type="text"
          name="firmName"
          value={firmName}
          onChange={(e) => setFirmName(e.target.value)}
        />
        <label>Area</label>
        <input
          type="text"
          name="area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <div className="checkInp">
          <label>Category</label>
          <div className="inputsContainer">
            <div className="checkboxContainer">
              <label>Veg</label>
              <input
                type="checkbox"
                checked={category.includes("veg")}
                value="veg"
                onChange={handleCategoryChange}
              />
            </div>
            <div className="checkboxContainer">
              <label>Non-Veg</label>
              <input
                type="checkbox"
                checked={category.includes("non-veg")}
                value="non-veg"
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
        <label>Offer</label>
        <input
          type="text"
          name="offer"
          value={offer}
          onChange={(e) => setOffer(e.target.value)}
        />
        <div className="checkInp">
          <label>Region</label>
          <div className="inputsContainer">
            <div className="regBoxContainer">
              <label>South Indian</label>
              <input
                type="checkbox"
                checked={region.includes("south-indian")}
                value="south-indian"
                onChange={handleRegionChange}
              />
            </div>
            <div className="regBoxContainer">
              <label>North Indian</label>
              <input
                type="checkbox"
                checked={region.includes("north-indian")}
                value="north-indian"
                onChange={handleRegionChange}
              />
            </div>
            <div className="regBoxContainer">
              <label>Chinese</label>
              <input
                type="checkbox"
                checked={region.includes("chineese")}
                value="chineese"
                onChange={handleRegionChange}
              />
            </div>
            <div className="regBoxContainer">
              <label>Backery</label>
              <input
                type="checkbox"
                checked={region.includes("bakery")}
                value="bakery"
                onChange={handleRegionChange}
              />
            </div>
          </div>
        </div>

        <label>Firm Image</label>
        <input type="file" onChange={handleImageUpload} />
        <br />
        <div className="btnSubmit">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AddFirm;
