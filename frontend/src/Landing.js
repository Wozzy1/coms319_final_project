import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/Landing.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Landing() {
  // Function to fetch JSON data
  async function fetchJsonData() {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();
      processJsonData(data);
    } catch (err) {
      console.log("Error: " + err);
    }
  }

  // Function to process and render the JSON data
  function processJsonData(array) {
    var div = document.getElementById("content-container");
    console.log(array.data.length);

    for (let index = 0; index < array.data.length; index += 2) {
      // console.log(array.data[index].image);
      const thing = array.data[index];
      const thing2 = array.data[index + 1];

      // Create HTML elements for each part of the data

      let container = document.createElement("div");
      container.innerHTML = `<div class="row" style="padding: 25px">
            <!-- auto div: put image inside and determine the size of it and the grid will snap to -->
            <div class="col-md-auto" style="padding: 20px">
              <img src="${thing.image}" alt="${thing.alt}"class="img" style="max-height: 50vw" />
            </div>
            <div class="col">
              <div class="row">
                <p class="header-text">${thing.header}</p>
              </div>
  
              <div class="row" style="padding-top: 2vh">
                <div class="content-text">
                  <p>
                    ${thing.content1}
                    <br />
                    <br />
                    ${thing.content2}
                    <br />
                    <br />
                    ${thing.content3}
                  </p>
                </div>
              </div>
            </div>
          </div>
  
          <hr />
          
          <div class="row" style="padding: 25px">
          <!-- auto div: put image inside and determine the size of it and the grid will snap to -->
          <div class="col">
            <div class="row">
              <p class="header-text">${thing2.header}</p>
            </div>
  
            <div class="row" style="padding-top: 2vh">
              <div class="content-text">
                <p>
                  ${thing2.content1}
                    <br />
                    <br />
                    ${thing2.content2}
                    <br />
                    <br />
                    ${thing2.content3}
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-auto" style="padding: 20px">
            <img src="${thing2.image}" alt = "${thing2.alt}"class="img" style="max-height: 50vw" />
          </div>
        </div>
        <hr />
          `;

      // Append section to the container

      div.appendChild(container);
    }
  }

  // window on load react equivalent
  useEffect(() => {
    fetchJsonData();
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100vw",
          height: "40vw",
          overflow: "hidden",
          display: "flex", // Enable flexbox
          justifyContent: "center", // Center horizontally
          alignItems: "center", // Center vertically
        }}
      >
        <img
          id='home_page_image'
          src='./images/thr33_green_logo.png'
          alt='placeholder for now'
          style={{ maxWidth: "100%", maxHeight: "auto", objectFit: "contain" }} // Prevent overflow
        />
      </div>
      <div
        id='content-container'
        className='container-fluid'
        style={{ backgroundColor: "light" }}
      ></div>
    </div>
  );
}

export default Landing;
