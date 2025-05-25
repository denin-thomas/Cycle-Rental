import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link } from 'react-router-dom';
import './App.css';
import * as XLSX from 'xlsx';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
function ViewCycle()
{
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
      fetch('http://localhost:3001/api/viewCycle')
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
      pdf.save('cycleList.pdf');
    };
   
const handleExportExcel = () => {
  const table = document.querySelector("#pdfContent table");
  const rows = table.querySelectorAll("tr");
  const data = [];

  // Extract column names
  const headers = [];
  table.querySelectorAll("th").forEach((header) => {
    headers.push(header.innerText);
  });
  data.push(headers);

  // Loop through each row and extract cell data
  rows.forEach((row) => {
    const rowData = [];
    row.querySelectorAll("td").forEach((cell) => {
      rowData.push(cell.innerText);
    });
    data.push(rowData);
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths (optional)
  ws['!cols'] = [
    { width: 5 }, // No.
    { width: 20 }, // Category Name
    { width: 20 }, // Subcategory Name
    { width: 20 }, // Hub Name
    { width: 20 }, // Enrollment Date
    { width: 10 }, // Status
  ];

  // Create workbook and add worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Cycle List');

  // Save the file
  XLSX.writeFile(wb, 'cycleList.xlsx');
};
    return(<>
        <div className="view">
        <h1>
          <center>Cycle List</center>
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
                <th>Cycle Name</th>
                <th>Subcategory Id</th>
                                <th>Hub Name</th>
                <th>Enrollment Date</th>
                <th>Status</th>
                <th id='no'></th>
              </tr>
            </thead>
            <tbody>
              {packageData.map((cycle, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{index + 1}</td>
                  <td>{cycle.cy_name}</td>
               
                  <td>{cycle.subcat_id}</td>
                  <td>{cycle.ch_id}</td>
                  <td>{cycle.cy_date}</td>
                  <td>{cycle.cy_status}</td>
                  <td id='no'>
                    <Link to={`/editpackage/${cycle.cycle_id}`}>Edit </Link>
                  </td>
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
    </>
    )
    ;
}
export default ViewCycle;