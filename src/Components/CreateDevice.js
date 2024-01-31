import React, { useState } from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import Accordion from 'react-bootstrap/Accordion';

const CreateDevice = () => {
  const [documentId, setDocumentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFirstAccordionCompleted, setIsFirstAccordionCompleted] = useState(false);

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
        Sunday: [],
      });

      setIsFirstAccordionCompleted(true);

      console.log('Document created for Schedules with ID:', docRef.id);
    } catch (error) {
      setErrorMessage('Failed to Add New Devices');
      console.error('Error creating document:', error);
    }
  };

  const handleDownload = () => {
    console.log('Downloading document with ID:', documentId);
  };

  return (
    <div section id="generatedevice" className='m-5'>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>1.Generate Device</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex align-items-center justify-content-center">
              <button type="button" className="btn btn-primary m-3" onClick={handleCreateDocument}>
                Create New Device
              </button>
            </div>
            <div className="d-flex align-items-center justify-content-center">
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
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>2.Download Sketch</Accordion.Header>
          <Accordion.Body>
            {isFirstAccordionCompleted ? (
              <>
             <div className="d-flex flex-column align-items-center justify-content-center">
              <p>Download FishFeeder Firmware:</p>
              <div className="d-flex">
                <button type="button" className="btn btn-primary m-5" onClick={handleDownload}>
                  ESP32 Sketch
                </button>
                <button type="button" className="btn btn-secondary m-5" onClick={handleDownload}>
                  ESP8266 Sketch
                </button>
              </div>
            </div>
              </>
            ) : (
              <p>Please complete the first accordion to unlock this section.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default CreateDevice;
