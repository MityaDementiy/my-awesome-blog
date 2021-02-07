import * as Yup from 'yup';

export const validatePost = Yup.object().shape({
  title: Yup.string().min(1).max(15).required(),
  body: Yup.string().min(3).required(),
});

export const validateComment = Yup.object().shape({
  author: Yup.string().min(1).max(10).required(),
  body: Yup.string().min(3).required(),
});
