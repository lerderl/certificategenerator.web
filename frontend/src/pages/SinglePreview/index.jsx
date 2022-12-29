import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../Component/Modal";
import Button from "../../Component/button";
import "./singlepreview.style.scss";
import certificate from "../../assets/images/SinglePreview/certTemplate (1).png";
import certificate2 from "../../assets/images/SinglePreview/certTemplate (2).png";
import certificate3 from "../../assets/images/SinglePreview/certTemplate (3).png";
import { exportComponentAsPNG } from "react-component-export-image";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { axiosFormData } from "../../api/axios";
import Swal from "sweetalert2";
import Template1 from "./Templates/template1";
import Template2 from "./Templates/template2";
import Template3 from "./Templates/template3";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

function SinglePreview({
  logo,
  message,
  issuedBy,
  issueDate,
  awardeeName,
  certificateTitle,
}) {
  const navigate = useNavigate();
  //STATES FOR TEMPLATES
  const [templateone, setTemplateOne] = useState(true);
  const [templatetwo, setTemplateTwo] = useState(false);
  const [templatethree, setTemplateThree] = useState(false);

  //FUNCTIONS TO HANDLE TEMPLATES

  const handleTemplate1 = () => {
    setTemplateOne(true);
    setTemplateTwo(false);
    setTemplateThree(false);
  };
  const handleTemplate2 = () => {
    setTemplateTwo(true);
    setTemplateOne(false);
    setTemplateThree(false);
  };
  const handleTemplate3 = () => {
    setTemplateThree(true);
    setTemplateOne(false);
    setTemplateTwo(false);
  };

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isAuntheticated, setIsAuntheticated] = useState(false);

  useEffect(() => {
    localStorage.getItem("userData")
      ? setIsAuntheticated(true)
      : setIsAuntheticated(false);
  }, []);

  const pdfExportComponent = React.useRef(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  // REF FOR PNG AND PDF
  var certificateWrapper = React.createRef();

  const Toast = Swal.mixin({
    timer: 3000,
    toast: true,
    position: "top-end",
    timerProgressBar: true,
    showConfirmButton: false,
    didOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });

  const handleSendCertificate = async e => {
    try {
      localStorage.getItem("userData")
        ? setIsAuntheticated(true)
        : setIsAuntheticated(false);

      if (!isAuntheticated) {
        setOpenModal(!openModal);
        setModalMessage("You need to sign up to send certificate to your mail");
        return;
      }

      const element = certificateWrapper.current;
      const canvas = await html2canvas(element);
      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "l",
        unit: "pt",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

      // get token from localstorage
      const token = JSON.parse(localStorage.getItem("userData")).token;

      // create form data and add pdf
      let formData = new FormData();
      formData.append("file", data);

      // send the form data
      const uploadUrl = "/sendEmailNotifications";
      let response = await axiosFormData.post(uploadUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      // toast message
      const dataMsg = response.data;
      if (response.status === 200) {
        Toast.fire({
          icon: "success",
          title: dataMsg.message
        });
      } else if (response.status === 403) {
        Toast.fire({
          icon: "error",
          title: dataMsg.error
        });
      } else {
        Toast.fire({
          icon: "error",
          title: dataMsg.message
        });
        throw new Error(dataMsg.message);
      }
    } catch (error) {
      console.log(error);
      Toast.fire({
        icon: "error",
        title: "Internal Server Error"
      });
    }
  };

  return (
    <div id="singlePreview">
      {/* IMAGE OF YOUR CERTIFICATE READY TO BE DOWNLOADED OR SENT */}

      <div className="certificate-header">
        <h4>Your certificate is ready!</h4>
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          modalText={modalMessage}
        />
      </div>

      {/* START OF CERTIFICATE */}
      {templateone && (
        <PDFExport
          paperSize="auto"
          author="Certgo Team"
          ref={pdfExportComponent}
          fileName={`${awardeeName}`}
        >
          <div ref={certificateWrapper}>
            <Template1
              logo={logo}
              message={message}
              issuedBy={issuedBy}
              issueDate={issueDate}
              awardeeName={awardeeName}
              certificateTitle={certificateTitle}
            />
          </div>
        </PDFExport>
      )}
      {templatetwo && (
        <PDFExport
          paperSize="auto"
          author="Certgo Team"
          ref={pdfExportComponent}
          fileName={`${awardeeName}`}
        >
          <div ref={certificateWrapper}>
            <Template2
              logo={logo}
              message={message}
              issuedBy={issuedBy}
              issueDate={issueDate}
              awardeeName={awardeeName}
              certificateTitle={certificateTitle}
            />
          </div>
        </PDFExport>
      )}
      {templatethree && (
        <PDFExport
          paperSize="auto"
          author="Certgo Team"
          ref={pdfExportComponent}
          fileName={`${awardeeName}`}
        >
          <div ref={certificateWrapper}>
            <Template3
              logo={logo}
              message={message}
              issuedBy={issuedBy}
              issueDate={issueDate}
              awardeeName={awardeeName}
              certificateTitle={certificateTitle}
            />
          </div>
        </PDFExport>
      )}

      {/* END OF CERTIFICATE */}

      <div className="certificate-share-hero">
        {/* BUTTONS FOR EITHER SENDIMG OR DOWNLOADING */}
        <div className="buttons">
          <Button
            className="send-button"
            onClick={e => {
              handleSendCertificate(e);
            }}
          >
            Send Certificate
          </Button>
          <div className="dropdown">
            <button className="dropbtn download-button">
              Download Certificate
            </button>
            <div className="dropdown-content">
              <button
                onClick={e => {
                  e.preventDefault();
                  exportComponentAsPNG(pdfExportComponent, {
                    fileName: `${awardeeName}`,
                    html2CanvasOptions: { backgroundColor: "#fff" }
                  });
                }}
                className="png-button"
              >
                PNG
              </button>
              <button onClick={exportPDFWithComponent} className="pdf-button">
                PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OTHER TEMPLATES TO CHOOSE FROM */}
      <h2>Even More Templates for you</h2>
      <div className="single-images">
        <img onClick={handleTemplate1} src={certificate2} alt="templates" />
        <img onClick={handleTemplate2} src={certificate} alt="templates" />
        <img onClick={handleTemplate3} src={certificate3} alt="templates" />
      </div>

      {/* BUTTON TO EXPLORE MORE TEMPLATES */}
      <Link to="/templates">
        <Button
          name="Explore More Templates"
          style={{ margin: " 2rem auto" }}
        ></Button>
      </Link>
    </div>
  );
}

export default SinglePreview;
