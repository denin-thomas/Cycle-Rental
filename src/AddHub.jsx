import React, { useState } from 'react';
import Footer from './Footer';
function AddHub() {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    street: '',
    capacity: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package Form Submitted:', formData);

    fetch('http://localhost:3001/api/addHub', {
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
      state: '',
      district: '',
      street: '',
      capacity: '',
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
    <div className='addpackage-div'>
      <h1><center>Add Cycle Hub</center></h1>
      <br/>
      <br/>
      <form onSubmit={handleSubmit}>
        <table>
        <tr>
          <th>
          
        <label>State</label>
    
        <input
          type='text'
          placeholder='Enter State Name'
          name="state"
          value={formData.state}
          onChange={handleChange}
          className='form-control'
        />
        </th>
</tr>
<tr><th>
        <label>District</label>
        <input
          type='text'
          placeholder='Enter District Name'
          name="district"
          className='form-control'
          value={formData.district}
          onChange={handleChange}
        />
        </th>
</tr>
<tr><th>
        <label>street</label>
        <input
          type='text'
          placeholder='Enter Street Name'
          name="street"
          className='form-control'
          value={formData.street}
          onChange={handleChange}
        />
        </th>
</tr><tr>
<th>
        <label>Capacity</label>
        <input
          type='number'
          className='form-control'
          placeholder='Enter Cycle Hub Capacity'
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
        /></th>
        </tr>
</table>
        <br />
        <br />
        <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Add Cycle Hub
              </button>
    
      </form>
    </div>
  <Footer/></>
  );
}

export default AddHub;
