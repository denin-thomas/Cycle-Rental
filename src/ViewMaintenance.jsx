import Footer from './Footer';
import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import './App.css';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
export default function ViewMaintenance() {
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
       
        if (data.valid && (data.login_type === 'a' || data.login_type === 's')) {
          setLoginId(data.login_id);
          console.log(data.login_id);
         
        } else {
          
          navigate('/login');
        }
      })
      .catch((err) => console.log(err))
     
  }, [navigate]);
  useEffect(() => {
    fetch('http://localhost:3001/api/viewMaintenance')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          Promise.all(data.data.map(item => {
            const ch_id = item.ch_id;
            const staff_id = item.staff_id;
            
            // Fetch hub name
            const fetchHub = fetch(`http://localhost:3001/api/getHub/${ch_id}`)
              .then(response => response.json())
              .then(hubData => {
                if (hubData.success) {
                  return hubData.data.ch_name;
                } else {
                  console.error('Error fetching hub name:', hubData.message);
                  return null;
                }
              })
              .catch(error => {
                console.error('Error fetching hub name:', error);
                return null;
              });
  
            // Fetch staff name
            const fetchStaff = fetch(`http://localhost:3001/api/getStaff/${staff_id}`)
              .then(response => response.json())
              .then(staffData => {
                if (staffData.success) {
                  const { s_fname, s_mname, s_lname } = staffData.data;
                  return `${s_fname} ${s_mname ? s_mname + ' ' : ''}${s_lname}`;
                } else {
                  console.error('Error fetching staff name:', staffData.message);
                  return null;
                }
              })
              .catch(error => {
                console.error('Error fetching staff name:', error);
                return null;
              });
  
            // Wait for both fetch requests to complete
            return Promise.all([fetchHub, fetchStaff])
              .then(([hubName, staffName]) => ({
                ...item,
                hubName: hubName,
                staffName: staffName
              }))
              .catch(error => {
                console.error('Error:', error);
                return item;
              });
          }))
          .then(updatedData => {
            setPackageData(updatedData);
          })
          .catch(error => console.error('Fetch error:', error));
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch(error => console.error('Fetch error:', error));
  }, []);
  
  
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
  
  return (<>
    <div className="view">
    <h1>
      <center>Maintenance List</center>
    </h1>
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

    <div id="pdfContent">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>No.</th>
            <th>Staff Name</th>
            <th>Hub Id</th>
         
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {packageData.map((staff, index) => (
            <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              <td>{index + 1}</td>
              <td>{staff.staffName}</td>
              <td>{staff.hubName}</td>

      
              <td>{staff.date}</td>
              <td>{staff.description}</td>
              
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

  <Footer/></>
  )
}
