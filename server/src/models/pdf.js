import { DataTypes } from 'sequelize';
import sequelize from './db.js';

const Pdf = sequelize.define('Pdf', {
  pdfId: {
    type: DataTypes.STRING, // Use STRING for short IDs
    allowNull: false,
    unique: true,
  },
  pdfPath : {
    type: DataTypes.STRING, // Use STRING for short IDs
    allowNull: false,
    unique: true,
  }
});

export default Pdf;
