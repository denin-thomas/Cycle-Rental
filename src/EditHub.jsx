import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditHub = () => {
  const { ch_id } = useParams();
  const [hubData, setHubData] = useState(null);
  const [editedHub, setEditedHub] = useState({}); // Initialize as an empty object
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getHub/${ch_id}`);
      const data = await response.json();

      if (data.success) {
        setHubData(data.data);
        setEditedHub(data.data); // Initialize with hubData values
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ch_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedHub((prevHub) => ({
      ...prevHub,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edit Hub Form Submitted:', editedHub);

    fetch(`http://localhost:3001/api/updateHub/${ch_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedHub),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Hub updated:', data);
        // Refetch data after submitting the form
        navigate('/viewhub');
        fetchData();
      })
      .catch(error => {
        console.error('Error updating hub:', error);
      });

    setEditedHub({}); // Reset editedHub after submitting
  };

  return (
    <div className='addpackage-div'>
      <h1><center>Edit Cycle Hub</center></h1>
      {hubData ? (
        <div>
          <form onSubmit={handleSubmit}>
            <table>
              <tr>
                <th>
                  <label>State</label>
                  <input
                    type='text'
                    placeholder='Enter State Name'
                    name="ch_state"
                    value={editedHub.ch_state || ''}
                    onChange={handleChange}
                    className='form-control'
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <label>District</label>
                  <input
                    type='text'
                    placeholder='Enter District Name'
                    name="ch_dist"
                    className='form-control'
                    value={editedHub.ch_dist || ''}
                    onChange={handleChange}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <label>Street</label>
                  <input
                    type='text'
                    placeholder='Enter Street Name'
                    name="ch_street"
                    className='form-control'
                    value={editedHub.ch_street || ''}
                    onChange={handleChange}
                  />
                </th>
              </tr>
              <tr>
                <th>
                  <label>Capacity</label>
                  <input
                    type='number'
                    className='form-control'
                    placeholder='Enter Cycle Hub Capacity'
                    name="ch_capacity"
                    value={editedHub.ch_capacity || ''}
                    onChange={handleChange}
                  />
                </th>
              </tr>
            </table>
            <br />
            <button type="submit" className="btn btn-primary btn-block mb-4">
              Edit Cycle Hub
            </button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditHub;
