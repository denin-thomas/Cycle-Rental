import React, { useEffect, useState } from 'react';
import 'jspdf-autotable';
import './App.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import './css/style.css';

function Rent() {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState('');
    useEffect(() => {
        fetch('http://localhost:3001')
            .then((res) => res.json())
            .then((data) => {
                if (data.valid && (data.login_type === 'c')) {
                    setLoginId(data.login_id);
                } else {
                    navigate('/login');
                }
            })
            .catch((err) => console.log(err));
    }, [navigate]);

    const { cycle_id } = useParams();
    const [cycleData, setCycleData] = useState(null);
    const [packFlag, setPackFlag] = useState(false);
    const [packageId, setPackageId] = useState(null);
    const [hubName, setHubName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCatName, setSubCatName] = useState("");

    const handleUnlock = (cycle_id) => {
        if (!packFlag) {
            navigate(`/rentalpayment/${cycle_id}/50/u`);
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
                    fetch(`http://localhost:3001/api/rent/${cycle_id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ cycle_id: data.cycle_id })
                    })
                    .then(response => {
                        if (response.ok) {
                            navigate('/renting');
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
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getCycle/${cycle_id}`);
            const data = await response.json();

            if (data.success) {
                setCycleData(data.data);
                const hubResponse = await fetch(`http://localhost:3001/api/getHub/${data.data.ch_id}`);
                const hubData = await hubResponse.json();
                if (hubData.success) {
                    setHubName(hubData.data.ch_state);
                }
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
                const custPackResponse = await fetch('http://localhost:3001/api/getCustomerPackage');
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

    const getImageUrl = () => {
        if (cycleData && cycleData.cy_image) {
            const byteArray = new Uint8Array(cycleData.cy_image.data);
            const blob = new Blob([byteArray], { type: 'image/png' });
            return URL.createObjectURL(blob);
        }
        return null;
    };

    return (
        <div className="rent">
            <h1><center>Rent Cycle</center></h1>
            <br />
            <div className='row'>
                <div className='col'>
                    <div style={{width:'70%'}}>
                        {/* Displaying image from bytea */}
                        {cycleData && cycleData.cy_image && (
                            <img src={getImageUrl()} alt="Cycle"/>
                        )}
                    </div>
                </div>
                <div className='col'>
                    {/* Displaying cycle details */}
                    <div className="row">
                        <div className="col">
                            <h4> Cycle Name: {cycleData && cycleData.cy_name}</h4>
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
                            <h4>Hub Name: {hubName}</h4>
                        </div>
                    </div>
                    {!packFlag && (
                        <div className="row">
                            <div className="col">
                                <h4>Rental Cost: 50Rs Per Hour</h4>
                            </div>
                        </div>
                    )}
                    {packFlag && (
                        <div className="row">
                            <div className="col">
                                <h4>Package Chosen: Yearly Plan</h4>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col">
                            <h4>Payment Amount: 50</h4>
                        </div>
                    </div>
                </div>
            </div>
            <br /><br />
            <div className="row">
                <div className="col">
                    <button
                        type="submit"
                        className="btn btn-primary btn-block mb-4"
                        onClick={() => handleUnlock(cycle_id)}
                    >
                        Unlock Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Rent;
