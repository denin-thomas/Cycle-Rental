import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EditSubCat = () => {
  const { subcat_id } = useParams();
  const [subCatData, setSubCatData] = useState(null);
  const [editedSubCat, setEditedSubCat] = useState({}); // Initialize as an empty object

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/getSubCat/${subcat_id}`);
      const data = await response.json();

      if (data.success) {
        setSubCatData(data.data);
        setEditedSubCat(data.data); // Initialize with packageData values
      } else {
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [subcat_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedSubCat((prevSubCat) => ({
      ...prevSubCat,
      [name]: value !== undefined ? value : subCatData[name],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Edit Package Form Submitted:', editedSubCat);

    fetch(`http://localhost:3001/api/updateSubCat/${subcat_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedSubCat),
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

    setEditedSubCat({}); // Reset editedPackage after submitting
  };

  return (
    <div className='addsubcategory-div'>
      <h1>
        <center>Edit Subategory</center>
      </h1>
      {subCatData ? (
        <div>
    
          <form>
            <table><tr><th>
            <label>
              Subcategory Name:
              </label>
              <input
                type="text"
                name="subcat_name"
                value={editedSubCat.subcat_name || ''}
                onChange={handleChange}
              />
          </th></tr><tr><th>
            <label>
              Subcategory Description: </label>
              <input
                type="text"
                name="subcat_description"
                value={editedSubCat.subcat_description || ''}
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

export default EditSubCat;
