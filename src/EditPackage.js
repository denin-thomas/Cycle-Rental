import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from './Footer';
const EditPackage = () => {
  const { package_id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [editedPackage, setEditedPackage] = useState({}); // Initialize as an empty object
const navigate=useNavigate();
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getPackage/${package_id}`);
      const data = await response.json();

      if (data.success) {
        setPackageData(data.data);
        setEditedPackage(data.data); // Initialize with packageData values
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [package_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedPackage((prevPackage) => ({
      ...prevPackage,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edit Package Form Submitted:', editedPackage);

    fetch(`http://localhost:3001/api/updatePackage/${package_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedPackage),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Package updated:', data);
        // Refetch data after submitting the form
        navigate('/viewpackage');
        fetchData();
      })
      .catch(error => {
        console.error('Error updating package:', error);
      });

    setEditedPackage({}); // Reset editedPackage after submitting
  };

  return (
    <>
      <div className='addpackage-div'>
        <h1><center>Edit Package</center></h1>
        {packageData ? (
          <div>
            <form onSubmit={handleSubmit}>
              <table>
                <tr>
                  <th>
                    <label>Package Name</label>
                    <input
                      type='text'
                      placeholder='Enter Package Name'
                      name="p_name"
                      value={editedPackage.p_name || ''}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Duration</label>
                    <input
                      type='number'
                      placeholder='Enter Package Duration'
                      name="p_duration"
                      value={editedPackage.p_duration || ''}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Price</label>
                    <input
                      type='number'
                      placeholder='Enter Package Price'
                      name="p_price"
                      value={editedPackage.p_price || ''}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </th>
                </tr>
                <tr>
                  <th>
                    <label>Description</label>
                    <input
                      type='text'
                      placeholder='Enter Package Description'
                      name="description"
                      value={editedPackage.description || ''}
                      onChange={handleChange}
                      className='form-control'
                    />
                  </th>
                </tr>
              </table>
              <br />
              <button type="submit" className="btn btn-primary btn-block mb-4">
                Edit Package
              </button>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default EditPackage;
