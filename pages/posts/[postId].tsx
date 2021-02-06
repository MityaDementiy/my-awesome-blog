import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Row, Col, Nav, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const BlogPost = ({ post }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <div className="container p-3">
        <Nav className="mb-3">
          <Row>
            <Col>
              <Nav.Item>
                <Link href={'/'}>Home</Link>
              </Nav.Item>
            </Col>
          </Row>
        </Nav>
        <h1 className="mb-3">{post.title}</h1>
        <p>{post.body}</p>
      </div>
    </>
  );
};

BlogPost.getInitialProps = async (ctx) => {
  const postUrl = `http://localhost:5000/posts/${ctx.query.postId}`;
  const response = await axios.get(postUrl);
  const post = await response.data;
  return { post };
};

export default BlogPost;
