import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebase';
import DeviceCard from './DeviceCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';

const ShowAllDevice = () => {
  const [deviceData, setDeviceData] = useState([]);

  useEffect(() => {
    const deviceCollection = collection(firestore, 'Devices');
    // Real-time listener
    const unsubscribe = onSnapshot(deviceCollection, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => {
        const { ownerUID } = doc.data();
        return { id: doc.id, ownerUID };
      });

      setDeviceData(data);
    });
    // Clean up listener on component
    return () => unsubscribe();
  }, []);

  return (
    <Container fluid section id="devicelist" >
      <h1>FishFeeder Devices:</h1>
      <Row xs={1} sm={2} md={3} lg={4} xl={5}>
        {deviceData.map((device, index) => (
          <Col key={index} className="mb-4">
            <DeviceCard
              deviceId={device.id}
              status={device.ownerUID !== '0' ? 'Paired' : 'Not Paired'}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShowAllDevice;
