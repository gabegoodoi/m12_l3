import { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Fetching a post by ID
const fetchPostById = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch post');
    }
    return response.json();
};

// Updating a post
const putPost = async ({ id, post }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to update post');
    }
    return response.json();
};

const UpdatePost = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [formData, setFormData] = useState({ title: '', body: '', userId: '', postId: '' });

    // Mutation hook for updating a post
    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: putPost,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post updated with ID:', data.id);
            queryClient.invalidateQueries(['posts']); 
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const { postId, title, body, userId } = formData;
        if (!postId) {
            console.error('Please enter a postId');
            return;
        }

        const updatedPost = {
            title,
            body,
            userId,
        };

        // Call the mutate function with the postId and updated post data
        mutate({ id: postId, post: updatedPost });
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div>
            {isError && <Alert variant="danger">An error occurred: {error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Post successfully updated!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="postId">
                        <Form.Label>Post ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="postId"
                            placeholder="Enter Post ID"
                            value={formData.postId}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Enter title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>   

                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            type="number"
                            name="userId"
                            placeholder="Enter User ID"
                            min="1"
                            step="any"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>  

                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="body"
                            rows={3}
                            value={formData.body}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>    

                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating post...' : 'Update Post'}
                    </Button>
                </Form>         
            </Col>
        </div>
    );
};

export default UpdatePost;
