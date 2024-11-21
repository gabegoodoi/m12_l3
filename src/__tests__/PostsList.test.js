import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostsList from '../components/PostsList';

// Mocking i18next and its methods
jest.mock('i18next', () => ({
    use: jest.fn().mockReturnThis(),  // Mock the use method to return i18next itself
    init: jest.fn(),  // Mock the init method
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Return the key itself for tests
    }),
}));

describe('PostsList Component', () => {
    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([
                    { id: 1, userId: 1, title: 'Post 1', body: 'This is the first post' },
                    { id: 2, userId: 2, title: 'Post 2', body: 'This is the second post' },
                ]),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and renders all posts on mount', async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <PostsList />
            </QueryClientProvider>
        );

        // Ensure the spinner is rendered initially
        expect(screen.getByRole('status')).toBeInTheDocument();

        // Wait for posts to appear
        await waitFor(() => {
            const listItems = screen.getAllByRole('listitem');
            expect(listItems).toHaveLength(2);
        });

        expect(screen.getByText(/Post 1/i)).toBeInTheDocument();
        expect(screen.getByText(/This is the first post/i)).toBeInTheDocument();
        expect(screen.getByText(/Post 2/i)).toBeInTheDocument();
        expect(screen.getByText(/This is the second post/i)).toBeInTheDocument();
    });

    it('shows an error message if fetch fails', async () => {
        global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

        render(
            <QueryClientProvider client={queryClient}>
                <PostsList />
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        expect(screen.getByText(/Failed to fetch posts/i)).toBeInTheDocument();
    });
});