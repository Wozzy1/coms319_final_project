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

const submitTestimony = async (data) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to submit testimony");
    }
    return await response.json();
  } catch (error) {
    console.error("Error submitting testimony:", error);
    return null;
  }
};

const postTestimony = async (message, userId) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, userId }),
    });
    if (!response.ok) {
      throw new Error("Failed to post testimony");
    }
    return await response.json();
  } catch (error) {
    console.error("Error posting testimony:", error);
    return null;
  }
};

function CustomerFeedback() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    messageContent: "",
  });

  useEffect(() => {
    const getTestimonies = async () => {
      const data = await fetchTestimonies();
      setTestimonies(data);
      setLoading(false);
    };

    getTestimonies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the data to match the required structure
    const testimonyData = {
      userId: 2, // Replace with the actual user ID if dynamic
      commentMessage: formData.messageContent,
    };
  
    console.log("--> " + formData.messageContent);

    const postedTestimony = await postTestimony(testimonyData.commentMessage, testimonyData.userId);
  
    if (postedTestimony) {
      setTestimonies([...testimonies, postedTestimony]);
      setFormData({ firstName: "", lastName: "", messageContent: "" });
      setShowForm(false);
    }
  };
  
  if (loading) {
    return (
      <div>
        <div className="testimonies">
          <h2>Customer Testimonies</h2>
          <p>Loading testimonies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonies">
      <h2>Customer Testimonies</h2>
      {testimonies.length > 0 ? (
        <ul>
          {testimonies.map((testimony) => (
            <li key={testimony.id} className="testimony">
              <div className="testimony-content">
                <p>{testimony.commentMessage}</p>
                <small>- {testimony.firstName} {testimony.lastName}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="testimony">
          <div className="testimony-content">
            <p>No testimonies available yet.</p>
            <small>- Someone</small>
          </div>
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)} className="toggle-form-btn">
        {showForm ? "Close Form" : "Add Testimony"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="testimony-form">
          <div>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="messageContent">Message:</label>
            <textarea
              id="messageContent"
              name="messageContent"
              value={formData.messageContent}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      )}
    </div>
  );
}

export default CustomerFeedback;
