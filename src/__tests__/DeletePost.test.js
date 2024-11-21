import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DeletePost from '../components/DeletePost';

// Mock the global fetch function
global.fetch = jest.fn();

describe('DeletePost Component', () => {
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

  it('submits the form and shows success alert when a post is deleted successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ id: 3 }),
    });

    render(
      <QueryClientProvider client={queryClient}>
        <DeletePost />
      </QueryClientProvider>
    );

    // Simulate entering Post ID
    fireEvent.change(screen.getByLabelText(/Post ID/i), { target: { value: '3' } });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Delete Post/i));

    // Wait for success alert
    await waitFor(() => screen.getByText(/Post successfully deleted!/i));

    expect(screen.getByText(/Post successfully deleted!/i)).toBeInTheDocument();

    // Check fetch call
    expect(fetch).toHaveBeenCalledWith(
      `https://jsonplaceholder.typicode.com/posts/3`,
      expect.objectContaining({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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
        <DeletePost />
      </QueryClientProvider>
    );

    // Simulate entering Post ID
    fireEvent.change(screen.getByLabelText(/Post ID/i), { target: { value: '1' } });

    // Simulate form submission
    fireEvent.click(screen.getByText(/Delete Post/i));

    // Wait for error alert
    await waitFor(() => screen.getByText(/Failed to delete post/i));

    expect(screen.getByText(/Failed to delete post/i)).toBeInTheDocument();

    // Ensure fetch was called with the right arguments
    expect(fetch).toHaveBeenCalledWith(
      `https://jsonplaceholder.typicode.com/posts/1`,
      expect.objectContaining({
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
});