import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const posts = await response.json();
    return posts;
};

const PostsList = () => {

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'], // take 'posts' data returned by queryFn and save it here. CACHING it. By caching data we don't have to make the same api call multiple times quickly. Can set cache out time so data doesn't get outdated
        queryFn: fetchPosts, // queryFn is function we're writing to fetch 'posts'
        refetchOnReconnect: true, // automatically refetch products when the network reconnects
        refetchOnWindowFocus: true, // auto refetch products when the window is refocused
        retry: 3, // retry failed queries up to 3 times
        retryDelay: attemptIndex => Math.min(100 * 2 ** attemptIndex, 30000), // exponential backoff strategy
        staleTime: 5 * 60 * 100, // data is fresh for 5 minutes
        cacheTime: 15 * 60 * 1000 // data is cached for 15 minutes after query becomes inactive. Stale data is served if network is not connected.
    });

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">...Loading</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <div>
            <h2>Posts List</h2>
            <Row xs={1} md={4} className="g-4">
                {posts.map(post => (
                    <Col key={post.id}>
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title className="fs-3">{post.id}. {post.title} <p className="fs-6 mt-1 ">By<br></br> <i>User #{post.userId}</i></p></Card.Title>
                                <Card.Text>Post: ${post.body}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};


export default PostsList;