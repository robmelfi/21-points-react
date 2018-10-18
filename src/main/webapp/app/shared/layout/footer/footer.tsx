import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = props => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p>
          <strong>21-Points Health</strong>
          | An application developed for a better life and <a href="http://www.jhipster-book.com" target="_blank">The JHipster Mini-Book</a>
          | By <a href="http://raibledesigns.com" target="_blank">Matt Raible</a>
        </p>
      </Col>
    </Row>
  </div>
);

export default Footer;
