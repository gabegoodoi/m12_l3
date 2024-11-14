import {BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import all of my homemade components
import PostsList from './components/PostsList';
import AddPost from './components/AddPost';
import UpdatePost from './components/UpdatePost';
import DeletePost from './components/DeletePost';


//import styles & bootstrap to make the webpages gorgeous
import './AppStyles.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const queryClient = new QueryClient(); // QueryClient() helps to manage caching

function App() {

  return (
     // provides access to everything that it wraps to react-query functionality
    <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/home" element={<PostsList />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/update-post" element={<UpdatePost />} />
            <Route path="/delete-post" element={<DeletePost />} />
          </Routes>
        </Router>
    </QueryClientProvider>
  )
}

export default App;