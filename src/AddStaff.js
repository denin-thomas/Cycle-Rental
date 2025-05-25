import React, { useState } from 'react';
import './App.css';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from './Footer';

function AddStaff() {
  const navigate=useNavigate();
  console.log('Rendering AddStaff component');
  const [formData, setFormData] = useState({

    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: 'M', // Default to Male
    state: '',
    district: '',
    pin: '',
    street: '',
    hno: '',
    dob: '',
login_type:''

  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log('Form Submitted');
    if (!formData.passwordsMatch) {
      console.error('Passwords do not match');
      alert('Passwords do not match');
      return;
    }
    // Send a POST request to the server with the form data
    fetch('http://localhost:3001/api/addStaff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => console.log(data),
      navigate('/viewstaff')
      )
      .catch(error => console.error('Error:', error));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field ${name} changed to ${value}`);
    setFormData({
      ...formData,
      [name]: value,
      passwordsMatch: name === 'confirmpassword' ? formData.createpassword === value : name === 'createpassword' ? formData.confirmpassword === value : formData.passwordsMatch,
    });
  };



  return (<>
    <div>
      <div className="addstaff-div">
        <h1><center>Add Staff</center></h1>
        <br />
        <form onSubmit={handleSubmit}>

          <div className='row'>
            <div className='col'>
              <label>First Name</label>


              <input
                type='text'
                placeholder='Enter  First Name'
                className='form-control'
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className='col'>
              <label >Middle Name</label>
              <input
                type='text'
                placeholder='Enter  Middle Name'
                className='form-control'
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
              />
            </div>
            <div className='col'>     
                 <label >Last Name</label>
              <input
                type='text'
                placeholder='Enter  Last Name'
                className='form-control'
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
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
                required
              />
            </div></div>
          <div className='row'><div className='col'>


            <label>Email</label>
            <input
              type='text'
              placeholder='Enter  Email'
              className='form-control'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
            <div className='col'>            <label>Phone Number</label>
              <input
                type='text'
                placeholder='Enter  Phone Number'
                className='form-control'
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div></div>
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
                required
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
                required
              />
            </div>
          </div>
          <div className='row'><div className='col'>
            <label>State</label>
            <input
              type='text'
              placeholder='Enter  State'
              name="state"
              className='form-control'
              value={formData.state}
              onChange={handleChange}
              required
            /></div><div className='col'>
              <label>District</label>
              <input
                type='text'
                placeholder='Enter  District'
                name="district"
                className='form-control'
                value={formData.district}
                onChange={handleChange}
                required
              /></div>
            <div className='col'>             <label>Pin</label>
              <input
                type='text'
                placeholder='Enter  Pin'
                className='form-control'
                name="pin"
                value={formData.pin}
                required
                onChange={handleChange}
              />

            </div></div>

          <div className='row'><div className='col'>



            <label>Street</label>
            <input
             required
              type='text'
              className='form-control'
              placeholder='Enter  Street'
              name="street"
              value={formData.street}
              onChange={handleChange}
            />
          </div><div className='col'>
              <label>House No.</label>
              <input
                type='text'
                placeholder='Enter  House No.'
                className='form-control'
                name="hno"
                required
                value={formData.hno}
                onChange={handleChange}
              />
            </div><div className='col'>          <label>Staff Type</label>
            <select
  className='form-control'
  name="login_type"
  value={formData.login_type}
  onChange={handleChange}
>  <option value="s">Management</option>

  <option value="m">Maintenance</option>

</select>
</div></div>
<br/>
<div className='row'>
<div className='col'>
          <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
            Add Staff
          </button>
          </div>
          </div>
        </form>
      </div>
    </div><Footer/></>
  );
}

export default AddStaff;
