import React from 'react';
import { useNavigate } from 'react-router-dom';

function NewFooter() {
  const navigate=useNavigate();
  return (
    <div className="contact_section layout_padding" style={{height:'350px'}}>
      <div className="container">
        <div className="contact_main">
          <h1 className="request_text">Feedback</h1>
          <button onClick={() => navigate('/feedback')}>Send Feedback</button>
        </div>
      </div>
    </div>
  );
}

export default NewFooter;
