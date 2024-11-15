// RFE Module 12 Lesson 4: Assignments | Performance Optimization in React
// For this assignment I applied task one to this component, task 2 to the UpdatePost component, and task 3 to the AddPost component


import { Card, Row, Col, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    return posts;
};

const PostsList = () => {
    // State to keep track of selected user ID for filtering
    const [selectedUserId, setSelectedUserId] = useState(null);

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(100 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
    });

    // Memoized filtered posts based on selected user ID
    const filteredPosts = useMemo(() => {
        // If selectedUserId is empty, show all posts; otherwise, filter by userId
        return posts?.filter(post => selectedUserId === null || post.userId === selectedUserId) || [];
    }, [posts, selectedUserId]);

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const userIdInput = e.target.userId.value;
        setSelectedUserId(userIdInput ? parseInt(userIdInput) : null);
    };

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">...Loading</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <div>
            <h2>Posts List</h2>
            
            {/* Dropdown to select a specific user ID for filtering */}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="userId">
                    <Form.Label>Filter by User ID</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="userId" 
                        placeholder="Enter User ID" 
                        value={selectedUserId || ''} // Use an empty string if no user ID is selected
                        onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                    />
                </Form.Group>  
            </Form>
            
            {/* Display filtered posts */}
            <Row xs={1} md={4} className="g-4">
                {filteredPosts.map(post => (
                    <Col key={post.id}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title className="fs-3">
                                    {post.id}. {post.title}
                                    <p className="fs-6 mt-1">By<br /> <i>User #{post.userId}</i></p>
                                </Card.Title>
                                <Card.Text>Post: {post.body}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PostsList;