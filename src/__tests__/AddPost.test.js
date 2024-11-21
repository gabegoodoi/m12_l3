// import render to render react components for testing 
// import screen to query DOM elements rendered by render
// import fireEvent to simulate user triggered events
// import waitFor to listen for asynchronous changes/conditions to the DOM
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import react in order to use jsx syntax and make components
import React from 'react';
// import AddPost to test the component's render
import AddPost from '../components/AddPost';

// import QueryClientProvider to provide the query client to the components
// import QueryClient to manage query states
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the global fetch function for all tests
global.fetch = jest.fn();

// describe groups tests for AddPost ???
// it takes 2 inputs, a string 'AddPost Component' and an arrow function that holds all the tests
describe('AddPost Component', () => {
    let queryClient; // initializes a placeholder variable for React's query client

    // beforeEach is an arrow function that runs before each test, it reinstantiates queryClient as a new QueryClient object with retrying the query set to false (disabling that ability)
    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
    });

    // afterEach is an arrow function that runs after every test. Clearing the mocks to make sure there are no leftover states.
    afterEach(() => {
        jest.clearAllMocks();
    });

    // it defines a successful test case. It's a function that takes a string, and a promise (the async/await syntax is used to handle this promise).
    it('submits the form and shows success alert when a post is added successfully', async () => {
        // fetch.mockResolvedValueOnce mocks the fetch response to simulate a successful post submission with OK being true and a json with 4 properties defined using Promise.resolve.
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                id: 3,
                title: 'New Post',
                body: 'This is a really new post',
                userId: 1,
            }),
        });

        render( // render's AddPost wrapped in QueryClientProvider (as it would be in the SemanticAppLayout)
            <QueryClientProvider client={queryClient}> {/* sets the client to queryClient */}
                <AddPost />
            </QueryClientProvider>
        );

        // Simulate filling in the form fields 
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'New Post' },
        });
        fireEvent.change(screen.getByLabelText(/User ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Body/i), {
            target: { value: 'This is a really new post' },
        });

        // Simulate submitting the form by clicking the Submit Post button
        fireEvent.click(screen.getByText(/Submit Post/i));

        // Wait for success alert to be visible
        await waitFor(() => screen.getByText(/Post successfully added!/i));

        // Check if success message is shown
        expect(screen.getByText(/Post successfully added!/i)).toBeInTheDocument();

        // Makes sure that fetch was called with right URL + method, headers, & body
        expect(fetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts', 
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'New Post',
                    body: 'This is a really new post',
                    userId: '1',
                }),
            })
        );
    });

    // it defines an unsuccessful test case. It's a function that takes a string, and a promise (the async/await syntax is used to handle this promise).
    it('shows error message when the API call fails', async () => {
        // fetch.mockResolvedValueOnce mocks a fetch response to simulate an error 
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Error occurred' }),
        });

        render(
            <QueryClientProvider client={queryClient}>
                <AddPost />
            </QueryClientProvider>
        );

        // Simulate filling in the form fields 
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'New Post' },
        });
        fireEvent.change(screen.getByLabelText(/User ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Body/i), {
            target: { value: 'This is a really new post' },
        });

        // Simulate submitting the form by clicking the Submit Post button
        fireEvent.click(screen.getByText(/Submit Post/i));

        // Wait for error message to be visible
        await waitFor(() => screen.getByText(/An error occurred: Failed to add new post/i));

        // Check if error message is shown
        expect(screen.getByText(/An error occurred: Failed to add new post/i)).toBeInTheDocument();

        // Makes sure that fetch was called with right URL + method, headers, & body
        expect(fetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts', 
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'New Post',
                    body: 'This is a really new post',
                    userId: '1',
                }),
            })
        );
    });
});
