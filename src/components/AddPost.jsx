import { useState } from 'react';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// function to post data to the API
const postPost = async (post) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    if (!response.ok) {
        throw new Error('Failed to add new post');
    }
    return response.json();
};

const AddPost = () => {
    const queryClient = useQueryClient();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const { mutate, isLoading, isError, error } = useMutation({
        mutationFn: postPost,
        onSuccess: (data) => {
            setShowSuccessAlert(true);
            console.log('Post added with ID:', data.id);
            queryClient.invalidateQueries(['posts']);
            setTimeout(() => setShowSuccessAlert(false), 5000)
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const post = {
            title: formData.get('title'),
            body: formData.get('body'),
            userId: formData.get('userId'),
        };
        mutate(post);
        event.target.reset();
    };

    return (
        <div>
            {isError && <Alert variant="danger">An error occurred: {error.message}</Alert>}
            {showSuccessAlert && <Alert variant="success">Post successfully added!</Alert>}
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" placeholder="Enter title" required/>
                    </Form.Group>   
                    <Form.Group className="mb-3" controlId="userId">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" name="userId" placeholder="Enter User ID" min="1" step="any" required/>
                    </Form.Group>  
                    <Form.Group className="mb-3" controlId="body">
                        <Form.Label>Body</Form.Label>
                        <Form.Control as="textarea" name="body" rows={3} required/>
                    </Form.Group>    
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? 'Posting...' : 'Submit Post'}
                    </Button>
                </Form>         
            </Col>
        </div>
    )

};

export default AddPost;