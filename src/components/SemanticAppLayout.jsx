import { Container, Navbar, Nav } from 'react-bootstrap';
import {BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import '../AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import './i18n';
import PostsList from './PostsList';
import AddPost from './AddPost';
import UpdatePost from './UpdatePost';
import DeletePost from './DeletePost';
import CommentForm from './CommentForm';




const queryClient = new QueryClient();


const SemanticAppLayout = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    return (
        <QueryClientProvider client={queryClient}>

             <Navbar bg="light" expand="lg" as="header" role="navigation">
                <Navbar.Brand href="#home">React Fake Posts CRUD </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto" as="nav" role="menubar">
                        <Nav.Link href="/home" role="menuitem">{t('home')}</Nav.Link>
                        <Nav.Link href="/add-post" role="menuitem">{t('addPost')}</Nav.Link>
                        <Nav.Link href="/update-post" role="menuitem">{t('updatePost')}</Nav.Link>
                        <Nav.Link href="/delete-post" role="menuitem">{t('deletePost')}</Nav.Link>
                        <Nav.Link href="/comment" role="menuitem">{t('comment')}</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto" as="nav" role="menubar">
                        <Nav.Link onClick={() => changeLanguage('en')}>English</Nav.Link>
                        <Nav.Link onClick={() => changeLanguage('fr')}>Français</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Router>
                <Routes>
                    <Route path="/" element={<PostsList />} />
                    <Route path="/home" element={<PostsList />} />
                    <Route path="/add-post" element={<AddPost />} />
                    <Route path="/update-post" element={<UpdatePost />} />
                    <Route path="/delete-post" element={<DeletePost />} />
                    <Route path="/comment" element={<CommentForm />} />

                 </Routes>
            </Router>

            <Container as="footer" className="text-center">
                © 2023 Accessible Web Inc.
            </Container>

        </QueryClientProvider>
    );
};

export default SemanticAppLayout;



