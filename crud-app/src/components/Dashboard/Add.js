import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const Add = ({ records, setrecords, setIsAdding }) => {
  const [fullName, setfullName] = useState('');
  const [phone, setphone] = useState('');
  const [email, setEmail] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = e => {
    e.preventDefault();

    if (!fullName || !phone || !email || !hobbies || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const id = records.length + 1;
    const newRecord = {
      id,
      fullName,
      phone,
      email,
      hobbies,
      date,
    };

    // records.push(newRecord);
    async function postRecord() {
      try {
        let savedRecord = await axios.post('http://localhost:3002/api/v1/records', newRecord);
        console.log(savedRecord);
      } catch (error) {
        console.log(error);
      }
    }
    postRecord();
    
    localStorage.setItem('records_data', JSON.stringify(records));
    setrecords(records);
    setIsAdding(false);

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${fullName} ${phone}'s data has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Add record</h1>
        <label htmlFor="fullName">Name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={fullName}
          onChange={e => setfullName(e.target.value)}
        />
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="number"
          name="phone"
          value={phone}
          onChange={e => setphone(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="hobbies">hobbies</label>
        <input
          id="hobbies"
          type="text"
          name="hobbies"
          value={hobbies}
          onChange={e => setHobbies(e.target.value)}
        />
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
