import React, { useEffect, useState } from "react";
import "./styles/CustomerFeedback.css";

const BASE_URL = "http://localhost:8081";

const fetchTestimonies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/comments/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch testimonies");
    }
    const testimonies = await response.json();
    return testimonies;
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return [];
  }
};

function CustomerFeedback() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch testimonies when the component mounts
    const getTestimonies = async () => {
      const data = await fetchTestimonies();
      setTestimonies(data);
      setLoading(false);
    };

    getTestimonies();
  }, []);

  if (loading) {
    return (
      <div>
        <div className='testimonies'>
          <h2>Customer Testimonies</h2>
          <p>loading testimonies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='testimonies'>
      <h2>Customer Testimonies</h2>
      {testimonies.length > 0 ? (
        <ul>
          {testimonies.map((testimony) => (
            <li key={testimony.id} className='testimony'>
              <div className='testimony-content'>
                <p>{testimony.commentMessage}</p>
                <small>- User {testimony.userId}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className='testimony'>
          <div className='testimony-content'>
            <p>No testimonies available yet.</p>
            <small>-someone</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerFeedback;
