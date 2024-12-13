import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Landing.css";

function Landing() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchJsonData() {
      try {
        const response = await fetch("/data.json");
        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData); // Debugging
        setData(jsonData.data || []); // Default to empty array if "data" is undefined
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchJsonData();
  }, []);

  const renderRows = () => {
    if (!data || data.length === 0) return <p>No content available.</p>;

    return data.map((thing, index) => {
      const thing2 = data[index + 1]; // Next item, if exists
      if (index % 2 !== 0) return null; // Skip odd indices

      return (
        <React.Fragment key={thing.id || index}>
          <div className='row' style={{ padding: "25px" }}>
            <div className='col-md-auto' style={{ padding: "20px" }}>
              <img
                src={thing.image}
                alt={thing.alt}
                className='img'
                style={{ maxHeight: "50vw" }}
              />
            </div>
            <div className='col'>
              <div className='row'>
                <p className='header-text'>{thing.header}</p>
              </div>
              <div className='row' style={{ paddingTop: "2vh" }}>
                <div className='content-text'>
                  <p>
                    {thing.content1}
                    <br />
                    <br />
                    {thing.content2}
                    <br />
                    <br />
                    {thing.content3}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />

          {thing2 && (
            <div className='row' style={{ padding: "25px" }}>
              <div className='col'>
                <div className='row'>
                  <p className='header-text'>{thing2.header}</p>
                </div>
                <div className='row' style={{ paddingTop: "2vh" }}>
                  <div className='content-text'>
                    <p>
                      {thing2.content1}
                      <br />
                      <br />
                      {thing2.content2}
                      <br />
                      <br />
                      {thing2.content3}
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-md-auto' style={{ padding: "20px" }}>
                <img
                  src={thing2.image}
                  alt={thing2.alt}
                  className='img'
                  style={{ maxHeight: "50vw" }}
                />
              </div>
            </div>
          )}
          <hr />
        </React.Fragment>
      );
    });
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

export default Landing;
