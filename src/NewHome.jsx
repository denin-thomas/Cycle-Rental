

import './css/style.css';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import NewFooter from './NewFooter';
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Pack from './Pack';

export default function NewHome() {
  const containerRef = useRef(null);
  const openNav =()=> {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
  
  function handleMainClick() {
    const navbarSupportedContent = document.getElementById("navbarSupportedContent");
    navbarSupportedContent.classList.toggle("nav-normal");
  }
  const [packageData, setPackageData] = useState([]);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);



  useEffect(() => {
    fetch('http://localhost:3001/api/viewPackage')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPackageData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);

  const handlePackageClick = (package_id) => {
    // Navigate to the 'addcard' page with the package_id parameter
    navigate(`/packagepayment/${package_id}`);
  };
  return (
    <>
   
   <div className="header_section header_bg">
      <div className="banner_section layout_padding">
        <div id="main_slider" className="carousel slide" data-ride="carousel">
          <div className="carousel-inner">
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <div className="best_text">Best</div>
                    <div className="image_1"><img src="images/img-1.png" alt="Image 1" /></div>
                  </div>
                  <div className="col-md-5">
                    <h1 className="banner_taital">RideReady Rentals</h1>
                    <p className="banner_text">"Embark on your cycling adventure worry-free with our cutting-edge rental service!"</p>
                    <div className="contact_bt"><a href="contact.html">Ride Now</a></div>
                  </div>
                </div>
              </div>
            </div>
           
            <div className={`carousel-item ${index === 2 ? 'active' : ''}`}>
              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <div className="best_text">Best</div>
                    <div className="image_1"><img src="images/img-1.png" alt="Image 3" /></div>
                  </div>
                  <div className="col-md-5">
                    <h1 className="banner_taital">New Model Cycle</h1>
                    <p className="banner_text">"Embark on your cycling adventure worry-free with our cutting-edge rental service!"</p>
                    <div className="contact_bt"><a href="contact.html">Shop Now</a></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`carousel-item ${index === 1 ? 'active' : ''}`}>
              <div className="container">
                <div className="row">
                  <div className="col-md-7">
                    <div className="best_text">Best</div>
                    <div className="image_1"><img src="images/img-1.png" alt="Image 2" /></div>
                  </div>
                  <div className="col-md-5">
                    <h1 className="banner_taital">New Model Cycle</h1>
                    <p className="banner_text">"Embark on your cycling adventure worry-free with our cutting-edge rental service!"</p>
                    <div className="contact_bt"><a href="contact.html">Shop Now</a></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
{/*carousel
    <div className="select-package-div" >
    
   
      <h1><center>Choose Package</center></h1>
      {packageData.map((p) => (
        <div
          key={p.package_id}
          className='package-box'
          onClick={() => handlePackageClick(p.package_id)}
        >
          <h1><center>{p.p_name}</center></h1><div className="best_text" style={{float:'right'}}>Buy</div><br/>
          <tr><td><h2> Duration  :  {p.p_duration}</h2></td></tr>
          <tr><td><h2> Cost  :  {p.p_price}</h2></td></tr>
          <tr><td><h2><center>{p.description}</center></h2></td></tr>
        </div>
      ))}
    </div>*/}

<h1><center>Choose Package</center></h1>
<div className="package-container" ref={containerRef}>
    
   
    {packageData.map((p) => (
      <div
        key={p.package_id}
        className='package-box'
        onClick={() => handlePackageClick(p.package_id)}
      >
        <h1><center>{p.p_name}</center></h1><br/>{/*<div className="best_text" style={{float:'right'}}>Buy</div><br/>*/}
        <tr><td><h2> Duration  :  {p.p_duration} Months</h2></td></tr>
        <tr><td><h2> Cost  :  {p.p_price}</h2></td></tr>
        <tr><td><h2><center>{p.description}</center></h2></td></tr>
      </div>
    ))}
  </div>

    <br/><br/>
 
  
        <NewFooter/>
    </>
  );
}
