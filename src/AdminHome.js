import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminHome() {
    const [staffCount, setStaffCount] = useState(null);
    const [userCount, setUserCount] = useState(null);
    const [hubCount, setHubCount] = useState(null);
    const [cycleCount, setCycleCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
const navigate=useNavigate();
const handleStaff= ()=>{
    navigate('/viewstaff');
}
const handleCycle= ()=>{
    navigate('/viewcycle');
}
const handleUser= ()=>{
    navigate('/viewcustomer');
}
const handleHub= ()=>{
    navigate('/viewhub');
}
const handleSubCat= ()=>{
    navigate('/viewsubcategory');
}
const handleCategory= ()=>{
    navigate('/viewcategory');
}

    useEffect(() => {
        // Fetch Staff Count
        fetch('http://localhost:3001/api/getStaffCount')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setStaffCount(data.data);
                } else {
                    setError(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError('An error occurred while fetching staff count.');
            })
            .finally(() => setLoading(false));

        // Fetch User Count
        fetch('http://localhost:3001/api/getUserCount')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUserCount(data.data);
                } else {
                    setError(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError('An error occurred while fetching user count.');
            });

        // Fetch Hub Count
        fetch('http://localhost:3001/api/getHubCount')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setHubCount(data.data);
                } else {
                    setError(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError('An error occurred while fetching hub count.');
            });

        // Fetch Cycle Count
        fetch('http://localhost:3001/api/getCycleCount')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCycleCount(data.data);
                } else {
                    setError(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError('An error occurred while fetching cycle count.');
            });
    }, []);

    return (
        <div className="adminhome">
            <div className="admininstrative-head">
                <h1 style={{ color: 'white' }}><center>Administrative Page</center></h1>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className='count-div'>
                <h1><center>No. Of Staffs</center></h1>
                <h1><center>{staffCount}</center></h1>
                <button className='btn btn-info' onClick={handleStaff}>View Details</button>
            </div>
            <div className='count-div'>
                <h1><center>No. of Users</center></h1>
                <h1><center>{userCount}</center></h1>
                <button className='btn btn-info' onClick={handleUser}>View Details</button>
            </div>
            <div className='count-div'>
                <h1><center>No. of Cycle Hubs</center></h1>
                <h1><center>{hubCount}</center></h1>
                <button className='btn btn-info' onClick={handleHub}>View Details</button>
            </div>
            <div className='count-div'>
                <h1><center>No. of Cycles</center></h1>
                <h1><center>{cycleCount}</center></h1>
                <button className='btn btn-info' onClick={handleCycle}>View Details</button>
            </div>
 

            <div className='count-div'>
                <h1><center>No. of Subcategories</center></h1>
                <h1><center>{cycleCount}</center></h1>
                <button className='btn btn-info' onClick={handleSubCat}>View Details</button>
            </div>
            <div className='count-div'>
    <h1><center>No. of Categories</center></h1>
    <h1><center>{cycleCount}</center></h1>
    <button className='btn btn-info' onClick={handleCategory}>View Details</button>
</div>
<div className='count-div'>
    <h1><center>No. of Rents</center></h1>
    <h1><center>{cycleCount}</center></h1>
    <button className='btn btn-info' onClick={handleCategory}>View Details</button>
</div>
<div className='count-div'>
                <h1><center>No. of Subcategories</center></h1>
                <h1><center>{cycleCount}</center></h1>
                <button className='btn btn-info' onClick={handleSubCat}>View Details</button>
            </div>
        </div>
    );
}

export default AdminHome;
