import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import * as XLSX from 'xlsx';
import Footer from './Footer';
function ViewStaff() {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleDisable = (staffId) => {
   
    fetch(`http://localhost:3001/api/disableStaff/${staffId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    
    })
      .then(response => response.json())
      .then(data => {
        console.log('Staff is disbaled:', data);
        
      })
      .catch(error => {
        console.error('Error updating staff:', error);
      });
  }
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
    fetch('http://localhost:3001/api/viewStaff')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setStaffData(data.data);
        } else {
          console.error('Error:', data.message);
        }
      })
      .catch((error) => console.error('Fetch error:', error))
      .finally(() => setLoading(false));
  }, []);
  const handleDeactivate = () => {
    fetch('http://localhost:3001/api/viewStaff')
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setStaffData(data.data);
      } else {
        console.error('Error:', data.message);
      }
    })
    .catch((error) => console.error('Fetch error:', error))
    .finally(() => setLoading(false));
  }
  const handleGeneratePdf = () => {
    const content = document.getElementById('pdfContent');
    const pdf = new jsPDF();

    // Add the heading
    pdf.setFontSize(20);
    pdf.text('View Staff', 10, 10); // Adjust position of heading

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
    const sheetData = staffData.map((staff, index) => ({
      'No.': index + 1,
      'Staff Name': `${staff.s_fname} ${staff.s_lname}`,
      'State': staff.s_state,
      'District': staff.s_dist,
      'Street': staff.s_street,
      'Pin': staff.s_pin,
      'House No.': staff.s_hno,
      'Gender': staff.s_gender,
      'D.O.B': staff.s_dob,
    }));

    const ws = XLSX.utils.json_to_sheet(sheetData);
    ws['!cols'] = [
      { width: 5 }, // No.
      { width: 20 }, // Staff Name
      { width: 15 }, // State
      { width: 15 }, // District
      { width: 20 }, // Street
      { width: 10 }, // Pin
      { width: 15 }, // House No.
      { width: 10 }, // Gender
      { width: 15 }, // D.O.B
    ];

    // Add borders
    ws['!outline'] = [
      { cells: [{ row: 0, col: 0 }, { row: 0, col: 8 }], style: { bottom: 'medium' } }, // Border bottom for header
      { cells: [{ row: 0, col: 0 }, { row: sheetData.length, col: 8 }], style: { right: 'medium' } }, // Border right for all cells
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff List');
    XLSX.writeFile(wb, 'staffList.xlsx');
  };

  return (<>
    <div className="view">
      <h1>
        <center>View Staff</center>
      </h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>              <button 
        type="button" 
        class="btn btn-primary" 
        onClick={() => window.print()}
      id='no'
      >
        Print
      </button><button type="button" class="btn btn-success" onClick={handleExportExcel}>Excel</button>
        <button type="button" onClick={handleGeneratePdf} class="btn btn-danger">PDF</button>
          <div id="pdfContent">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Staff Name</th>
                  <th>State</th>
                  <th>District</th>
                  <th>Street</th>
                  <th>Pin</th>
                  <th>House No.</th>
                  <th>Gender</th>
                  <th>D.O.B</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{index + 1}</td>
                    <td>{`${staff.s_fname} ${staff.s_lname}`}</td>
                    <td>{staff.s_state}</td>
                    <td>{staff.s_dist}</td>
                    <td>{staff.s_street}</td>
                    <td>{staff.s_pin}</td>
                    <td>{staff.s_hno}</td>
                    <td>{staff.s_gender}</td>
                    <td>{staff.s_dob}</td>
                    <td onClick={() => handleDisable(staff.staff_id)}>Disable</td>
                    <td>
                      <Link to={`/editstaff/${staff.staff_id}`}>Edit </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
       
        </>
      )}
      <div className="page-info" id='n'><hr />
        <span className="page-number"></span>
        <span className="date-time"></span>
      </div>
    </div></>
  );
}

export default ViewStaff;
