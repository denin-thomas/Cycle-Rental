import React, { useEffect, useState } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import Footer from './Footer';
function ViewSubcategory() {
    const [subCatData, setSubCatData] = useState([]);
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
      fetch('http://localhost:3001/api/viewSubCat')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setSubCatData(data.data);
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
      const sheetData = subCatData.map((subCat, index) => ({
        'No.': index + 1,
        'Subcategory Name': subCat.subcat_name,
        'Description': subCat.subcat_description
      }));
  
      const ws = XLSX.utils.json_to_sheet(sheetData);
      ws['!cols'] = [
        { width: 5 }, // No.
        { width: 20 }, // Subcategory Name
        { width: 40 }, // Description
      ];
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Subcategory List');
      XLSX.writeFile(wb, 'subcategoryList.xlsx');
    };
    return (<>
        <div className='view'><h1><center>View Subcategory</center></h1>
                 
      <button 
  type="button" 
  class="btn btn-primary" 
  onClick={() => window.print()}
id='no'
>
  Print
</button>


<button type="button"class="btn btn-success"  onClick={handleExportExcel} id='no'>Excel</button>
<button type="button"onClick={handleGeneratePdf} class="btn btn-danger" id='no'>PDF</button>
            <div id='pdfContent'>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Subcategory Name</th>
                      
                        <th>Description</th>
                        <th id='no'></th>
                    </tr>
                </thead>
                <tbody>
                    {subCatData.map((subCat, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                           
                           <td>{subCat.subcat_name}</td>
                            <td>{subCat.subcat_description}</td>
                            

                            <td id='no'> <Link to={`/editsubcategory/${subCat.subcat_id}`}>Edit </Link>
              </td>
                        </tr>
                    ))}
                </tbody>
            </table>    </div>
            <div className="page-info" id='n'><hr/>
          <span className="page-number"></span>
          <span className="date-time"></span>
        </div></div><Footer/>
</>
    );
}
export default ViewSubcategory;