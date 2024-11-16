import React, { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const postComment = async (comment) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    });
    if (!response.ok) {
        throw new Error('Failed to add comment');
    }
    return response.json();
};

const CommentForm = () => {
    const queryClient = useQueryClient();
    const [formError, setFormError] = useState(null);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const { mutate, isLoading } = useMutation({
        mutationFn: postComment,
        onSuccess: () => {
            setShowSuccessAlert(true);
            queryClient.invalidateQueries(['comments']); 
            setTimeout(() => setShowSuccessAlert(false), 5000);
        },
        onError: (error) => {
            setFormError(error.message);
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setFormError(null);

        const formData = new FormData(event.target);
        const comment = {
            body: formData.get('body'),
            postId: formData.get('postId'),
        };

        if ( !comment.body || !comment.postId) {
            setFormError('All fields are required.');
            return;
        }

        mutate(comment);
        event.target.reset();
    };

    return (
        <div>
            {formError && (
                <Alert variant="danger" aria-live="polite">
                    {formError}
                </Alert>
            )}
            {showSuccessAlert && (
                <Alert variant="success" aria-live="polite">
                    Comment successfully posted!
                </Alert>
            )}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="postId">
                        <Form.Label>Post ID</Form.Label>
                        <Form.Control
                            type="number"
                            name="postId"
                            placeholder="Enter Post ID"
                            aria-required="true"
                            min="1"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="body"
                            rows={3}
                            placeholder="Enter your comment"
                            aria-required="true"
                            required
                        />
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isLoading}
                        aria-label={isLoading ? 'Submitting your comment...' : 'Submit your comment'}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Comment'}
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default CommentForm;