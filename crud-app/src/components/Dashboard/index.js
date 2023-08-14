import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Header from './Header';
import Table from './Table';
import Add from './Add';
import Edit from './Edit';

import axios from 'axios';

const Dashboard = ({ setIsAuthenticated }) => {
  const [records, setrecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchRecords() {
    try {
      const request = await axios.get('http://localhost:3002/api/v1/records/search');
      const data = await request.data.response;
      setrecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  }
  fetchRecords();
  }, []);

  const handleEdit = id => {
    const [record] = records.filter(record => record.id === id);

    setSelectedRecord(record);
    setIsEditing(true);
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) {
        const [record] = records.filter(record => record.id === id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${record.fullName} ${record.phone}'s data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });

        const recordsCopy = records.filter(record => record.id !== id);
        localStorage.setItem('records_data', JSON.stringify(recordsCopy));
        setrecords(recordsCopy);
      }
    });
  };

  return (
    <div className="container">
      {!isAdding && !isEditing && (
        <>
          <Header
            setIsAdding={setIsAdding}
            setIsAuthenticated={setIsAuthenticated}
          />
          <Table
            records={records}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </>
      )}
      {isAdding && (
        <Add
          records={records}
          setrecords={setrecords}
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          records={records}
          selectedRecord={selectedRecord}
          setrecords={setrecords}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
