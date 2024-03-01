import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import DocPrototype from './DocPrototype';
import DocUpload from './DocUpload';

function Documentation() {
  const navStyle = {
    border: '1px solid #ddd',
    borderTop: 'none',
    padding: '10px', 
  };

  return (
    <div section id="documentation" className='mx-4 pt-5 mt-5'>    
    <h1 className='pt-5'>Documentation</h1>  
      <Tab.Container defaultActiveKey="/setup" >
        <Nav variant="tabs" className="custom-navbar">
          <Nav.Item>
            <Nav.Link eventKey="/setup">Upload Set Up</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/schematic">Prototype</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="/app">Android App</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content style={navStyle}>
          <Tab.Pane eventKey="/schematic">
            <DocPrototype/>
          </Tab.Pane>
          <Tab.Pane eventKey="/setup">
            <DocUpload/>
          </Tab.Pane>
          <Tab.Pane eventKey="/app">
            <div>
              Content for FishFeeder Apps
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default Documentation;
