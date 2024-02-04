import React, { useState } from 'react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import Accordion from 'react-bootstrap/Accordion';
import firmwareTemplate from './FirmwareTemplate';

const CreateDevice = () => {
  const [deviceId, setDocumentId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFirstAccordionCompleted, setIsFirstAccordionCompleted] = useState(false);
  const [isSecondAccordionCompleted, setIsSecondAccordionCompleted] = useState(false);

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

  const handleESP32Download = () => {
    console.log('Downloading document with ID:', deviceId);
    if (deviceId) {
      const content = firmwareTemplate.replace('{deviceId}', deviceId);

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${deviceId}.ino`;
      document.body.appendChild(link);
      setIsSecondAccordionCompleted(true);
      setTimeout(() => {
        link.click();
        document.body.removeChild(link);
      }, 0);
    }
  };

  return (
    <div section id="generatedevice" className='m-4'>
      <h1 className="text-body mx-2">Generate New FishFeeder Device</h1>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header><h5>1.Generate Device Component & Storage</h5></Accordion.Header>
          <Accordion.Body>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-primary my-3" onClick={handleCreateDocument}>
                Create New Device
              </button>
            </div>
            <div className="d-flex align-items-center">
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
          <Accordion.Header><h5>2.Download Firmware</h5></Accordion.Header>
          <Accordion.Body>
            {isFirstAccordionCompleted ? (
              <>
             <div className="d-flex align-items-center">
              <p className='my-2'>Download ESP32 Firmware:</p>
              <div className="d-flex">
                <button type="button"onClick={handleESP32Download} className="btn btn-primary mx-2 ">
                  Download Firmware
                </button>
              </div>
            </div>
              </>
            ) : (
              <p>Please Generate New Device to unlock this section.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header><h5>3.Upload Firmware</h5></Accordion.Header>
          <Accordion.Body>
            {isSecondAccordionCompleted ? (
              <>
              <div className="d-flex align-items-center">
                <p className='my-2'>Upload Firmware using Arduino IDE:</p>
                <div className="d-flex">
                  <button type="button" className="btn btn-primary mx-2 ">
                    Upload Turtorial Video
                  </button>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <p className='my-2'>First Time using Arduino IDE:</p>
                <div className="d-flex">
                  <button type="button" className="btn btn-primary mx-2 ">
                    Set up your Arduino IDE Environment
                  </button>
                </div>
              </div>
              </>
            ) : (
              <p>Please Download the Firmware to unlock this section.</p>
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default CreateDevice;
