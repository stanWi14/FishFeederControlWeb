import React, { useState } from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
const CreateDevice = () => {
  const [documentId, setDocumentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateDocument = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'Devices'), {
        afterFeedVol: 0,
        beforeFeedVol: 0,
        devPass: '',
        lastFeedTime: '0',
        minFoodVol: 0,
        ownerUID: '0',
      });

      setDocumentId(docRef.id);
      setSuccessMessage('Document created with ID: ' + docRef.id);

      const docSchedRef = doc(collection(firestore, 'Schedules'), docRef.id);

      await setDoc(docSchedRef, {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday:[],
      });

      console.log('Document created for Schedules with ID:', docRef.id);
    } catch (error) {
      setErrorMessage('Failed to Add New Devices');
      console.error('Error creating document:', error);
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
      <button type="button" className="btn btn-primary" onClick={handleCreateDocument}>
        Create New Device
      </button>
      </div>
      <div>
        {successMessage && (
          <div className="alert alert-success" role="alert">
            <p className="h4">Success Adding New Device</p>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateDevice;
