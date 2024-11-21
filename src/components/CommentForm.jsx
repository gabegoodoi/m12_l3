// import React to use for jsx syntax and components to function properly
// import the useState hook to manage the state of the success alert and form error
import React, { useState } from 'react';

// import special React Bootstrap HTML elements to use in this component's return
import { Form, Button, Alert, Col } from 'react-bootstrap';

// import React Query hooks used to 1. manage asynchronous actions, that's useMutation and 2. allow interaction with the query cache, that's useQueryClient
import { useMutation, useQueryClient } from '@tanstack/react-query';

// function to post comment data to the API
// postComment's value is being declared here as a Promise (the async/await syntax is used to handle this promise).
const postComment = async (comment) => { // arrow function that takes comment object as input and runs a function sending it to an API
    const response = await fetch('https://jsonplaceholder.typicode.com/comments', {
    // within the postComment promise above, 'response' is a variable that's value is equal to the return value of the fetch function.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
    });
        // the fetch function above sends a request to the provided url. The method, headers, and body are asecondary input that determine the request type, the content type (JSON), and convert the post object from postPost into a JSON string.
    if (!response.ok) { // fetch returns the response with a property called ok if the fetch is successful, so if response.ok is not present an exception is thrown (below) 
        throw new Error('Failed to add comment');
    }
    return response.json(); // .json() is a request method that returns a javascript object from the JSON string value that this 'response' variable was holding
};

const CommentForm = () => {
    const queryClient = useQueryClient(); // provide access to the query cache, will use this to invalidate cached data
    const [formError, setFormError] = useState(null); // controls the visibility of the form error
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // // controls the visibility of the success message

    // defining the value of an object with 2 inputs used to manage asynchronous actions (useMutation)
    // (1) mutate - a function to trigger mutation
    // (2) isLoading - indicates if the mutation is in progress
    const { mutate, isLoading } = useMutation({ // useMutation returns an object with methods and state to manage mutations
        mutationFn: postComment, // defines what function to call when nutation is triggered, in this case postComment
        onSuccess: () => { // onSuccess is a callback that executes if the mutation is successful. It runs the below arrow function
            setShowSuccessAlert(true); // makes the success message visible
            queryClient.invalidateQueries(['comments']); // lets the cached queries know that they are outdated
            setTimeout(() => setShowSuccessAlert(false), 5000); // runs a callback that turns off the success message after 5 seconds
        },
        onError: (error) => { // onError is a callback function that executes if the postComment throws an error, it uses the error as an input
            setFormError(error.message); // it changes the value of formError from null to the value of the error's message
        },
    });

    // defining arrow function that takes an event as it's input and handles a user submit action
    const handleSubmit = (event) => {
        event.preventDefault(); // prevents the default process from occuring which would refresh the tab and lose all data
        setFormError(null); // resets the formError as null before executing the rest of the submission handler

        const formData = new FormData(event.target); // define/create variable containing a set of key value pairs based on the form inputs and the values submitted.
        const comment = { // create/define comment object by extracting specific values by using the keys from the new formData object
            body: formData.get('body'), // sets the post object's 'body' value to the value at formData's 'body' key location
            postId: formData.get('postId'), // sets the post object's 'postId' value to the value at formData's 'postId' key location
        };
        if ( !comment.body || !comment.postId) { // triggers conditionally if the submitted form is missing required fields
            setFormError('All fields are required.'); // changes the value of formError from null to the value of the enclosed message
            return; // returns emptyhanded if this conditional is true
        }
        mutate(comment); // runs the mutate function - passing in the newly harvested comment variable, thereby triggering useMutation which sends post to postComment which submits the post request to the API
        event.target.reset(); // resets the form fields
    };

    return ( // renders all enclosed as the HTML manifestation of the component's logic
        <div>
            {/* conditionally renders Alert element if formError is not null */}
            {formError && (
                <Alert variant="danger" aria-live="polite">
                    {formError}
                </Alert>
            )} 
            {/* conditionally renders Alert element if the success alert is true */}
            {showSuccessAlert && (
                <Alert variant="success" aria-live="polite">
                    Comment successfully posted!
                </Alert>
            )}
            <Col md={{ span: 6, offset: 3 }}> {/* creates a responsive column element */}
                <Form onSubmit={handleSubmit} noValidate>
                {/* creates a form element containing 2 form groups and a button - with an onSubmit event listener that triggers handleSubmit */}
                    <Form.Group className="mb-3" controlId="postId">                     
                    {/* creates a form group element allowing input for a required field named 'postId' */}
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
                    {/* creates a form group element allowing textarea input for a required field named 'body' */}
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
                    {/* creates a button element for users to submit the form. The button is disabled while the mutation is loading. Preventing resubmissions and other interferences */}
                        {isLoading ? 'Submitting...' : 'Submit Comment'}
                        {/* conditionally if isLoading is true, the button reads 'Posting...' otherwise it reads 'Submit Post' */}
                    </Button>
                </Form>
            </Col>
        </div>
    );
};

export default CommentForm; // exports CommentForm to use in other parts of the component