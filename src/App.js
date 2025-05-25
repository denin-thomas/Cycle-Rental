import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Head from './Head';
import SignUp from './SignUp';
import Login from './Login';
import Administrative from './Administrative';
import AddStaff from './AddStaff';
import ViewStaff from './ViewStaff';
import AddPackage from './AddPackage';
import ViewPackage from './ViewPackage';
import AddCycle from './AddCycle';
import ViewCycle from './ViewCycle';
import AddCategory from './AddCategory';
import ViewCategory from './ViewCategory';
import AddSubcategory from './AddSubcategory';
import ViewSubcategory from './ViewSubcategory';
import EditPackage from './EditPackage';
import EditCategory from './EditCategory';
import EditSubCat from './EditSubCat';
import EditStaff from './EditStaff';
import SelectPackage from './SelectPackage';

import AdminHome from './AdminHome';
import 'bootstrap/dist/css/bootstrap.min.css';
import AddHub from './AddHub';
import ViewHub from './ViewHub';
import Rent from './Rent';
import PackagePayment from './PackagePayment';
import RentalPayment from './RentalPayment';
import AddMaintenance from './AddMaintenance';
import ViewMaintenance from './ViewMaintenance';
import Renting from './Renting';
import Invoice from './Invoice';
import ViewFeedback from './ViewFeedback';
import NewHome from './NewHome';
import RentalReport from './RentalReport';
import AddFeedback from './AddFeedback'
import EditHub from './EditHub';
import AssignedJob from './AssignedJob';
import Pack from './Pack';
function App() {
  return (
      //mediumaquamarine
    <Router>
       <Head/>
          <Routes>
          <Route element={ <NewHome />} path='/home'/>
          <Route element={<Login />} path='/login' />
          <Route element={<SignUp />} path='/signup' />
          <Route element={<Rent />} path='/rentcycle/:cycle_id' />
          <Route element={<Renting/>} path='/renting' />
          <Route element={<Invoice/>} path='/invoice/:rental_id' />
          <Route element={<PackagePayment />} path='/packagepayment/:package_id' />
          <Route element={<RentalPayment />} path='/rentalpayment/:cycle_id/:amount/:type' />
          <Route element={<SelectPackage />} path='/selectpackage' />
          <Route  element={<AdminHome />} path='/administrative'/>
          <Route element={<AddStaff />} path='/addstaff' />
          <Route element={<ViewStaff />} path='/viewstaff' />
          <Route element={<EditStaff />} path='/editstaff/:staff_id' />
          <Route element={<AddPackage />} path='/addpackage' />
          <Route element={<Pack />} path='/pack' />
          <Route element={<ViewPackage />} path='/viewpackage' />
          <Route element={<EditPackage />} path='/editpackage/:package_id' />
          <Route element={<AddCycle />} path='/addcycle' />
          <Route element={<ViewCycle />} path='/viewcycle' />
          <Route element={<AddCategory />} path='/addcategory' />
          <Route element={<ViewCategory />} path='/viewcategory' />
          <Route element={<AddHub />} path='/addhub' />
          <Route element={<EditHub />} path='/edithub/:ch_id' />
          <Route element={<ViewHub />} path='/viewhub' />
          <Route element={<EditCategory />} path='/editcategory/:category_id' />
          <Route element={<AddSubcategory />} path='/addsubcategory' />
          <Route element={<ViewSubcategory />} path='/viewsubcategory' />
          <Route element={<EditSubCat />} path='/editsubcategory/:subcat_id' />
          <Route element={<AddMaintenance />} path='/addmaintenance' />
          <Route element={<ViewMaintenance />} path='/viewmaintenance' />
          <Route element={<ViewFeedback/>} path='/viewfeedback' />
          <Route element={<RentalReport />} path='/rentalreport' />
          <Route element={<AddFeedback />} path='/feedback' />
          <Route element={<ViewFeedback />} path='/viewfeedback' />
          <Route element={<AssignedJob />} path='/viewassignedjob' />
      </Routes>
    </Router>
  
  );
}

export default App;
