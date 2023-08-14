import React from 'react';

const Table = ({ records, handleEdit, handleDelete }) => {
  records.forEach((record, i) => {
    record.id = i + 1;
  });

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>hobbies</th>
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record, i) => (
              <tr key={record.id}>
                <td>{i + 1}</td>
                <td>{record.fullName}</td>
                <td>{record.phone}</td>
                <td>{record.email}</td>
                <td>{record.hobbies}</td>
                <td>{record.date} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(record.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No records</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
