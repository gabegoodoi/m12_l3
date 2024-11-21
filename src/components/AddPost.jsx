// import React to use for the React memo function in AddPost, and also allows jsx syntax + components
// import the useState hook to manage the state of the success alert
import React, { useState } from 'react';

// import special React Bootstrap HTML elements to use in this component's return
import { Form, Button, Alert, Col } from 'react-bootstrap';

// import React Query hooks used to 1. manage asynchronous actions, that's useMutation and 2. allow interaction with the query cache, that's useQueryClient
import { useMutation, useQueryClient } from '@tanstack/react-query';

// function to post data to the API
// postPost's value is being declared here as a Promise (the async/await syntax is used to handle this promise).
const postPost = async (post) => { // arrow function that takes post object as input and runs a function sending it to an API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', { 
    // within the postPost promise above, 'response' is a variable that's value is equal to the return value of the fetch function.
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
    });
    // the fetch function above sends a request to the provided url. The method, headers, and body are asecondary input that determine the request type, the content type (JSON), and convert the post object from postPost into a JSON string.
    if (!response.ok) { // fetch returns the response with a property called ok if the fetch is successful, so if response.ok is not present or not true an exception is thrown (below)
        throw new Error('Failed to add new post');
    }
    return response.json(); // .json() is a request method that returns a javascript object from the JSON string value that this 'response' variable was holding
};

// AddPost component, wrapped with React.memo to skip re-renders if the props and state are unchanged
const AddPost = React.memo(() => {
    const queryClient = useQueryClient(); // provide access to the query cache, will use this to invalidate cached data
    const [showSuccessAlert, setShowSuccessAlert] = useState(false); // controls the visibility of the success message

    // defining the value of an object with 4 inputs used to manage asynchronous actions (useMutation)
    // (1) mutate - a function to trigger mutation
    // (2) isLoading - indicates if the mutation is in progress
    // (3) isError - boolian variable from status that reads true if error is not null
    // (4) error - the full error object for the mutation if the mutation fails
    const { mutate, isLoading, isError, error } = useMutation({ // useMutation returns an object with methods and state to manage mutations
        mutationFn: postPost, // when useMutation is triggered specifies to run the postPost function, which, if successful, will return the response as a JS object
        onSuccess: (data) => { // onSuccess is a callback that executes if the mutation is successful. It runs the below arrow function
            setShowSuccessAlert(true); // shows the success message by setting its value to true
            console.log('Post added with ID:', data.id); // updates console log with the id prop of the new post
            queryClient.invalidateQueries(['posts']); // updates the query cache informing them that an update has occurred and the cached info is no longer valid
            setTimeout(() => setShowSuccessAlert(false), 5000); // runs a callback that turns off the success message after 5 seconds
        },
    });

    // defining arrow function that takes an event as it's input and handles a user submit action
    const handleSubmit = (event) => {
        event.preventDefault(); // prevents the default process from occuring which would refresh the tab and lose all data
        const formData = new FormData(event.target); // define/create variable containing a set of key value pairs based on the form inputs and the values submitted.
        const post = { // create/define post object by extracting specific values by using the keys from the new formData object
            title: formData.get('title'), // sets the post object's 'title' value to the value at formData's 'title' key location
            body: formData.get('body'), // sets the post object's 'body' value to the value at formData's 'body' key location
            userId: formData.get('userId'), // sets the post object's 'userId' value to the value at formData's 'userId' key location
        };
        mutate(post); // runs the mutate function - passing in the newly harvested post variable, thereby triggering useMutation which sends post to postPost which submits the post request to the API
        event.target.reset(); // resets the form fields after the submission is complete
    };

    return ( // renders all enclosed as the HTML manifestation of the component's logic
        <div>
            {isError && <Alert variant="danger">An error occurred: {error.message}</Alert>} 
            {/* conditionally renders Alert element if there's an error in the AddPost */}
            {showSuccessAlert && <Alert variant="success">Post successfully added!</Alert>} 
            {/* conditionally renders Alert element if post request is successful for AddPost */}
            <Col md={{ span: 6, offset: 3 }}> {/* creates a responsive column element */}
                <Form onSubmit={handleSubmit}> 
                {/* creates a form element containing 3 form groups and a button - with an onSubmit event listener that triggers handleSubmit */}
                    <Form.Group className="mb-3" controlId="title">
                    {/* creates a form group element allowing input for a required field named 'title' */}
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" placeholder="Enter title" required />
                    </Form.Group>   
                    <Form.Group className="mb-3" controlId="userId">
                    {/* creates a form group element allowing input for a required field named 'userId' */}
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" name="userId" placeholder="Enter User ID" min="1" step="any" required /> 
                        {/* ensures input is a number & > 0 */}
                    </Form.Group>  
                    <Form.Group className="mb-3" controlId="body"> 
                    {/* creates a form group element allowing input for a required field named 'body' */}
                        <Form.Label>Body</Form.Label>
                        <Form.Control as="textarea" name="body" rows={3} required />
                    </Form.Group>    
                    <Button variant="primary" type="submit" disabled={isLoading}> 
                    {/* creates a button element for users to submit the form. The button is disabled while the mutation is loading. Preventing resubmissions and other interferences */}
                        {isLoading ? 'Posting...' : 'Submit Post'} 
                        {/* conditionally if isLoading is true, the button reads 'Posting...' otherwise it reads 'Submit Post' */}
                    </Button>
                </Form>         
            </Col>
        </div>
    );
});

export default AddPost; // exports AddPost to use in other parts of the component