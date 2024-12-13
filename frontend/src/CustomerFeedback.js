import React, { useEffect, useState } from "react";
import { Container, Form, Button, ListGroup, Card } from "react-bootstrap";
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

function CustomerFeedback({ user, setUser }) {
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
  const postTestimony = async (userID, commentMessage) => {
    try {
      const response = await fetch(`${BASE_URL}/comments/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, commentMessage }),
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

    if (!user.isLoggedIn) {
      console.error("User is not logged in. Cannot post testimony.");
      return;
    }

    const postedTestimony = await postTestimony(user.userID, messageContent);

    if (postedTestimony) {
      setTestimonies([...testimonies, postedTestimony]);
      setMessageContent("");
      setShowForm(false);
    }
  };

  const handleDelete = async (testimonyId) => {
    if (!testimonyId) {
      console.error("Invalid testimony ID");
      return;
    }

    const success = await deleteTestimony(testimonyId);

    if (success) {
      setTestimonies(
        testimonies.filter((testimony) => testimony.id !== testimonyId)
      );
    }
  };

  if (loading) {
    return (
      <Container>
        <h2>Customer Testimonies</h2>
        <p>Loading testimonies...</p>
      </Container>
    );
  }

  return (
    <Container className='my-5'>
      <h2>Customer Testimonies</h2>
      {testimonies.length > 0 ? (
        <ListGroup>
          {testimonies.map((testimony) => (
            <ListGroup.Item
              key={testimony.id}
              className='d-flex justify-content-between'
            >
              <div>
                <p>{testimony.commentMessage}</p>
                <small>- {testimony.username || "Anonymous"}</small>
              </div>
              {/* Delete button visible based on user permissions */}
              {(user.isAdmin || testimony.userID === user.userID) && (
                <Button
                  variant='danger'
                  onClick={() => handleDelete(testimony.id)}
                  size='sm'
                >
                  Delete
                </Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>
            <p>No testimonies available yet.</p>
            <small>- Someone</small>
          </Card.Body>
        </Card>
      )}

      {user.isLoggedIn && (
        <Button
          variant='secondary'
          onClick={() => setShowForm(!showForm)}
          className='mt-3'
        >
          {showForm ? "Close Form" : "Add Testimony"}
        </Button>
      )}

      {showForm && (
        <Form onSubmit={handleSubmit} className='mt-4 shadow p-3 rounded'>
          <Form.Group controlId='messageContent'>
            <Form.Label>Share Your Testimony:</Form.Label>
            <Form.Control
              as='textarea'
              rows={5}
              placeholder='Write your testimony here...'
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              required
            />
          </Form.Group>
          <Button type='submit' variant='primary' className='mt-3 w-100'>
            Submit
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default CustomerFeedback;
