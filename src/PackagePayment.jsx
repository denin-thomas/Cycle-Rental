import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function PackagePayment() {
    const { package_id, cycle_Id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        card_no: '',
        holder_name: '',
        exp_date: '',
        cvv2: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const { card_no, holder_name, exp_date, cvv2 } = formData;

        if (!/^\d{3}$/.test(cvv2)) {
            alert('CVV must be a 3-digit number.');
            return;
        }

        const currentDate = new Date();
        const inputDate = new Date(exp_date);
        if (inputDate < currentDate) {
            alert('Expiry date should not be a past date.');
            return;
        }

        fetch(`http://localhost:3001/api/addCard/${package_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Card added:', data);
                navigate('/home');
            })
            .catch(error => {
                console.error('Error adding Card:', error);
            });

        setFormData({
            card_no: '',
            holder_name: '',
            exp_date: '',
            cvv2: ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <div className='addpackage-div'>
            <h1><center>Add Card</center></h1>
            <form onSubmit={handleSubmit}>
                <div className='row'>
                    <div className='col'>
                        <label>Card Number</label>
                        <input
                            type='text'
                            placeholder='Enter Card Number...'
                            name="card_no"
                            value={formData.card_no}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Card Holder's Name</label>
                        <input
                            type='text'
                            placeholder='Enter Card Holder Name..'
                            name="holder_name"
                            value={formData.holder_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Expiry Date</label>
                        <input
                            type='Date'
                            placeholder='Enter Expiry Date'
                            name="exp_date"
                            value={formData.exp_date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <label>Cvv2</label>
                        <input
                            type='number'
                            placeholder='Enter Cvv2..'
                            name="cvv2"
                            value={formData.cvv2}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <br />
                <br />
                <button type="submit" className="btn btn-primary btn-block mb-4">
                    Add Card
                </button>
            </form>
        </div>
    );
}

export default PackagePayment;
