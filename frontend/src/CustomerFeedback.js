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
  const [users, setUsers] = useState({}); // Map to store user details by userId
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [editingTestimony, setEditingTestimony] = useState(null); // Track which testimony is being edited

  // Fetch testimonies and user details on component mount
  useEffect(() => {
    const getTestimonies = async () => {
      const data = await fetchTestimonies();
      setTestimonies(data);
      await fetchUserDetails(data.map((t) => t.userId)); // Fetch user details for testimonies
      setLoading(false);
    };

    getTestimonies();
  }, []);

  // Fetch user details by user IDs
  const fetchUserDetails = async (userIds) => {
    const uniqueUserIds = [...new Set(userIds)]; // Avoid duplicate requests
    const userDetails = {};

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const response = await fetch(`${BASE_URL}/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            userDetails[userId] = userData[0]; // Assuming the backend sends user data in an array
          }
        } catch (error) {
          console.error(`Error fetching user with ID ${userId}:`, error);
        }
      })
    );

    setUsers((prev) => ({ ...prev, ...userDetails }));
  };

  const handleDelete = async (commentId) => {
    const success = await deleteTestimony(commentId);
    if (success) {
      setTestimonies(testimonies.filter((t) => t.commentId !== commentId));
    }
  };

  const handleEdit = (testimony) => {
    setEditingTestimony(testimony);
    setMessageContent(testimony.commentMessage);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingTestimony) {
      const updated = await updateTestimony(
        editingTestimony.commentId,
        messageContent,
        user.userID
      );
      if (updated) {
        setTestimonies(
          testimonies.map((t) =>
            t.commentId === editingTestimony.commentId
              ? { ...t, commentMessage: messageContent }
              : t
          )
        );
        setEditingTestimony(null);
        setMessageContent("");
        setShowForm(false);
        alert("Testimony updated! Thanks!");
      }
    } else {
      const posted = await postTestimony(user.userID, messageContent);
      if (posted) {
        setTestimonies([...testimonies, posted]);
        setMessageContent("");
        setShowForm(false);
        alert("Testimony posted! Thanks!");
      }
    }
  };

  if (loading) {
    return (
      <Container style={{ paddingTop: "5rem" }}>
        <h2>Customer Testimonies</h2>
        <p>Loading testimonies...</p>
      </Container>
    );
  }

  return (
    <Container className='my-5' style={{ paddingTop: "2rem" }}>
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
                    size='sm'
                    onClick={() => handleDelete(testimony.commentId)}
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
    </Container>
  );
}

export default CustomerFeedback;
