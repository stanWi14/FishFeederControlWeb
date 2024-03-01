import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import libFirebase from '../img/libfirebaseesp.png'
import libJson from '../img/libjson.png'
import libJsonEl from '../img/libJsonbel.png'
import libServo from '../img/libservo.png'

const DocUpload = () => {
  return (
    <div className="mx-2">
        <div className="d-flex align-items-center mb-2">
            <h5 className="text-body">1. Download Arduino IDE</h5>
            <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener noreferrer" className="btn btn-primary mx-3">
                Download here
            </a>
        </div>
       
        <div className="d-flex align-items-center mb-2">
            <h5 className="text-body">2. Set up Arduino IDE to support ESP32</h5>
            <a href="https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/" target="_blank" rel="noopener noreferrer" className="btn btn-primary mx-3">
                ESP32 Set up Turtorial
            </a>
        </div>
        <h5 className="text-body">3. Install Required Libraries
        <small className="text-body-secondary"> recommmended to use exact version</small>
        </h5>
        <Image className="mb-2" src={libFirebase} fluid style={{ width: '75%' }} />
        <Image className="my-2" src={libJson} fluid style={{ width: '75%' }} />
        <Image className="my-2" src={libJsonEl} fluid style={{ width: '75%' }} />
        <Image className="my-2" src={libServo} fluid style={{ width: '75%' }} />

    </div>
  );
};

export default DocUpload;
