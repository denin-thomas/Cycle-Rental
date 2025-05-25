import React from 'react';

import AdminHome from './AdminHome';
import { Outlet } from 'react-router-dom';
import AddStaff from './AddStaff';
import Rent from './Rent';

function Administrative() {
  return (
    <div className="administrative-container">
     
      <div className="administrative-content">
        
        <Outlet />
        {
 <AdminHome/>
        }
      </div>
    </div>
  );
}

export default Administrative;
