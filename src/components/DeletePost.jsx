import React, { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const deletePost = async ({ id }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete post');
    }
    return response.json();
};

const DeletePost = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [formData, setFormData] = useState({ postId: '' });

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post deleted with ID:', data.id);
            queryClient.invalidateQueries(['posts']);
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            console.error('Error deleting post:', error);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        const { postId } = formData;
        if (!postId) {
            console.error('Please enter a postId');
            return;
        }
        mutate({ id: postId });
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <div>
            {isError && <Alert variant="danger">{error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Post successfully deleted!</Alert>}
            
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

                    <Button variant="danger" type="submit" disabled={isLoading}>
                        {isLoading ? 'Deleting post...' : 'Delete Post'}
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default DeletePost;