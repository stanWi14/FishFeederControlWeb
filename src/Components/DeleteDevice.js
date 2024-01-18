import React from 'react';
import { Button } from 'react-bootstrap';
import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from './firebase';

const DeleteDevice = ({ deviceId, onDelete }) => {
  const handleDelete = async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this device?');

    if (isConfirmed) {
      try {
        await deleteDoc(doc(firestore, 'Devices', deviceId));
        await deleteDoc(doc(firestore, 'Schedules', deviceId));
        onDelete();
        console.log(`Device with ID ${deviceId} successfully deleted.`);
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>
      Delete
    </Button>
  );
};

export default DeleteDevice;
