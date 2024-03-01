import React from 'react';
import Image from 'react-bootstrap/Image';
import schematic from '../img/protoschema.jpg'

const DocPrototype = () => {
  return (
    <div className="mx-2">
      <h5 className="text-body">Prototype Schematic</h5>
      <Image src={schematic} fluid style={{ width: '50%' }} />
      <h5 className="text-body">Pin Table</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sensor & Actuator</th>
            <th>Pin ESP32</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Servo Motor</td>
            <td>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>VCC</th>
                    <td>5V</td>
                  </tr>
                  <tr>
                    <th>CTRL</th>
                    <td>IO12</td>
                  </tr>
                  <tr>
                    <th>GND</th>
                    <td>GND</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>Ultrasonic Sensor</td>
            <td>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>VCC</th>
                    <td>5V</td>
                  </tr>
                  <tr>
                    <th>TRIG</th>
                    <td>IO27</td>
                  </tr>
                  <tr>
                    <th>ECHO</th>
                    <td>IO26</td>
                  </tr>
                  <tr>
                    <th>GND</th>
                    <td>GND</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>Button</td>
            <td>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>+</th>
                    <td>IO04</td>
                  </tr>
                  <tr>
                    <th>-</th>
                    <td>GND</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>LED</td>
            <td>
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>+</th>
                    <td>5V</td>
                  </tr>
                  <tr>
                    <th>-</th>
                    <td>GND</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DocPrototype;
