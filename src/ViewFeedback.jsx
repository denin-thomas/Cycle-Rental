import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
export default function ViewFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
const navigate=useNavigate();
  const [loginId, setLoginId] = useState('');
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
    // Fetch feedback from backend API
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/viewFeedback'); // Replace this with your actual API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const feedbackData = await response.json();
      setFeedbackList(feedbackData.data); // Assuming feedbackData is an array of feedbacks
      // Initialize replyFeedbacks array with empty strings for each feedback
     
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };
  return (<>
    <div className='feedback-div'>
      <h1><center>Feedbacks</center></h1>
      {feedbackList.length > 0 ? (
        feedbackList.map((feedback, index) => (
          <div key={index} className='row'>
            <div className='col'>
            <label>{feedback.name}</label>
              <textarea
                className='form-control'
                name='feedback'
                value={feedback.feedback}
                readOnly
              />
           
            </div>
          </div>
        ))
      ) : (
        <p>Loading feedback...</p>
      )}
    </div>
    <Footer/></>
  );
      }  