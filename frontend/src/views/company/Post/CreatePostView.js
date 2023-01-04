import React, {
  useState,
  useEffect
} from 'react';
import {
  Avatar,
  Box,
  Card,
  Link,
  makeStyles,
  TextField,
  Typography,
  Button
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import { SET_POSTS } from 'src/actions/postActions';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    padding: theme.spacing(2)
  },
  item: {
    padding: theme.spacing(3),
    textAlign: 'start',
    [theme.breakpoints.up('md')]: {
      '&:not(:last-of-type)': {
        borderRight: `1px solid ${theme.palette.divider}`
      }
    },
    [theme.breakpoints.down('sm')]: {
      '&:not(:last-of-type)': {
        borderBottom: `1px solid ${theme.palette.divider}`
      }
    }
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  form: {
    display: 'flex',
    alignItems: 'center',
  },
  submit: {
    marginLeft: '30px'
  },
  submitbox: {
    display: 'flex',
    justifyContent: 'end'
  }
}));

function CreatePostView({ className, user, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box my={2}>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            content: ''
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required('Post content is required'),
          })}
          onSubmit={async (values, {
            setErrors,
            setStatus,
            setSubmitting
          }) => {
            try {
              const response = await axios.post(`${API_BASE_URL}/company/post/create`, values);
              setStatus({ success: response.data.status });
              setSubmitting(false);
              enqueueSnackbar('Create new post', {
                variant: 'success'
              });
              axios
                .get(`${API_BASE_URL}/company/post`)
                .then((response) => {
                  dispatch({
                    type: SET_POSTS,
                    payload: {
                      posts: response.data.post,
                    }
                  });
                });
            } catch (error) {
              const message = (error.response && error.response.data.message) || 'Failed post!';
              setStatus({ success: false });
              setErrors({ submit: message });
              setSubmitting(false);
              enqueueSnackbar(message, {
                variant: 'error'
              });
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form
              // noValidate
              className={clsx(classes.root, className)}
              onSubmit={handleSubmit}
              {...rest}
            >
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                >
                  <Avatar
                    className={classes.avatar}
                    // src={post.avatar}
                    alt={user.name}
                  />
                  <div>
                    <Link
                      color="inherit"
                      variant="h6"
                    >
                      {user.name}
                    </Link>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      {user.email}
                    </Typography>
                  </div>
                </Box>
                <Box className={classes.form}>
                  <TextField
                    error={Boolean(touched.content && errors.content)}
                    fullWidth
                    helperText={touched.content && errors.content}
                    label="Type content..."
                    margin="normal"
                    name="content"
                    value={values.content}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    multiline
                    rows="4"
                    variant="outlined"
                  />
                </Box>
                <Box className={classes.submitbox}>
                  <Button
                    className={classes.submit}
                    disabled={isSubmitting}
                    type="submit"
                    color="secondary"
                    size="large"
                    variant='contained'
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
    </Box>
  );
}

CreatePostView.propTypes = {
  className: PropTypes.string
};

export default CreatePostView;
