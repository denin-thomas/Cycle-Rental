import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SelectPackage() {
  const [packageData, setPackageData] = useState([]);
  const navigate = useNavigate();

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
    <div className="select-package-div">
      <h1>Choose Package</h1>
      {packageData.map((p) => (
        <div
          key={p.package_id}
          className='package-box'
          onClick={() => handlePackageClick(p.package_id)}
        >
          <h1><center>{p.p_name}</center></h1>
          <td>{p.duration}</td>
          <td>{p.price}</td>
          <td>{p.description}</td>
        </div>
      ))}
    </div>
  );
}

export default SelectPackage;
