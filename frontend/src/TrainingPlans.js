import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

function TrainingPlans() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        // Assuming the data is coming from a local JSON file
        const response = await fetch("/programs.json");
        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData); // Debugging
        setData(jsonData || []); // Default to empty array if the data is undefined
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchJsonData();
  }, []);

  const renderRows = () => {
    if (!data || data.length === 0) return <p>No content available.</p>;

    return data.map((program, index) => (
      <div key={index} className='row' style={{ padding: "25px" }}>
        <div className='col-md-auto' style={{ padding: "20px" }}>
          <img
            src={`/images/${program.program
              .replace(/\s+/g, "_")
              .toLowerCase()}.jpg`} // Example image mapping
            alt={program.program}
            className='img'
            style={{ maxHeight: "50vw" }}
          />
        </div>
        <div className='col'>
          <div className='row'>
            <p className='header-text'>{program.program}</p>
          </div>
          <div className='row' style={{ paddingTop: "2vh" }}>
            <div className='content-text'>
              <ul>
                {program.description.map((desc, idx) => (
                  <li key={idx}>{desc}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div
        style={{
          width: "98.9vw",
          height: "42vw",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          id='home_page_image'
          src='/images/thr33_green_logo.png'
          alt='placeholder for now'
          style={{ maxWidth: "100%", maxHeight: "auto", objectFit: "contain" }}
        />
      </div>
      <div id='content-container' className='container-fluid'>
        {renderRows()}
      </div>
    </div>
  );
}

function viewLanding() {
  setViewer(0);
}

export default TrainingPlans;
