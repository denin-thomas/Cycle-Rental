// ... other imports
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Profile from './Profile';
import './App.css';

import NewSidePanel from './NewSidePanel';
function Head() {
  const [isProfileVisible, setProfileVisibility] = useState(false);
  const [isMenuVisible, setMenuVisibility] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [login_id, setLoginId] = useState('');
  const[login_type,setloginType]=useState('');
  const handleMenuClick = () => { navigate('/administrative');
    setMenuVisibility(!isMenuVisible);
   
  };

  const handleProfileClick = () => {
    setProfileVisibility(!isProfileVisible);
  };

  const handleClickOutsideProfile = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setProfileVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutsideProfile);

    return () => {
      document.removeEventListener('click', handleClickOutsideProfile);
    };
  }, []);

  const portalContainerId = 'profile-portal-container';
  useEffect(() => {
    fetch('http://localhost:3001')
      .then((res) => res.json())
      .then((data) => {
       
        if (data.valid) {
          setLoginId(data.login_id);
          setloginType(data.login_type)
          console.log(data.login_id);
         
        } 
      })
      .catch((err) => console.log(err))
      
  }, [navigate]);

  useEffect(() => {
    // Ensure that the portal container is created before rendering
    let portalContainer = document.getElementById(portalContainerId);

    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = portalContainerId;
      document.body.appendChild(portalContainer);
    }

    return () => {
      // Clean up the portal container if it was dynamically created
      if (document.body.contains(portalContainer)) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [portalContainerId]);

  // Retrieve the portal container after it's created
  const portalContainer = document.getElementById(portalContainerId);

  // Assuming session.login_id is the condition
  var shouldDisplayButton = login_id == '' ;
 
  var shouldDisplayRenting = login_type=='c';
  var shouldDisplayAdmin =login_id !== '' && login_type == 'a';
  var shouldDisplayMenu=login_id !== '' && ( login_type == 's'||login_type == 'a' ||login_type == 'm');
  var shouldDisplayProfile=login_id !== '' && ( login_type == 'c'||login_type == 'c' );
  var shouldDisplayAssigned=login_id !== '' &&  login_type == 'm';
  return (<>
    <div className='head'>
      { shouldDisplayProfile && (<button onClick={handleProfileClick} className='head-button'>
        Profile
      </button>)}
      <button onClick={() => navigate('/home')} className='head-button' >
        Home
      </button>
      {shouldDisplayRenting &&(<button onClick={() => navigate('/renting')} className='head-button' >
        Renting
      </button>)}
      {shouldDisplayAdmin && (<button onClick={() => navigate('/administrative')} className='head-button'>
        Admin
      </button>)}
      {shouldDisplayButton &&(
      <button onClick={() => navigate('/login')} className='head-button'>
        Login
      </button>)}
      {shouldDisplayButton &&(
      <button onClick={() => navigate('/signup')} className='head-button'>
        Sign Up
      </button>)}
      
        { shouldDisplayAssigned &&
      (<button onClick={() => navigate('/viewassignedjob')} className='head-button'>
        Assigned Job
      </button>)}
      {shouldDisplayMenu && (
        <button onClick={handleMenuClick} style={{ float: 'left' }} className='head-button'>
          Menu
        </button>
      )}</div>
      {portalContainer && ReactDOM.createPortal(isProfileVisible ? <Profile /> : null, portalContainer)}
      {isMenuVisible && <NewSidePanel />}
    </>
  );
}

export default Head;
