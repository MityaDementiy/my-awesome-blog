import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import { Row, Col, Nav, Card, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

import { validateComment } from '../../validator';
import { BlogComment } from '../../interfaces/BlogComment';

interface CommentsProps {
  comments: BlogComment[];
}

const BlogPost = ({ post }) => {
  const commentsUrl = 'http://localhost:5000/comments';
  const getNextId = () => Number(_.random(1, 1000000000));
  const postId = post.id;
  const [comments, setComments] = useState([]);
  const [isCommentSend, setCommentSend] = useState(false);

  useEffect(() => {
    axios
      .get(commentsUrl)
      .then((response) => {
        setCommentSend(false);
        const rawComments = response.data;
        const postComments: CommentsProps[] = rawComments.filter((comment) => comment.postId === postId);
        setComments(postComments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isCommentSend]);

  const formik = useFormik({
    initialValues: {
      id: 0,
      postId,
      author: '',
      body: '',
    },
    validationSchema: validateComment,
    validateOnChange: false,
    onSubmit: async (values, { setStatus }) => {
      const newComment = {
        id: getNextId(),
        postId,
        author: values.author,
        body: values.body,
      };
      try {
        await axios.post(commentsUrl, newComment);
        formik.resetForm();
        setCommentSend(true);
      } catch (error) {
        setStatus(error.message);
      }
    },
  });

  const renderComment = (comment) => {
    return (
      <Card border="light" style={{ width: '36rem' }} className="mb-3" key={comment.id}>
        <Card.Body>
          <Card.Text>
            {comment.author}: {comment.body}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

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
        <main className="mb-3">
          <h1 className="mb-3">{post.title}</h1>
          <p>{post.body}</p>
        </main>
        <h2 className="h5 mb-1">Comments:</h2>
        {comments && comments.map(renderComment)}
        <h2 className="h5 mb-1">Add comment:</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group form-row">
            <input
              type="text"
              id="author"
              className="form-control form-control-sm"
              placeholder="Type your name"
              onChange={formik.handleChange}
              value={formik.values.author}
            />
            {formik.touched && formik.errors.author && (
              <div className="alert alert-danger mt-3" role="alert">
                {formik.errors.author}
              </div>
            )}
          </div>
          <div className="form-group form-row">
            <textarea
              id="body"
              className="form-control form-control-sm"
              placeholder="Write your comment"
              onChange={formik.handleChange}
              value={formik.values.body}
            />
            {formik.touched && formik.errors.body && (
              <div className="alert alert-danger mt-3" role="alert">
                {formik.errors.body}
              </div>
            )}
            {formik.status && (
              <div className="alert alert-danger mt-3" role="alert">
                {formik.status}
              </div>
            )}
          </div>
          <Button variant="primary" type="submit" disabled={formik.isSubmitting || !formik.dirty}>
            Send comment
          </Button>
        </form>
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
