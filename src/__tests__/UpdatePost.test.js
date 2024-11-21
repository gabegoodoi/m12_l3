import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import UpdatePost from '../components/UpdatePost';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

global.fetch = jest.fn();

describe('UpdatePost Component', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('submits the form and shows success alert when post is updated successfully', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({
                id: 1,
                title: 'Updated Title',
                body: 'Updated Body',
                userId: 1,
            }),
        });

        render(
            <QueryClientProvider client={queryClient}>
                <UpdatePost />
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByLabelText(/Post ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'Updated Title' },
        });
        fireEvent.change(screen.getByLabelText(/User ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Body/i), {
            target: { value: 'Updated Body' },
        });

        fireEvent.click(screen.getByText(/Update Post/i));

        await waitFor(() => screen.getByText(/Post successfully updated!/i));

        expect(screen.getByText(/Post successfully updated!/i)).toBeInTheDocument();

        expect(fetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts/1',
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Updated Title',
                    body: 'Updated Body',
                    userId: '1',
                }),
            })
        );
    });

    it('shows error message when the API call fails', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Error occurred' }),
        });

        render(
            <QueryClientProvider client={queryClient}>
                <UpdatePost />
            </QueryClientProvider>
        );

        fireEvent.change(screen.getByLabelText(/Post ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'Updated Title' },
        });
        fireEvent.change(screen.getByLabelText(/User ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Body/i), {
            target: { value: 'Updated Body' },
        });

        fireEvent.click(screen.getByText(/Update Post/i));

        await waitFor(() => screen.getByText(/An error occurred: Failed to update post/i));

        expect(screen.getByText(/An error occurred: Failed to update post/i)).toBeInTheDocument();

        expect(fetch).toHaveBeenCalledWith(
            'https://jsonplaceholder.typicode.com/posts/1',
            expect.objectContaining({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'Updated Title',
                    body: 'Updated Body',
                    userId: '1',
                }),
            })
        );
    });

    it('does not submit the form if postId is missing', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <UpdatePost />
            </QueryClientProvider>
        );

        // Leave postId empty and submit the form
        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: 'Updated Title' },
        });
        fireEvent.change(screen.getByLabelText(/User ID/i), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByLabelText(/Body/i), {
            target: { value: 'Updated Body' },
        });

        // Try to submit the form
        fireEvent.click(screen.getByText(/Update Post/i));

        // Expect no request to be made
        expect(fetch).not.toHaveBeenCalled();
    });
});
