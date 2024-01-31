import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import deviceicon from '../img/deviceicon.png';
import generateicon from '../img/generateicon.png'
import sketchicon from '../img/sketchicon.png'
import monitoricon from '../img/monitoricon.png'
import SideCard from './SideCard';

const WelcomePage = () => {
  return (
    <div section id="welcome" className="p-3 pt-5 mt-5 mb-4">
        <h3 className="display-1">
          Welcome to <small className="text-body-secondary"> FishFeeder Admin Page</small>
        </h3>
      <h1 className="text-body-secondary mx-2 mb-3">Create & Monitor FishFeeder Devices</h1>
      <h1 className="text-body mx-2">What to do here?</h1>

      <Row className='m-2'>
        <Col md={4}>
          <SideCard title="Generate Device" desc="Generate new Firebase documents for the device, create the device sketch (program), and display the generated Device ID." img={generateicon}/>
        </Col>
        <Col md={4}>
          <SideCard title="Uploading Sketch" desc="There is a step-by-step guide for uploading the FishFeeder sketch (program) using Arduino IDE." img={sketchicon} />
        </Col>
        <Col md={4}>
          <SideCard title="Monitor Device" desc="Displaying the list and pairing status of each device, the administrator can delete devices and view the data associated with each one." img={monitoricon}/>
        </Col>
      </Row>

      {/* <Row className="d-flex justify-content-between">
        <Col md={4} className="text-center m-3">
          <Image src={deviceicon} fluid />
          <h5 className="text-body-secondary">Image 1 Text</h5>
        </Col>
        <Col md={4} className="text-center m-3">
          <Image src={deviceicon} fluid />
          <h5 className="text-body-secondary">Image 2 Text</h5>
        </Col>
        <Col md={4} className="text-center m-3">
          <Image src={deviceicon} fluid />
          <h5 className="text-body-secondary">Image 3 Text</h5>
        </Col>
      </Row> */}
    </div>
  );
};

export default WelcomePage;
