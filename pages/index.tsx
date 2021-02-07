import Link from 'next/link';
import Head from 'next/head';
import { Row, Col, Nav, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BlogPost } from '../interfaces/BlogPost';

interface PostsProps {
  posts: BlogPost[];
}

const App = ({ posts }: PostsProps) => {
  const renderPost = (post) => {
    return (
      <Card key={post.id} className="mb-3 bg-light">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Link href={`/posts/[postId]`} as={`/posts/${post.id}`}>
            Read more
          </Link>
        </Card.Body>
      </Card>
    );
  };

  if (posts.length === 0) {
    return (
      <div className="container p-3">
        <Nav className="mb-3">
          <Row>
            <Col>
              <Nav.Item>
                <Link href={'/posts/new'}>Add post</Link>
              </Nav.Item>
            </Col>
          </Row>
        </Nav>
        <h1 className="mb-3">My blog</h1>
        <p>Houston, we have no posts yet!</p>
        <Link href={'/posts/new'}>Let's create first one</Link>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>My blog</title>
        <meta name="description" content="Cool blog" />
      </Head>
      <div className="container p-3">
        <Nav className="mb-3">
          <Row>
            <Col>
              <Nav.Item>
                <Link href={'/posts/new'}>Add post</Link>
              </Nav.Item>
            </Col>
          </Row>
        </Nav>
        <h1 className="mb-3">My blog</h1>
        {posts.map(renderPost)}
      </div>
    </>
  );
};

App.getInitialProps = async () => {
  const postsUrl = 'http://localhost:5000/posts';
  const response = await axios.get(postsUrl);
  const posts: BlogPost[] = await response.data;
  return { posts };
};

export default App;
