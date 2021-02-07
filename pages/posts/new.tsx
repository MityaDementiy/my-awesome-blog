import Head from 'next/head';
import { Row, Col, Nav, Button } from 'react-bootstrap';
import Link from 'next/link';
import axios from 'axios';
import { useFormik } from 'formik';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';

import { validatePost } from '../../validator';

const CreatePost = () => {
  const getNextId = () => Number(_.random(1, 1000000000));
  const postsUrl = 'http://localhost:5000/posts';
  const formik = useFormik({
    initialValues: {
      id: 0,
      title: '',
      body: '',
    },
    validationSchema: validatePost,
    validateOnChange: false,
    onSubmit: async (values, { setStatus }) => {
      const newPost = {
        id: getNextId(),
        title: values.title,
        body: values.body,
      };
      try {
        await axios.post(postsUrl, newPost);
        formik.resetForm();
        window.location.href = `/posts/${newPost.id}`;
      } catch (error) {
        setStatus(error.message);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Create post</title>
        <meta name="description" content="Add new post" />
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
        <h1 className="mb-3">Create post</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group form-row">
            <input
              type="text"
              id="title"
              className="form-control"
              placeholder="Add post title"
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {formik.touched && formik.errors.title && (
              <div className="alert alert-danger mt-3" role="alert">
                {formik.errors.title}
              </div>
            )}
          </div>
          <div className="form-group form-row">
            <textarea
              id="body"
              className="form-control form-control-lg"
              placeholder="Write your post"
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
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;
