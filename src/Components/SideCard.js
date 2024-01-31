import React from 'react';
import { Image } from 'react-bootstrap';

function SideCard({ title, desc, img }) {
  return (
    <div>
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <div className="p-1 d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
              <Image src={img} alt={title} fluid className="img-fluid" style={{ objectFit: 'cover', maxHeight: '100%' }} />
            </div>
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">{desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideCard;
