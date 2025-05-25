import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Renting from './Renting';
function RentalPayment() {
    const [loginId, setLoginId] = useState('');
    const {cycle_id,amount,type } = useParams();
    const navigate=useNavigate();
   
    const [cycleData, setCycleData] = useState(null);
   ;
    const [packFlag, setPackFlag] = useState(false);
    const [packageId, setPackageId] = useState(null);
    const [hubName, setHubName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCatName, setSubCatName] = useState("");
    const [formData, setFormData] = useState({
        card_no: '',
        holder_name: '',
        exp_date: '',
        cvv2: '',
    });
   
  useEffect(() => {
    fetch('http://localhost:3001')
      .then((res) => res.json())
      .then((data) => {
       
        if (data.valid && (data.login_type === 'c')) {
          setLoginId(data.login_id);
          console.log(data.login_id);
         
        } else {
          
          navigate('/login');
        }
      })
      .catch((err) => console.log(err))
     
  }, [navigate]);
      
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getCycle/${cycle_id}`);
            const data = await response.json();
    
            if (data.success) {
                setCycleData(data.data);
                // Fetch hub name
                const hubResponse = await fetch(`http://localhost:3001/api/getHub/${data.data.ch_id}`);
                const hubData = await hubResponse.json();
                if (hubData.success) {
                 
                    setHubName(hubData.data.ch_state);
                }
                // Fetch category name
                const categoryResponse = await fetch(`http://localhost:3001/api/getSubCat/${data.data.subcat_id}`);
                const categoryData = await categoryResponse.json();
                if (categoryData.success) {
                    setCategoryName(categoryData.data.subcat_name);
                }
                const subCatResponse = await fetch(`http://localhost:3001/api/getCategory/${categoryData.data.category_id}`);
                const subCatData = await subCatResponse.json();
                if (subCatData.success) {
                    setSubCatName(subCatData.data.category_name);
                }
                const custPackResponse=await fetch('http://localhost:3001/api/getCustomerPackage');
                const custPackData = await custPackResponse.json();
                if (custPackData.success) {
                    setPackageId(custPackData.data.package_id);
                    
                    setPackFlag(true);
                   
                }
              

            } else {
                console.error('Error:', data.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };
  
    useEffect(() => {
        fetchData();
    }, [cycle_id]);
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Card Form Submitted:', formData);
if(type==='u'){
    
    fetch(`http://localhost:3001/api/rentalpayment/${cycle_id}/${amount}`, { // Adjusted string interpolation
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Card added:', data);
                navigate('/renting');
                // You might want to update the UI to show a success message
            })
            .catch(error => {
                console.error('Error adding Card:', error);
                // You might want to update the UI to show an error message to the user
            });
        }
        else
        {
            fetch(`http://localhost:3001/api/rentallockpayment/${amount}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Card added:', data);
                const rental_id = data.rental_id;
                // You might want to update the UI to show a success message
                navigate(`/invoice/${rental_id}`);

            })
            .catch(error => {
                console.error('Error adding Card:', error);
                // You might want to update the UI to show an error message to the user
            });
            
        }

        setFormData({
            card_no: '',
            holder_name: '',
            exp_date: '',
            cvv2: ''
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


    return (<>        <div className="rent-1"> <h1><center>Renting Details</center></h1><br/>
  
  
   
    <div className="row">
        <div className="col">
            <h4> Cycle Name :{cycleData && cycleData.cy_name}</h4>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <h4>Category Name: {cycleData && subCatName}</h4>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <h4>Subcategory Name: {cycleData && categoryName}</h4>
        </div>
    </div>
    <div className="row">
        <div className="col">
            <h4>Hub Name :{hubName}</h4>
        </div>
    </div>
    {!packFlag && (<div className="row">
        <div className="col">
            <h4>Rental Cost : 50Rs Per Hour</h4>
        </div>
    </div>)}
    {packFlag &&
    (<div className="row">
        <div className="col">
            <h4>Package Choosed : Yearl Plan</h4>
        </div>
    </div>)}{/*}
    <div className="row">
        <div className="col">
            <h4>Payment Amount : 50</h4>
        </div>
    </div>*/}<br/><br/>
    </div>
        <div className='payment-div'>
            <h1><center>Payment</center></h1>
            <form onSubmit={handleSubmit}>
            <div className='row'>
                    <div className='col'>
                        <label>Payment Amount</label>
                        <input
                            type='number'
                            className='form-control'
                            value={amount}
                            
                        disabled='disabled'
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Card Number</label>
                        <input
                            type='text'
                            placeholder='Enter Card Number...'
                            name="card_no"
                            className='form-control'
                            value={formData.card_no}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Holder's Name</label>
                        <input
                            type='text'
                            placeholder='Enter Card Holder Name..'
                            name="holder_name"
                            className='form-control'
                            value={formData.holder_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Expiry Date</label>
                        <input
                            type='Date'
                            placeholder='Enter Expiry Date'
                            name="exp_date"
                            value={formData.exp_date}
                            className='form-control'
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Cvv2</label>
                        <input
                            type='number'
                            placeholder='Enter Cvv2..'
                            name="cvv2"
                            value={formData.cvv2}
                            className='form-control'
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <br />
                <br />
                <button type="submit" onClick={handleSubmit} className="btn btn-primary btn-block mb-4">
                    Pay
                </button>
            </form>
        </div></>
    );
}

export default RentalPayment;
