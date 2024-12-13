import React, { useState, useEffect } from "react";
import "./styles/styles.css";

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
      <div key={index} className='row'>
        <div style={{ paddingTop: "3rem" }} />

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
        <div style={{ paddingTop: "3rem" }} />
        <hr />
      </div>
    ));
  };

  return (
    <div>
      <hr />
      <div id='content-container' className='container-fluid'>
        {renderRows()}
      </div>
    </div>
  );
}

export default TrainingPlans;
