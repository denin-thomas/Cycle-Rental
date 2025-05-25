import React, { useEffect, useState } from 'react';
import './App.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
function ViewCategory()
{
    const [categoryData, setCategoryData] = useState([]);
    const [loginId, setLoginId] = useState('');
    const navigate = useNavigate();
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
      fetch('http://localhost:3001/api/viewCategory')
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setCategoryData(data.data);
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
      pdf.save('categoryList.pdf');
    };
    const handleExportExcel = () => {
      const sheetData = categoryData.map((category, index) => ({
        'No.': index + 1,
        'Category Name': category.category_name,
        'Description': category.category_description,
      }));
  
      const ws = XLSX.utils.json_to_sheet(sheetData);
      ws['!cols'] = [
        { width: 5 }, // No.
        { width: 20 }, // Category Name
        { width: 40 }, // Description
      ];
  
      // Add borders
      ws['!outline'] = [
        { cells: [{ row: 0, col: 0 }, { row: 0, col: 2 }], style: { bottom: 'medium' } }, // Border bottom for header
        { cells: [{ row: 0, col: 0 }, { row: sheetData.length, col: 2 }], style: { right: 'medium' } }, // Border right for all cells
      ];
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Category List');
      XLSX.writeFile(wb, 'categoryList.xlsx');
    };
    return(<>
    <div className="view">
      
        <h1><center>Category List</center></h1>
            
      <button 
  type="button" 
  class="btn btn-primary" 
  onClick={() => window.print()}
id='no'
>
  Print
</button>


<button type="button"class="btn btn-success" id='no' onClick={handleExportExcel}>Excel</button>
<button type="button"onClick={handleGeneratePdf} class="btn btn-danger" id='no'>PDF</button>
<div id="pdfContent">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No.</th>
              <th>Category Name</th>
             
              <th>Description</th>
             
          
              <th id='no'></th>
            </tr>
          </thead>
          <tbody>
          {categoryData.map((category, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{category.category_name} </td>
                <td>{category.category_description} </td>
                <td id='no'> <Link to={`/editcategory/${category.category_id}`}>Edit </Link>
              </td>
                </tr>
                    ))}
          </tbody>
    </table></div>
    <div className="page-info" id='n'><hr/>
          <span className="page-number"></span>
          <span className="date-time"></span>
        </div>
    </div><Footer/></>);
}
export default ViewCategory;