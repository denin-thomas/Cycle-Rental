import React, { useState } from 'react';
import Footer from './Footer';
function AddPackage() {
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Package Form Submitted:', formData);

    fetch('http://localhost:3001/api/addPackage', {
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
      name: '',
      duration: '',
      price: '',
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
    <div className='addpackage-div'>
      <h1><center>Add Package</center></h1>
      <br/>
    
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <th>
        <label>Package Name</label>
        <input
          type='text'
          placeholder='Enter Package Name'
          name="name"
          value={formData.name}
          onChange={handleChange}
          className='form-control'
        />
        </th>
</tr>
<tr><th>
        <label>Duration</label>
        <input
          type='number'
          placeholder='Enter Package Duration'
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className='form-control'
        />
        </th>
</tr>
<tr><th>
        <label>Price</label>
        <input
          type='number'
          placeholder='Enter Package Price'
          name="price"
          value={formData.price}
          onChange={handleChange}
          className='form-control'
        />
        </th>
</tr><tr>
<th>
        <label>Description</label>
        <input
          type='text'
          placeholder='Enter Package Description'
          name="description"
          value={formData.description}
          onChange={handleChange}
          className='form-control'
        /></th>
        </tr>
</table>
        <br />
        <br />
        <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Add Package
              </button>
    
      </form>
    </div><Footer/></>
  );
}

export default AddPackage;
