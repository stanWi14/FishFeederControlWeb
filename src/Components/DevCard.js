import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function DevCard({ devName, devdesc, devsee, devphoto }) {
  return (
    <Card style={{ width: '18rem', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Card.Img
        variant="top"
        src={devphoto}
        style={{ borderRadius: '100%', width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px' }}        />
      <Card.Body>
        <Card.Title>{devName}</Card.Title>
        <Card.Text>{devdesc}</Card.Text>
        <Button variant="primary" href={devsee}>
          Contact User
        </Button>
      </Card.Body>
    </Card>
  );
}

export default DevCard;
