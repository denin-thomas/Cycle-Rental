import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

function Renting() {
    const navigate = useNavigate();
    const [rentalDetails, setRentalData] = useState(null);
    const [cycleData, setCycleData] = useState(null);
    const [hubName, setHubName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCatName, setSubCatName] = useState("");
    const [packFlag, setPackFlag] = useState(false);
    const [packageId, setPackageId] = useState(null);
    const [loginId, setLoginId] = useState('');
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
            const rentalResponse = await fetch(`http://localhost:3001/api/getRentall`);
            const rentalData = await rentalResponse.json();
            if (rentalData.success) {
                setRentalData(rentalData.data);

                const response = await fetch(`http://localhost:3001/api/getCycle/${rentalData.data.cycle_id}`);
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
                }
            } else {
                console.error('Error:', rentalData.message);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    const calculateCost = () => {
        if (!rentalDetails || !rentalDetails.start_time) {
            console.log("Invalid rental details or start time");
            return 0;
        }
    
        console.log("Start Time (string):", rentalDetails.start_time);
    
        // Split the time string into hours, minutes, seconds, and milliseconds
        const [timePart, millisecondsPart] = rentalDetails.start_time.split('.');
        const [hoursStr, minutesStr, secondsStr] = timePart.split(':');
    
        // Convert strings to numbers
        const hours = parseInt(hoursStr);
        const minutes = parseInt(minutesStr);
        const seconds = parseInt(secondsStr || 0); // Handle case where seconds are not provided
        const milliseconds = parseInt(millisecondsPart || 0); // Handle case where milliseconds are not provided
    
        // Get current time
        const currentTime = new Date();
        console.log("Current Time:", currentTime);
    
        // Create a new Date object with the current date and the time from rentalDetails
        const startTime = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            hours,
            minutes,
            seconds,
            milliseconds // Milliseconds directly from the input string
        );
        console.log("Start Time (parsed):", startTime);
    
        // Calculate the elapsed time in milliseconds
        const elapsedTimeInMilliseconds = currentTime - startTime;
        console.log("Elapsed Time (ms):", elapsedTimeInMilliseconds);
    
        // Convert milliseconds to hours
        const elapsedTimeInHours = elapsedTimeInMilliseconds / (1000 * 60 * 60);
        console.log("Elapsed Time (hours):", elapsedTimeInHours);
    
        // Example hourly rate
        const hourlyRate = 50;
    
        // Calculate the cost based on elapsed time and hourly rate
        const rentalCost = Math.ceil(elapsedTimeInHours) * hourlyRate;
        console.log("Rental Cost:", rentalCost);
    
        return rentalCost;
    };
    

    const unlockTime = rentalDetails ? new Date(rentalDetails.start_time) : null;
    const rentalCost = calculateCost();

  
    const handleLock = (cycle_id) => {
        if (!packFlag) {
            const amount=rentalCost;
            navigate(`/rentalpayment/${cycle_id}/${amount}/l`);
        } else {
            fetch(`http://localhost:3001/api/getCycle/${cycle_id}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch cycle data');
                    }
                })
                .then(data => {
                    // Assuming rent endpoint is /api/rent
                    fetch(`http://localhost:3001/api/rentallock`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cycle_id: data.cycle_id }) // Assuming you need to send cycle_id to rent endpoint
                    })
                    .then(response => {
                        if (response.ok) {
                           navigate('/home');
                        } else {
                            throw new Error('Failed to rent cycle');
                        }
                    })
                    .catch(error => {
                        console.error('Error renting cycle:', error);
                    });
                })
                .catch(error => {
                    console.error('Error fetching cycle data:', error);
                });
        }
    }

    return (
        <div className="rent">
            <h1><center>Renting Details</center></h1>
            <div className="row">
                <div className="col">
                    <h4> Cycle Name :{cycleData && cycleData.cycle_id}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Category Name :{subCatName}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Subcategory Name: {categoryName}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>  Unlock Time: {unlockTime && unlockTime.toLocaleString()}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Hub Name :{hubName}</h4>
                </div>
            </div>
           
            <div className="row">
                <div className="col">
                    <h4>Rental Cost : {rentalCost} Rs</h4>
                </div>
            </div>{/*
            <div className="row">
                <div className="col">
                    <h4>Package Choosed : Yearl Plan</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Payment Amount : Zero</h4>
                </div>
            </div>*/}<br/>
            <div className="row">
                <div className="col">
                    <button type="submit" className="btn btn-primary btn-block mb-4" onClick={() => handleLock(cycleData.cycle_id)}>
                        Lock And Pay
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Renting;
