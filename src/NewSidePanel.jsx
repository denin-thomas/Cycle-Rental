import React from 'react';
import './css/styles.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
export default function NewSidePanel() {
  const navigate = useNavigate();
  const [isStaffManagementClicked, setStaffManagementClicked] = useState(false);
const [isPackageManagementClicked,setPackageManagementClicked]=useState(false);
const[isHubManagementClicked,setHubManagementClicked]=useState(false);
const[isCategoryManagementClicked,setCategoryManagementClicked]=useState(false);
const[isSubCatManagementClicked,setSubcatManagementClicked]=useState(false);
const[isCycleManagementClicked,setCycleManagementClicked]=useState(false);
const[isMaintenanceManagementClicked,setMaintenanceManagementClicked]=useState(false);
const[isFeedbackManagementClicked,setFeedbackManagementClicked]=useState(false);
const[isRentalManagementClicked,setRentalManagementClicked]=useState(false);

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
      navigate('http://localhost:3000');
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.log('Error during logout:', error.message);
  }
};
const handleStaffManagementClick = () => {
  setStaffManagementClicked(!isStaffManagementClicked);
};
const handlePackageManagementClicked=()=>
{
setPackageManagementClicked(!isPackageManagementClicked);
}
const handleHubManagementClicked=()=>
{
setHubManagementClicked(!isHubManagementClicked);
}
const handleCategoryManagementClicked=()=>
{
setCategoryManagementClicked(!isCategoryManagementClicked);
}
const handleSubCatManagementClicked=()=>
{
setSubcatManagementClicked(!isSubCatManagementClicked);
}
const handleCycleManagementClicked=()=>
{
setCycleManagementClicked(!isCycleManagementClicked)
}
const handleMaintenanceManagementClicked=()=>
{
setMaintenanceManagementClicked(!isMaintenanceManagementClicked)
}
const handleFeedbackManagementClicked=()=>
{
setFeedbackManagementClicked(!isFeedbackManagementClicked)
}
const handleRentalManagementClicked=()=>
{
setRentalManagementClicked(!isRentalManagementClicked)
}
  return (
    <nav id="sidebar" >
      <div className="p-4 pt-5" id='side'>
       
        <ul className="list-unstyled components mb-5">
          <li className="active" >
            <a  onClick={handleStaffManagementClick} data-toggle="collapse"  style={{cursor: 'pointer'}} className="dropdown-toggle">Staff Management</a>
            {isStaffManagementClicked && (
        
            <ul>
              <li>
                <a href="/addstaff"  style={{cursor: 'pointer'}} >Add Staff</a>
              </li>
              <li>
                <a href="/viewstaff"  style={{cursor: 'pointer'}}>View Staff</a>
              </li>
             
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handlePackageManagementClicked} data-toggle="collapse"  style={{cursor: 'pointer'}} className="dropdown-toggle">Pacakage Management</a>
            {isPackageManagementClicked && (
        
            <ul>
              <li>
                <a href="/addpackage"  style={{cursor: 'pointer'}}>Add Package</a>
              </li>
              <li>
                <a href="/viewpackage"  style={{cursor: 'pointer'}}>View Pacakge</a>
              </li>
             
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleHubManagementClicked} data-toggle="collapse"   style={{cursor: 'pointer'}}className="dropdown-toggle">Cycle Hub Management</a>
            {isHubManagementClicked && (
        
            <ul>
              <li>
                <a href="/addhub"  style={{cursor: 'pointer'}}>Add Hub</a>
              </li>
              <li>
                <a href="/viewhub"  style={{cursor: 'pointer'}}>View Hub</a>
              </li>
             
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleCategoryManagementClicked} data-toggle="collapse"  style={{cursor: 'pointer'}} className="dropdown-toggle">Category Management</a>
            {isCategoryManagementClicked && (
        
            <ul>
              <li>
                <a href="/addcategory"  style={{cursor: 'pointer'}}>Add Category</a>
              </li>
              <li>
                <a href="/viewcategory"  style={{cursor: 'pointer'}}>View Category</a>
              </li>
              
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleSubCatManagementClicked} data-toggle="collapse"  style={{cursor: 'pointer'}} className="dropdown-toggle">Subcategory Management</a>
            {isSubCatManagementClicked && (
        
            <ul>
              <li>
                <a href="/addsubcategory"  style={{cursor: 'pointer'}}>Add Subategory</a>
              </li>
              <li>
                <a href="/viewsubcategory"  style={{cursor: 'pointer'}}>View Subategory</a>
              </li>
              
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleCycleManagementClicked} data-toggle="collapse"   style={{cursor: 'pointer'}}className="dropdown-toggle">Cycle Management</a>
            {isCycleManagementClicked && (
        
            <ul>
              <li>
                <a href="/addcycle"  style={{cursor: 'pointer'}}>Add Cycle</a>
              </li>
              <li>
                <a href="/viewcycle"  style={{cursor: 'pointer'}}>View Cycle</a>
              </li>
              
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleMaintenanceManagementClicked} data-toggle="collapse"  style={{cursor: 'pointer'}} className="dropdown-toggle">Maintenance Management</a>
            {isMaintenanceManagementClicked && (
        
            <ul>
              <li>
                <a href="/addmaintenance"  style={{cursor: 'pointer'}}>Assign Maintenance</a>
              </li>
              <li>
                <a href="/viewmaintenance"  style={{cursor: 'pointer'}}>View Maintenance</a>
              </li>
              
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleFeedbackManagementClicked}  style={{cursor: 'pointer'}} data-toggle="collapse"  className="dropdown-toggle">Feedback Management</a>
            {isFeedbackManagementClicked && (
        
            <ul>
            
              <li>
                <a href="/viewfeedback"  style={{cursor: 'pointer'}}>View Feedback</a>
              </li>
              
            </ul>
            
            )}
          </li>
          <li className="active" >
            <a  onClick={handleRentalManagementClicked} style={{cursor: 'pointer'}} data-toggle="collapse"  className="dropdown-toggle">Rental Management</a>
            {isRentalManagementClicked && (
        
            <ul>
              <li>
                <a href="/rentalreport"  style={{cursor: 'pointer'}}>Rental Details</a>
              </li>
             
              
            </ul>
            
            )}
          </li>
          <li>
          <a onClick={handleLogout} style={{cursor: 'pointer'}}>LogOut</a>

          </li>
          </ul>

      
      </div>
    </nav>
  );
}
