import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditCategory = () => {
  const { category_id } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [editedCategory, setEditedCategory] = useState({}); // Initialize as an empty object

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getCategory/${category_id}`);
      const data = await response.json();

      if (data.success) {
        setCategoryData(data.data);
        setEditedCategory(data.data); // Initialize with packageData values
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value !== undefined ? value : categoryData[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edit Package Form Submitted:', editedCategory);

    fetch(`http://localhost:3001/api/updateCategory/${category_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedCategory),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Package updated:', data);
        // Refetch data after submitting the form
        fetchData();
      })
      .catch(error => {
        console.error('Error updating package:', error);
      });

    setEditedCategory({}); // Reset editedPackage after submitting
  };

  return (
    <div className='addcategory-div'>
      <h1>
        <center>Edit Category</center>
      </h1>
      {categoryData ? (
        <div>
    
          <form>
            <table><tr><th>
            <label>
              Category Name:
              </label>
              <input
                type="text"
                name="category_name"
                value={editedCategory.category_name || ''}
                onChange={handleChange}
              />
          </th></tr><tr><th>
            <label>
              Category Description: </label>
              <input
                type="text"
                name="category_description"
                value={editedCategory.category_description || ''}
                onChange={handleChange}
              />
           </th></tr>  </table>
            {/* Submit button */}
            <input type="submit" onClick={handleSubmit} value={"Edit"}/>
        
          
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditCategory;
