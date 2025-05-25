import React from 'react'
import  { useState ,useEffect} from 'react';

import Footer from './Footer';
  
export default function AddMaintenance() {
  const [hubData, setHubData] = useState([]);
  useEffect(() => {
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
  const [staffData, setStaffData] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/api/viewStaff')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setStaffData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);
  const [formData, setFormData] = useState({
    ch_id:'',
      staff_id: '',
      date: '',
       description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package Form Submitted:', formData);

    fetch('http://localhost:3001/api/addMaintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Package added:', data);
        // You might want to update the UI to show success to the user
      })
      .catch(error => {
        console.error('Error adding package:', error);
        // You might want to update the UI to show an error to the user
      });

    setFormData({
      ch_id:'',
      staff_id: '',
      date: '',
       description: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to ${value}`);
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (<>
      <div className='addmaintenance-div'>
    <h1><center>Add Maintenance</center></h1>
    <br/>
    <br/>
    <form onSubmit={handleSubmit}>
      
        <div className='row'>
          <div className='col'>
          <label>Hub ID</label>
          <select name="ch_id" className="form-control" value={formData.ch_id} onChange={handleChange}>
                <option value="">Select Hub</option>
                {hubData.map(hub => (
                  <option key={hub.ch_id} value={hub.ch_id}>{hub.ch_id}</option>
                ))}
              </select>
      </div>
</div>
<div className='row'><div className='col'>
      <label>Staff</label>
      <select name="staff_id" className="form-control" value={formData.staff_id} onChange={handleChange}>
                <option value="">Select Hub</option>
                {staffData.map(staff => (
                  <option key={staff.staff_id} value={staff.staff_id}>{staff.s_fname}</option>
                ))}
              </select>
      </div>
</div>
<div className='row'><div className='col'>
      <label>Date</label>
      <input
        type='date'
        className='form-control'
        placeholder='Enter Maintenance Date'
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      </div>
</div>
<div className='row'><div className='col'>

      <label>Description</label>
      <input
        type='text'
        className='form-control'
        placeholder='Enter Maintenance Description'
        name="description"
        value={formData.description}
        onChange={handleChange}
      />
      </div>
      </div>

      <br />
      <br />
      <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
              Add Maintenance
            </button>
  
    </form>
  </div><Footer/></>
  )
}
