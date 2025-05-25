import React, { useState } from 'react';
import Footer from './Footer';

function AddCategory() {
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example (you can customize this based on your requirements)
    if (!formData.category_name || !formData.category_description) {
      console.error('Please fill in all fields');
      // You might want to update the UI to show an error to the user
      return;
    }

    console.log('Category Form Submitted:', formData);

    // Sending data to the server
    fetch('http://localhost:3001/api/addCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Category added:', data);
        // You might want to update the UI to show success to the user
      })
      .catch(error => {
        console.error('Error adding category:', error);
        // You might want to update the UI to show an error to the user
      });

    // Clearing the form data after submission
    setFormData({
      category_name: '',
      category_description: '',
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
    <div className="addcategory-div">
      <h1><center>Add Category</center></h1>
    
       
      <form onSubmit={handleSubmit}>
      <table>
      <tr>
          <th>
        <label>Category Name</label>
        <input
          type="text"
          className='form-control'
          placeholder="Enter Category Name"
          name="category_name"
          value={formData.category_name}
          onChange={handleChange}
        />
</th></tr><tr><th>
        <label>Description</label>
        <input
          className='form-control'
          type="text"
          placeholder="Enter Category Description"
          name="category_description"
          value={formData.category_description}
          onChange={handleChange}
        />
</th>
       </tr>
</table>
        <br />
        <br />
        <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Add Category
              </button>
    
      </form>
    </div>
  <Footer/></>
  );
}

export default AddCategory;
