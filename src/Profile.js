import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const Navigate = useNavigate();
  const [customerData, setCustomerData] = useState([]);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [editMode, setEditMode] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials for the session
      });

      const data = await response.json();

      if (data.success) {
        // Redirect or perform any other actions after successful logout
        console.log('Logout successful');
        Navigate('http://localhost:3000');
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log('Error during logout:', error.message);
    }
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/getCustomer')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('Data is', data.data)
          setCustomerData(data.data || []);
          setEditedCustomer(data.data || {});
        } else {
          console.log(data.message);
        }
      })
      .catch(fetchError => {
        console.log(fetchError.message);
      });
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedCustomer(prevCustomer => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Edited Customer:', editedCustomer);
  
    try {
      const response = await fetch('http://localhost:3001/api/updateCustomer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedCustomer),
      });
  
      const data = await response.json();
  
      if (data.success) {
        console.log('Customer updated:', data);
        // Optionally, you can update the customerData state with the editedCustomer data
        setCustomerData(editedCustomer);
        setEditMode(false); // Exit edit mode after successful submission
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  
  return (
   <>
          {editMode ? (<div className="edit-profile-div">
  <h1><center>Edit Profile</center></h1>
  <form onSubmit={handleSubmit}>
    <div className="row">
      <div className="col">
      <label>First Name</label>
        <input
          type="text"
          name="c_fname"
          value={editedCustomer.c_fname || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
      <div className="col">
      <label>Middle Name</label>
        <input
          type="text"
          name="c_mname"
          value={editedCustomer.c_mname || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
    </div>
    <div className="row">
      <div className="col">
      <label>Last Name</label>
        <input
          type="text"
          name="c_lname"
          value={editedCustomer.c_lname || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
   
      <div className="col">
      <label>State</label>
        <input
          type="text"
          name="c_state"
          value={editedCustomer.c_state || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
    </div>
    <div className="row">
      <div className="col">
      <label>District</label>
        <input
          type="text"
          name="c_dist"
          value={editedCustomer.c_dist || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
  
      <div className="col">
      <label>Street</label>
        <input
          type="text"
          name="c_street"
          value={editedCustomer.c_street || ''}
          onChange={handleChange}
          className='form-control'
        />
      </div>
    </div>
    
  </form>
  <br/>
  <button className="btn btn-danger btn-block mb-4" type="submit">Save</button>
   
 

</div>)
: (
            <div className="profile-div">
            <div className="profile-div-image"><img src="images/user.png" alt="Image 1"></img></div>
            <div className="row">
              <div className="col">
            <>
              <h3><center>{`${customerData.c_fname}${customerData.c_mname} ${customerData.c_lname}`}</center></h3>
              <h3>Email :  {customerData.email}</h3>
              <h3>Phno :  {customerData.phno}</h3>
          
            </>
            </div>
            </div>
            <div className="row">
              <div className="col">
            <button type="button"  class="btn btn-danger btn-block mb-4" onClick={handleEdit}>Edit </button>
            </div>
              <div className='col'>
                <button type="submit" onClick={handleLogout} class="btn btn-danger btn-block mb-4">
                  Log Out
                </button>
              </div>
            </div>
          </div>
            )}</>
 
  );
}

export default Profile;
