import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
function AddSubcategory()
{
  const [categoryData, setCategoryData] = useState([]);
    const [formData, setFormData] = useState({
       subcat_name: '',
        subcat_description: '',
        category_id:''
      });
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
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Package Form Submitted:', formData);
    
        fetch('http://localhost:3001/api/addSubCat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Package added:', data);
            // You might want to update the UI to show success to the user
          })
          .catch(error => {
            console.error('Error adding package:', error);
            // You might want to update the UI to show an error to the user
          });
    
        setFormData({
          subcat_name: '',
          subcat_description: '',
          category_id:''
              });
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field ${name} changed to ${value}`);
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    return(
<>
        <div className="addsubcategory-div">
            <h1><center>Add Subcategory</center></h1>
            <form onSubmit={handleSubmit}>
            <table><tr><th>
          
           </th></tr><tr><th> 
            <label>Subcategory Name</label>
            <input name="subcat_name"    className='form-control' value={formData.subcat_name}
          onChange={handleChange}/>
            </th></tr>
            <tr><th> 
            <label>category Name</label>
            <select name="category_id" className="form-control" value={formData.category_id} onChange={handleChange}>
                <option value="">Select Category</option>
                {categoryData.map(category => (
                  <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
                ))}
              </select>
            </th></tr>
            <tr><th>
            <label>Subcategory Description</label>
            <input name="subcat_description"  className='form-control'  value={formData.subcat_description}
          onChange={handleChange}/>
          </th></tr>
         </table>
         <button type="submit" onClick={handleSubmit} class="btn btn-primary btn-block mb-4">
                Add Subcategory
              </button>
         </form>
        </div><Footer/></>
    );
}
export default AddSubcategory ;