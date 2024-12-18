import React, { useEffect, useState } from "react";
import { Container, Form, Button, ListGroup, Card } from "react-bootstrap";
import "./styles/CustomerFeedback.css";

const BASE_URL = "http://localhost:8081";

// get username by id
const getUserById = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error fetching user with ID ${userId}`
      );
    }

    const userData = await response.json(); // Parse the JSON response
    return userData; // User data retrieved successfully
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null; // Return null on error
  }
};

// fetch user
const fetchUser = async (userId) => {
  const userData = await getUserById(userId);
  if (userData) {
    console.log("User Data:", userData);
    return userData.username;
  } else {
    console.log("Failed to fetch user data.");
  }
};

// Fetch testimonies
const fetchTestimonies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/comments/list`);
    if (!response.ok) {
      throw new Error("Failed to fetch testimonies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    return [];
  }
};

// Delete testimony
const deleteTestimony = async (commentId) => {
  try {
    const response = await fetch(`${BASE_URL}/comments/delete/${commentId}`, {
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

// Update testimony
const updateTestimony = async (commentId, commentMessage, userId) => {
  try {
    console.log("Inside update: " + commentId, commentMessage, userId);
    const response = await fetch(`${BASE_URL}/comments/update/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ commentMessage, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating testimony");
    }

    return await response.text(); // Success message
  } catch (error) {
    console.error("Error updating testimony:", error);
    return null;
  }
};

function CustomerFeedback({ user }) {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [editingTestimony, setEditingTestimony] = useState(null); // Track which testimony is being edited

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
      console.log(commentMessage, userId);
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

  // Handle form submission for new or edited testimony
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.isLoggedIn) {
      console.error("User is not logged in. Cannot post testimony.");
      return;
    }

    if (editingTestimony) {
      // Update testimony
      const updatedTestimony = await updateTestimony(
        editingTestimony.commentId,
        messageContent,
        user.userID
      );

      if (updatedTestimony) {
        setTestimonies(
          testimonies.map((testimony) =>
            testimony.commentId === editingTestimony.commentId
              ? { ...testimony, commentMessage: messageContent }
              : testimony
          )
        );
        setEditingTestimony(null);
        setMessageContent("");
        setShowForm(false);
        setTimeout(function () {
          alert("Testimony updated! Thanks!");
        }, 1);
      }
    } else {
      // Post new testimony
      const postedTestimony = await postTestimony(user.userID, messageContent);
      if (postedTestimony) {
        setTestimonies([...testimonies, postedTestimony]);
        setMessageContent("");
        setShowForm(false);
        setTimeout(function () {
          alert("Testimony posted! Thanks!");
        }, 1);
      }
    }
  };

  const handleDelete = async (commentId) => {
    if (!commentId) {
      console.error("Invalid comment ID");
      return;
    }

    const success = await deleteTestimony(commentId);

    if (success) {
      setTestimonies(
        testimonies.filter((testimony) => testimony.commentId !== commentId)
      );
    }
  };

  // Handle edit button click
  const handleEdit = (testimony) => {
    setEditingTestimony(testimony);
    setMessageContent(testimony.commentMessage);
    setShowForm(true);
  };

  if (loading) {
    return (
      <Container>
        <div style={{ paddingTop: "3rem" }} />
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
              key={testimony.commentId}
              className='d-flex justify-content-between'
            >
              <div>
                <p>{testimony.commentMessage}</p>
                <small>- {fetchUser(testimony.userId)}</small>
              </div>
              {/* Edit and Delete buttons visible based on user permissions */}
              {(user.isAdmin || testimony.userId === user.userId) && (
                <div>
                  <Button
                    variant='warning'
                    size='sm'
                    onClick={() => handleEdit(testimony)}
                    className='mr-2'
                  >
                    Edit
                  </Button>
                  <Button
                    variant='danger'
                    onClick={() => handleDelete(testimony.commentId)}
                    size='sm'
                  >
                    Delete
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card>
          <Card.Body>
            <p>No testimonies available yet.</p>
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
            {editingTestimony ? "Update Testimony" : "Submit"}
          </Button>
        </Form>
      )}
      <div style={{ paddingTop: "5rem" }} />
    </Container>
  );
}

export default CustomerFeedback;
