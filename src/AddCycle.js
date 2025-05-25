import React, { useState, useEffect, useRef } from 'react';
import CycleComponent from './CycleComponent';
import * as FileSaver from 'file-saver';
import QRCode from 'react-qr-code';
import Footer from './Footer';

function AddCycle() {
  const [categoryData, setCategoryData] = useState([]);
  const [hubData, setHubData] = useState([]);
  const [formData, setFormData] = useState({
    hub_id: '',
    subcat_id: '',
    date: '',
    image: null, // Adding image field to formData
  });
  const [cycleId, setCycleId] = useState(null);

  useEffect(() => {
    // Fetch category data
    fetch('http://localhost:3001/api/viewSubCat')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCategoryData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
    
    // Fetch hub data
    fetch('http://localhost:3001/api/viewHub')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setHubData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first selected file
    setFormData({
      ...formData,
      image: file, // Store the file in the formData state
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    formDataWithImage.append('hub_id', formData.hub_id);
    formDataWithImage.append('subcat_id', formData.subcat_id);
    formDataWithImage.append('date', formData.date);
    formDataWithImage.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:3001/api/addCycle', {
        method: 'POST',
        body: formDataWithImage,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Cycle added successfully. Cycle ID:', data.cycle_id);
      setCycleId(data.cycle_id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const baseUrl = 'http://localhost:3000/rentcycle';

  return (
    <>
      <div>
        <div className="addcycle-div">
          <h1><center>Add Cycle</center></h1>
          <br />
          <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>
                    <label>Cycle Name</label>
                    <input
                      type='text'
                      placeholder='Enter Cycle Name'
                      name="date"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Hub Id</label>
                    <select name="hub_id" className="form-control" value={formData.hub_id} onChange={handleChange}>
                      <option value="">Select Hub</option>
                      {hubData.map(hub => (
                        <option key={hub.ch_id} value={hub.ch_id}>{hub.ch_id}</option>
                      ))}
                    </select>
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Subcategory</label>
                    <select name="subcat_id" className="form-control" value={formData.subcat_id} onChange={handleChange}>
                      <option value="">Select Subcategory</option>
                      {categoryData.map(category => (
                        <option key={category.subcat_id} value={category.subcat_id}>{category.subcat_name}</option>
                      ))}
                    </select>
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Date</label>
                    <input
                      type='date'
                      placeholder='Enter Date'
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </th>
                </tr>
              </tbody>
            </table>
            <br />
            <button type="submit" className="btn btn-primary btn-block mb-4">
              Add Cycle
            </button>
          </form>
        </div>
        {/* Conditionally render the CycleComponent */}
        {cycleId && (
        <CycleComponent cycleId={cycleId} websiteUrl={baseUrl} width={600} height={600} />

        )}
      </div>
      <Footer />
    </>
  );
}

export default AddCycle;
