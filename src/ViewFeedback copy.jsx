import React, { useState, useEffect } from 'react';

export default function ViewFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [replyFeedbacks, setReplyFeedbacks] = useState([]);

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
      setFeedbackList(feedbackData); // Assuming feedbackData is an array of feedbacks
      // Initialize replyFeedbacks array with empty strings for each feedback
      setReplyFeedbacks(new Array(feedbackData.length).fill(''));
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSendReply = async (index) => {
    try {
      const response = await fetch('/api/replyFeedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replyFeedback: replyFeedbacks[index] }),
      });
      if (!response.ok) {
        throw new Error('Failed to send reply feedback');
      }
      // Assuming you want to refetch feedback after replying
      fetchFeedback();
      // Clear reply feedback field after sending
      const updatedReplyFeedbacks = [...replyFeedbacks];
      updatedReplyFeedbacks[index] = '';
      setReplyFeedbacks(updatedReplyFeedbacks);
    } catch (error) {
      console.error('Error sending reply feedback:', error);
    }
  };

  return (
    <div className='feedback-div'>
      <h1><center>Feedbacks</center></h1>

      {feedbackList.map((feedback, index) => (
        <div key={index} className='row'>
          <div className='col'>
            <textarea
              className='form-control'
              value={feedback}
              readOnly
            />
          </div>
          <div className='col'>
            <textarea
              className='form-control'
              placeholder='Enter Reply To Feedback Here'
              value={replyFeedbacks[index]}
              onChange={(e) => {
                const updatedReplyFeedbacks = [...replyFeedbacks];
                updatedReplyFeedbacks[index] = e.target.value;
                setReplyFeedbacks(updatedReplyFeedbacks);
              }}
            />
          </div>
          <div className='col'>
            <button
              className="btn btn-primary btn-block mb-4"
              onClick={() => handleSendReply(index)}
            >
              Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
