import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import DevCard from './DevCard';
import devstan from '../img/devstan.jpg'
import devkev from '../img/devkev.jpg'
import devvan from '../img/devvan.jpg'

const AboutUs = () => {
  return (
    <div section id="aboutus" className="pt-5 mt-5 mx-4">
      <h1 className='pt-5'>About Us</h1>  
      <h5>FishFeeder system was developed by a group of 3 developer from Computer Science Major from BINUS@Bandung</h5>
      <p>Our goal in developing an IoT fish feeder is to implement automate & monitoring feeding processes, ensuring user full controll and flexibility.</p>
      <Row className='m-2'>
        <Col md={4}>
          <DevCard devName="Kevin Axel" devdesc="Product Owner & IoT Dev Team" devphoto={devkev}/>
        </Col>
        <Col md={4}>
          <DevCard devName="Martinus Ivan" devdesc="QA Tester & UI/UX Dev Team" devphoto={devvan}/>
        </Col>
        <Col md={4}>
          <DevCard devName="Stanley Wisely" devdesc="Scrum Master & Android Dev Team" devphoto={devstan}/>
        </Col>
      </Row>
    </div>
  );
};

export default AboutUs;
