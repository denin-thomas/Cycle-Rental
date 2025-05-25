import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function SignUp() {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'Male', // Default to Male
    state: '',
    district: '',
    pin: '',
    street: '',
    hno: '',
    dob: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to ${value}`);
    setFormData({
      ...formData,
      [name]: value,
      passwordsMatch: name === 'confirmpassword' ? formData.createpassword === value : name === 'createpassword' ? formData.confirmpassword === value : formData.passwordsMatch,
    
    });
  };

  const handleSubmit = (e) => {
 
    e.preventDefault();
    console.log('Customer Form Submitted:', formData);
    if (!formData.passwordsMatch) {
      console.error('Passwords do not match');
      alert('Passwords do not match');
      return;
    }
    fetch('http://localhost:3001/api/editCustomer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('customer added:', data);
        Navigate('/home');
        // You might want to update the UI to show success to the user
      })
      .catch(error => {
        console.error('Error adding customer:', error);
         });
        }
  return (
    <div className='signup-div'>
     
      
      <h1>Edit Profile</h1>
      <br />
     
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col'>
          <label><h6>First Name</h6></label>
          <input
          className='form-control'
            type='text'
            placeholder='Enter Your First Name'
            name='firstName'
           
            value={formData.firstName}
            onChange={handleChange}
          />
          </div>
     
          <div className='col'>
          <label><h6>Middle Name</h6></label>
          <input
          className='form-control'
            type='text'
            placeholder='Enter Your Middle Name'
            name='middleName'
            value={formData.middleName}
            onChange={handleChange}
          />
          </div>
      
          <div className='col'>
          <label><h6>Last Name</h6></label>
          <input
          className='form-control'
            type='text'
            placeholder='Enter Your Last Name'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        </div>
        <div className='row'><div className='col'>
            <label>Gender</label>
            <select
  className='form-control'
  name="gender"
  value={formData.gender}
  onChange={handleChange}
>
  <option value="M">Male</option>
  <option value="F">Female</option>
  <option value="O">Others</option>
</select>
          </div>
            <div className='col'>
              <label>Date Of Birth</label>
              <input
                type='date'
                placeholder='Enter  D.O.B'
                className='form-control'
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div></div>
        <div className='row'>
          <div className='col'>
          <label><h6>Email</h6></label>
          <input
          className='form-control'
            type='text'
            placeholder='Enter Your Email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className='col'>
          <label><h6>Phone Number</h6></label>
          <input
          className='form-control'
            type='text'
            placeholder='Enter Your Phone Number'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          </div>
        </div>
        <div className='row'>
            <div className='col'>
              <label>Create Password</label>
              <input
                type='password' 
                placeholder='Create Password'
                className='form-control'
                name="createpassword"
                value={formData.createpassword}
                onChange={handleChange}
              />
            </div>
            <div className='col'>        
              <label>Confirm Password</label>
              <input
                type='password' 
                placeholder='Confirm Password'
                className='form-control'
                name="confirmpassword"
                value={formData.confirmpassword}
                onChange={handleChange}
              />
            </div>
          </div>
        <div className='row'><div className='col'>
            <label><h6>State</h6></label>
            <input
              type='text'
              placeholder='Enter Your State Name'
              name="state"
              className='form-control'
              value={formData.state}
              onChange={handleChange}
            /></div><div className='col'>
              <label><h6>District</h6></label>
              <input
                type='text'
                placeholder='Enter Your District Name'
                name="district"
                className='form-control'
                value={formData.district}
                onChange={handleChange}
              /></div>
            <div className='col'>            
             <label><h6>Pin</h6></label>
              <input
                type='text'
                placeholder='Enter Your  Pin'
                className='form-control'
                name="pin"
                value={formData.pin}
                onChange={handleChange}
              />

            </div></div>

          <div className='row'><div className='col'>



            <label><h6>Street</h6></label>
            <input
              type='text'
              className='form-control'
              placeholder='Enter  Your Street Name'
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div><div className='col'>
              <label><h6>House No.</h6></label>
              <input
                type='text'
                placeholder='Enter Your House No.'
                className='form-control'
                name="hno"
                value={formData.hno}
                onChange={handleChange}
              />
            </div></div>
<br/>

        <div className='row'><div className='col'>
        <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Sign Up
              </button>
    </div></div>
      </form>
    </div>
  );
}

export default SignUp;
