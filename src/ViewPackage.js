import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import './App.css';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
function ViewPackage() {
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
    fetch('http://localhost:3001/api/viewPackage')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
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
  
    // Function to add footer to each page
    const addFooter = (pdf, pageNumber, totalPages, currentDateTime) => {
      console.log('Adding footer...');
      console.log('Page Number:', pageNumber);
      console.log('Total Pages:', totalPages);
      console.log('Date/Time:', currentDateTime);
  
      // Format footer text
      const footerText = `Date/Time: ${currentDateTime} - Page ${pageNumber} of ${totalPages}`;
  
      // Add footer text to the bottom left corner of the page
      pdf.setFontSize(10);
      pdf.text(footerText, 10, pdf.internal.pageSize.getHeight() - 10);
    };
  
    // Add event listener to trigger footer addition on each page
    pdf.internal.events.subscribe('addPage', () => {
      const pageNumber = pdf.internal.getNumberOfPages();
      const totalPages = pdf.internal.pages.length - 1; // Subtracting cover page
      const currentDateTime = new Date().toLocaleString();
      addFooter(pdf, pageNumber, totalPages, currentDateTime);
    });
  
    // Add the heading
    pdf.setFontSize(20);
    pdf.text('Package View', 10, 20); // Adjust position of heading
  
    // Add table-striped class to the table in the PDF
    const tableElement = content.querySelector('table');
    tableElement.classList.add('table-striped');
  
    // Convert the HTML content with the modified table to PDF
    pdf.autoTable({ html: tableElement, startY: 30 }); // Adjust startY position as needed
  
    // Save the PDF
    pdf.save('packageList.pdf');
  };
  
  
*//*
const handleGeneratePdf = () => {
  const content = document.getElementById('pdfContent');
  const pdf = new jsPDF();

  // Function to add footer to each page
  const addFooter = (pdf, pageNumber, totalPages, currentDateTime) => {
    // Format footer text
    const footerText = `Date/Time: ${currentDateTime} - Page ${pageNumber} of ${totalPages}`;

    // Add footer text to the bottom left corner of the page
    pdf.setFontSize(10);
    pdf.text(footerText, 10, pdf.internal.pageSize.getHeight() - 10);

    // Add page-info div to the bottom right corner of the page
    const pageInfoDiv = document.createElement('div');
    pageInfoDiv.classList.add('page-info');
    pageInfoDiv.innerHTML = `
      <hr/>
      <span class="page-number">Page ${pageNumber} of ${totalPages}</span>
      <span class="date-time">${currentDateTime}</span>
    `;
    const pageInfoHtml = pageInfoDiv.outerHTML;
    pdf.text(pageInfoHtml, pdf.internal.pageSize.getWidth() - 50, pdf.internal.pageSize.getHeight() - 10);
  };

  // Add event listener to trigger footer addition on each page
  pdf.internal.events.subscribe('addPage', () => {
    const pageNumber = pdf.internal.getNumberOfPages();
    const totalPages = pdf.internal.pages.length - 1; // Subtracting cover page
    const currentDateTime = new Date().toLocaleString();
    addFooter(pdf, pageNumber, totalPages, currentDateTime);
  });

  // Add the heading
  pdf.setFontSize(20);
  pdf.text('Package View', 10, 20); // Adjust position of heading

  // Add table-striped class to the table in the PDF
  const tableElement = content.querySelector('table');
  tableElement.classList.add('table-striped');

  // Convert the HTML content with the modified table to PDF
  pdf.autoTable({ html: tableElement, startY: 30 }); // Adjust startY position as needed

  // Save the PDF
  pdf.save('packageList.pdf');
};
*/
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
    const sheetData = packageData.map(p => ({
      'No.': p.package_id,
      'Package Name': p.p_name,
      'Duration': p.p_duration,
      'Price': p.p_price,
      'Description':p.description,
    }));
  
    const ws = XLSX.utils.json_to_sheet(sheetData);
    ws['!cols'] = [
      { width: 5 }, // No.
      { width: 20 }, // Package Name
      { width: 10 }, // Duration
      { width: 10 }, // Price
      { width: 40 }, // Description
    ];
  
    // Add borders
    ws['!outline'] = [
      { cells: [{ row: 0, col: 0 }, { row: 0, col: 4 }], style: { bottom: 'medium' } }, // Border bottom for header
      { cells: [{ row: 0, col: 0 }, { row: sheetData.length, col: 4 }], style: { right: 'medium' } }, // Border right for all cells
    ];
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Package List');
    XLSX.writeFile(wb, 'packageList.xlsx');
  };
  

  return (<>
    <div className="view" id='pdf'>
      <h1>
        <center> View Package</center>
      </h1>
    
      <button 
  type="button" 
  class="btn btn-primary" 
  onClick={() => window.print()}
id='no'
>
  Print
</button>


<button type="button" onClick={handleExportExcel} class="btn btn-success" id='no'>Excel</button>
<button type="button"onClick={handleGeneratePdf} class="btn btn-danger" id='no'>PDF</button>
     
      <div id="pdfContent">
        <table className="table table-striped" id='table'>
          <thead>
            <tr>
              <th>No.</th>
              <th>Package Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Description</th>
              <th id='no'></th>
            </tr>
          </thead>
          <tbody>
            {packageData.map((staff, index) => (
              <tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>{index + 1}</td>
                <td>{staff.p_name}</td>
                <td>{staff.p_duration}</td>
                <td>{staff.p_price}</td>
                <td>{staff.description}</td>
                <td id='no'>
                  <Link to={`/editpackage/${staff.package_id}`}>Edit </Link>
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
    </div><Footer/></>
  );
}

export default ViewPackage;
