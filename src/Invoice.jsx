import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate, useParams } from 'react-router-dom';
import logo from './logo.png';
import html2canvas from 'html2canvas';
export default function Invoice() {
    const [rentalDetails, setRentalData] = useState(null);
    const navigate = useNavigate();
    const [cycleData, setCycleData] = useState(null);
    const [hubName, setHubName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [subCatName, setSubCatName] = useState("");
    const { rental_id } = useParams();

    
    
    const fetchData = async () => {
        try {
            const rentalResponse = await fetch(`http://localhost:3001/api/getRentalDetails/${rental_id}`);
            const rentalData = await rentalResponse.json();
            const cycle_id = rentalData.data.cycle_id;
            if (rentalData.success) {
                setRentalData(rentalData.data);
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
                    const subCatResponse = await fetch(`http://localhost:3001/api/getSubCat/${data.data.subcat_id}`);
                    const subCatData = await subCatResponse.json();
                    if (subCatData.success) {
                        setSubCatName(subCatData.data.subcat_name);
                    }
                    const categoryResponse = await fetch(`http://localhost:3001/api/getCategory/${subCatData.data.category_id}`);
                    const categoryData = await categoryResponse.json();
                    if (categoryData.success) {
                        setCategoryName(categoryData.data.category_name);
                    }
                }
            } else {
                console.error('Error:');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [rental_id]);
    const handleGeneratePdf = () => {
        const doc = new jsPDF();
    
        // Get the HTML content
        const content = document.getElementById('pdfContent');
    
        // Convert the HTML content to an image using html2canvas
        html2canvas(content)
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = 210; // PDF page width
                const imgHeight = canvas.height * imgWidth / canvas.width;
    
                // Add the image to the PDF document
                doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                doc.save('invoice.pdf');
            })
            .catch(error => {
                console.error('Error converting HTML to image:', error);
            });
    };
    return (
        <div className="invoice" id='pdfContent'>
            <center><img src={logo} alt="Logo" /></center>
            <h1><center>RideReady Rentals</center></h1>
            <br/>
            <hr/>
            <h1><center>Invoice</center></h1>
            <div className="row">
                <div className="col">
                    <h4> Invoice No. :</h4></div><div className='col'><h4>{rental_id}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Date: </h4></div><div className='col'><h4>{new Date().toLocaleDateString()}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4> Cycle Name :</h4></div><div className='col'><h4>{cycleData && cycleData.ch_state}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Category Name :</h4></div><div className='col'><h4>{cycleData && categoryName}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Subcategory Name:</h4></div><div className='col'><h4> {cycleData && subCatName}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Hub Name :</h4></div><div className='col'><h4>{cycleData && hubName}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Rental Cost :</h4></div><div className='col'><h4> 50Rs Per Hour</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Package Choosed : </h4></div><div className='col'><h4>Yearl Plan</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h4>Payment Amount :</h4></div><div className='col'><h4> {rentalDetails && rentalDetails.cost}</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <button type="submit" className="btn btn-primary btn-block mb-4" onClick={handleGeneratePdf}>
                        Download
                    </button>
                </div>
            </div>
        </div>
    );
}
