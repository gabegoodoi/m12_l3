import { Card, Row, Col, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';

const fetchPosts = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    return response.json();
};

const PostsList = () => {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { t } = useTranslation();

    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        retry: 3,
        retryDelay: attemptIndex => Math.min(100 * 2 ** attemptIndex, 30000),
        staleTime: 5 * 60 * 1000,
        cacheTime: 15 * 60 * 1000,
    });

    const filteredPosts = useMemo(() => {
        return posts?.filter(post => selectedUserId === null || post.userId === selectedUserId) || [];
    }, [posts, selectedUserId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userIdInput = e.target.userId.value;
        setSelectedUserId(userIdInput ? parseInt(userIdInput, 10) : null);
    };

    if (isLoading) return <Spinner animation="border" role="status"><span className="visually-hidden">{t('loading')}</span></Spinner>;
    if (error) return <Alert variant="danger">{error.message}</Alert>;

    return (
        <div role="main" aria-labelledby="post-list-title">
            <h2 id="post-list-title">{t('postListsTitle')}</h2>
            
            <Form onSubmit={handleSubmit} role="search">
                <Form.Group className="mb-3" controlId="userId">
                    <Form.Label>{t('filterByIdTitle')}</Form.Label>
                    <Form.Control 
                        type="number" 
                        name="userId" 
                        placeholder={t('enterUserId')}
                        aria-label={t('enterUserId')}
                        value={selectedUserId || ''} 
                        onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value, 10) : null)}
                    />
                </Form.Group>  
                <Button type="submit" variant="primary" aria-label={t('filterPosts')}>{t('filterPosts')}</Button>
            </Form>

            <Row xs={1} md={4} className="g-4" role="list">
                {filteredPosts.map(post => (
                    <Col key={post.id} role="listitem">
                        <Card style={{ width: '18rem' }} aria-labelledby={`post-title-${post.id}`}>
                            <Card.Body>
                                <Card.Title id={`post-title-${post.id}`} className="fs-3">
                                    {post.id}. {post.title}
                                    <p className="fs-6 mt-1">{t('by')} <br /> <i>{t('user')} #{post.userId}</i></p>
                                </Card.Title>
                                <Card.Text>Post: {post.body}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PostsList;