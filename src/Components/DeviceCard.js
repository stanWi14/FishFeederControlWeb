import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';
import DeleteDevice from './DeleteDevice';

const DeviceCard = ({ deviceId, status }) => {
  const cardHeaderClass = status === 'Paired' ? 'bg-success text-white' : 'bg-danger text-white';

  return (
    <div>
      <Card className="text-center">
        <Card.Header className={cardHeaderClass}>{status && `${status}`}</Card.Header>
        <Card.Body>
          <Card.Title>Device ID</Card.Title>
          <p>{deviceId && `${deviceId}`}</p>
          <Button variant="primary" className="m-2">More</Button>
          <DeleteDevice deviceId={deviceId} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default DeviceCard;
