
import React, { useState } from 'react';

export default function AddFeedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno:'',
    feedback:''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation example (you can customize this based on your requirements)
    if (!formData.name || !formData.feedback || !formData.phno || !formData.email) {
      console.error('Please fill in all fields');
      // You might want to update the UI to show an error to the user
      return;
    }

    console.log('Category Form Submitted:', formData);

    // Sending data to the server
    fetch('http://localhost:3001/api/addFeedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Feedback added:', data);
        // You might want to update the UI to show success to the user
      })
      .catch(error => {
        console.error('Error adding Feedback:', error);
        // You might want to update the UI to show an error to the user
      });

    // Clearing the form data after submission
    setFormData({
      name: '',
      email: '',
      phno:'',
      feedback:''
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
  return (
    <div className='add-feedback-div'>
      <h1><center>Send Feedback</center></h1>
      <br/>
      <form>
  <div class="form-group row">
    <div className='col'>
    <label for="exampleFormControlInput1">Name</label>
            <input type="email" 
            class="form-control" 
            id="exampleFormControlInput1" 
            placeholder="name"
              name="name"
              value={formData.name}
              onChange={handleChange}/>
  </div><div className='col'>
  
    <label for="exampleFormControlInput1">Phone No</label>
    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="1234567890"  name="phno"
              value={formData.phno}
              onChange={handleChange}/>
  </div></div>
  <div className='form-group'>
  <label for="exampleFormControlInput1">Email address</label>
    <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"   name="email"
              value={formData.email}
              onChange={handleChange}/>
  </div>
  <div class="form-group">
    <label for="exampleFormControlTextarea1">Feedback</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"   name="feedback"
              value={formData.feedback}
              onChange={handleChange}></textarea>
  </div>
  <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Send Feedback
              </button>
</form>
      </div>
  )
}
