import React, { useEffect, useState } from "react";
import "./styles/CustomerFeedback.css";

const BASE_URL = "http://localhost:8081";

// Fetch testimonies
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

// Delete testimony
const deleteTestimony = async (testimonyId) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/delete/${testimonyId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete testimony");
    }
    return true;
  } catch (error) {
    console.error("Error deleting testimony:", error);
    return false;
  }
};

function CustomerFeedback({ isAdmin, setIsAdmin, userID, setUserID }) {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [messageContent, setMessageContent] = useState("");

  // Fetch testimonies on component mount
  useEffect(() => {
    const getTestimonies = async () => {
      const data = await fetchTestimonies();
      setTestimonies(data);
      setLoading(false);
    };

    getTestimonies();
  }, []);

  // Post testimony
  const postTestimony = async (userId, commentMessage) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, commentMessage }),
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const postedTestimony = await postTestimony(userID, messageContent);

    if (postedTestimony) {
      setTestimonies([...testimonies, postedTestimony]);
      setMessageContent("");
      setShowForm(false);
    }
  };

  const handleDelete = async (testimonyId) => {
    console.log("Attempting to delete testimony with ID:", testimonyId); // Log to confirm the ID
    if (!testimonyId) {
      console.error("Invalid testimony ID");
      return;
    }
  
    const success = await deleteTestimony(testimonyId);
  
    if (success) {
      setTestimonies(testimonies.filter(testimony => testimony.id !== testimonyId));
    }
  };
  
  if (loading) {
    return (
      <div>
        <div className='testimonies'>
          <h2>Customer Testimonies</h2>
          <p>Loading testimonies...</p>
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
                <small>
                  - {testimony.firstName} {testimony.lastName}
                </small>
              </div>
              {/* Delete button visible based on user permissions */}
              {(isAdmin || testimony.userId === userID) && (
                <button
                  onClick={() => handleDelete(testimony.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className='testimony'>
          <div className='testimony-content'>
            <p>No testimonies available yet.</p>
            <small>- Someone</small>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className='toggle-form-btn'
      >
        {showForm ? "Close Form" : "Add Testimony"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className='testimony-form'>
          <div>
            <label htmlFor='messageContent'>Message:</label>
            <textarea
              id='messageContent'
              name='messageContent'
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
            />
          </div>
          <button type='submit' className='submit-btn'>
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default CustomerFeedback;
