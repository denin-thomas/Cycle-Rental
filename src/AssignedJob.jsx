
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import './App.css';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
export default function AssignedJob() {
  const [loginId, setLoginId] = useState('');
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState([]);
  useEffect(() => {
    // Update the content of the date-time element with the current date and time
    const updateDateTime = () => {
      const dateTimeElement = document.querySelector('.date-time');
      if (dateTimeElement) {
        const currentDate = new Date();
        const formattedDateTime = currentDate.toLocaleString();
        dateTimeElement.textContent = formattedDateTime;
      }
    };
    updateDateTime();

    // Refresh date and time every second
    const interval = setInterval(updateDateTime, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    fetch('http://localhost:3001')
      .then((res) => res.json())
      .then((data) => {
       
        if (data.valid && ( data.login_type === 'm')) {
          setLoginId(data.login_id);
          console.log(data.login_id);
         
        } else {
          
          navigate('/login');
        }
      })
      .catch((err) => console.log(err))
     
  }, [navigate]);
  useEffect(() => {
    fetch('http://localhost:3001/api/viewMaintenanceAssigned')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log(data.data);
          setPackageData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);/*
  const handleGeneratePdf = () => {
    const content = document.getElementById('pdfContent');
    const pdf = new jsPDF();
  
    // Add the heading
    pdf.setFontSize(20);
    pdf.text('Package View', 10, 10); // Adjust position of heading
  
    // Get the height of the heading
    const headingHeight = 20; // Assuming font size 20 for heading
  
    // Add table-striped class to the table in the PDF
    const tableElement = content.querySelector('table');
    tableElement.classList.add('table-striped');
  
    // Calculate startY position for the table
    const startY = headingHeight + 20; // Adjust as needed
  
    // Convert the HTML content with the modified table to PDF
    pdf.autoTable({ html: tableElement, startY: startY });
  
    // Save the PDF
    pdf.save('packageList.pdf');
  };
 
  const handleExportExcel = () => {
    const sheetData = packageData.map((data, index) => ({
      'No.': index + 1,
      'Cycle Id': data.p_name,
      'Staff Name': data.p_duration,
      'Description': data.p_price,
    }));
  
    // Adding column headers
    const headers = ['No.', 'Cycle Id', 'Staff Name', 'Description'];
    sheetData.unshift(headers);
  
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Set column width
    const wscols = [
      { wch: 5 }, // No.
      { wch: 20 }, // Cycle Id
      { wch: 15 }, // Staff Name
      { wch: 40 }, // Description
    ];
    ws['!cols'] = wscols;
  
    // Add borders
    ws['!outline'] = [
      { cells: [{ row: 0, col: 0 }, { row: 0, col: headers.length - 1 }], style: { bottom: 'medium' } }, // Border bottom for header
      { cells: [{ row: 0, col: 0 }, { row: sheetData.length, col: headers.length - 1 }], style: { right: 'medium' } }, // Border right for all cells
    ];
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maintenance List');
    XLSX.writeFile(wb, 'maintenanceList.xlsx');
  };
  */
  return (
    <div className="view">
    <h1>
      <center>Assigned job</center>
    </h1>
    {/*}
    <button 
  type="button" 
  class="btn btn-primary" 
  onClick={() => window.print()}
id='no'
>
  Print
</button>


<button type="button"class="btn btn-success" onClick={handleExportExcel}id='no'>Excel</button>
<button type="button" class="btn btn-danger"onClick={handleGeneratePdf} id='no'>PDF</button>
  */}
    <div id="pdfContent">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Name</th>
            <th>Hub Name</th>
         
            <th>Date and time</th>
            <th>Desription</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {packageData.map((staff, index) => (
            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{index + 1}</td>
              <td>{staff.staff_id}</td>
              <td>{staff.ch_id}</td>
              <td>{staff.date}</td>
              <td>{staff.description}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="page-info" id='n'><hr/>
          <span className="page-number"></span>
          <span className="date-time"></span>
        </div>
  </div>
  )
}
