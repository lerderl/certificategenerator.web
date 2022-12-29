import React from 'react'

import logo1 from "../../../assets/images/site-logo.svg";
import certgo from "../../../assets/images/certgo-cert-1.png";

function Template1({
    logo,
    message,
    issuedBy,
    issueDate,
    awardeeName,
    certificateTitle,
  }) {
    return (
      <div className="cert-background">
        <img
          src={certgo}
          alt="Certificate background"
          className="cert-background-image"
        />
        <div className="cert-content">
          <img src={logo1} alt="Company logo" style={{ marginTop: "44.16px" }} />
          <div className="cert-title">
            {/* Certificate of Excellence */}
            {certificateTitle}
          </div>
          <div className="cert-title-description">
            THIS CERTIFICATE IS AWARDED TO
          </div>
          <div className="cert-awardee">
            {/* Gabriel Prosper */}
            {awardeeName}
          </div>
          <div className="cert-line"></div>
          <div className='cert-message'>
            {/* For your exceptional performance this month, in appreciation for
            your loyalty and the desire to fulfil our goals, in recognition of
            your leadership and dedication */}
            {message}
          </div>
          <div className="issue">
            <div className="issue-value">
              <h6>
                {issuedBy}
                {/* HNG */}
              </h6>
              <div className="line"></div>
              <p className="issue-value">ISSUED BY</p>
            </div>

            <div className="issue-value">
              <h6>
                {issueDate}
                {/* 12/29/2022 */}
              </h6>
              <div className="line"></div>
              <p className="issue-value">ISSUE DATE</p>
            </div>
          </div>
        </div>
        {/* <div id="certificateWrapper">
          <div id="container-wrapper">
            <div id="container-design">
              <div className="sample3"></div>
              <div className="sample"></div> */}

        {/* <div id="single-preview-card"> */}
        {/* <div id="single-preview-text"> */}
        {/* <div id="preview-text"> */}
        {/* <img
                      id="container-logo"
                      src={logo1}
                      alt="logo"
                    /> */}
        {/* <div
                      style={{
                        textAlign: "center",
                        fontWeight: 500,
                        fontSize: "20.2px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase"
                      }}
                    > */}
        {/* {certificateTitle} */}
        {/* Certificate of Excellence
                    </div> */}

        {/* <div
                      style={{
                        fontWeight: 300,
                        fontSize: "9.07195px",
                        textAlign: "center",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase"
                      }}
                    >
                      THIS CERTIFICATE IS AWARDED TO
                    </div> */}
        {/* <h2>{awardeeName}</h2>
                    <h6>{message}</h6> */}
        {/* </div> */}

        {/* <div className="single-preview-issue">
        <div className="issue-by">
          <h6>{issuedBy}</h6>
          <div className="line"></div>
          <p>ISSUED BY</p>
        </div>

        <div className="issue-by">
          <h6>{issueDate}</h6>
          <div className="line"></div>
          <p>ISSUE DATE</p>
        </div>
        </div> */}
        {/* </div> */}
        {/* </div> */}
        {/* <div className="sample2"></div> */}
        {/* </div>
          </div>
        </div> */}
      </div>
    );
}

export default Template1
