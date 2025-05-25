import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './App.css'; // Import your CSS file

const EditStaff = () => {
  const { staff_id } = useParams();
  const [staffData, setStaffData] = useState(null);
  const [editedStaff, setEditedStaff] = useState({});

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getStaff/${staff_id}`);
      const data = await response.json();

      if (data.success) {
        setStaffData(data.data);
        setEditedStaff(data.data);
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [staff_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value !== undefined ? value : staffData[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edit Staff Form Submitted:', editedStaff);

    fetch(`http://localhost:3001/api/updateStaff/${staff_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedStaff),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Staff updated:', data);
        fetchData();
      })
      .catch(error => {
        console.error('Error updating staff:', error);
      });

    setEditedStaff({});
  };

  return (
    <div>
      <div className="addstaff-div">
        <h1><center>Edit Staff</center></h1>
        {staffData ? (
          <div>
            <form onSubmit={handleSubmit}>
              <div className='row'>
                <div className='col'>
                  <label>First Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_fname'
                    value={editedStaff.s_fname || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className='col'>
                  <label>Middle Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_mname'
                    value={editedStaff.s_mname || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className='col'>
                  <label>Last Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_lname'
                    value={editedStaff.s_lname || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <label>Gender</label>
                  <select
                    className='form-control'
                    name='s_gender'
                    value={editedStaff.s_gender || ''}
                    onChange={handleChange}
                  >
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                    <option value='O'>Others</option>
                  </select>
                </div>
                <div className='col'>
                  <label>Date Of Birth</label>
                  <input
                    type='date'
                    className='form-control'
                    name='s_dob'
                    value={editedStaff.s_dob || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <label>State</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_state'
                    value={editedStaff.s_state || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className='col'>
                  <label>District</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_dist'
                    value={editedStaff.s_dist || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className='col'>
                  <label>Pin</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_pin'
                    value={editedStaff.s_pin || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <label>Street</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_street'
                    value={editedStaff.s_street || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className='col'>
                  <label>House No.</label>
                  <input
                    type='text'
                    className='form-control'
                    name='s_hno'
                    value={editedStaff.s_hno || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='row'>
                <div className='col'>
                  <button type='submit' className='btn btn-primary btn-block mb-4'>Edit Staff</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default EditStaff;
