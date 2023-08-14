import React, { useState } from 'react';
import Swal from 'sweetalert2';

const Edit = ({ records, selectedRecord, setrecords, setIsEditing }) => {
  const id = selectedRecord.id;

  const [fullName, setfullName] = useState(selectedRecord.fullName);
  const [phone, setphone] = useState(selectedRecord.phone);
  const [email, setEmail] = useState(selectedRecord.email);
  const [hobbies, setHobbies] = useState(selectedRecord.hobbies);
  const [date, setDate] = useState(selectedRecord.date);

  const handleUpdate = e => {
    e.preventDefault();

    if (!fullName || !phone || !email || !hobbies || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const record = {
      id,
      fullName,
      phone,
      email,
      hobbies,
      date,
    };

    for (let i = 0; i < records.length; i++) {
      if (records[i].id === id) {
        records.splice(i, 1, record);
        break;
      }
    }

    localStorage.setItem('records_data', JSON.stringify(records));
    setrecords(records);
    setIsEditing(false);

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${record.fullName} ${record.phone}'s data has been updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };
    
  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit record</h1>
        <label htmlFor="fullName">First Name</label>
        <input
          id="fullName"
          type="text"
          name="fullName"
          value={fullName}
          onChange={e => setfullName(e.target.value)}
        />
        <label htmlFor="phone">Last Name</label>
        <input
          id="phone"
          type="text"
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
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;
