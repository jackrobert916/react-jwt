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
  Grid,
  TablePagination,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
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
  textarea: {
    ...theme.typography.body1,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    border: 'none',
    outline: 'none',
    resize: 'none',
    justifyContent: 'center',
    marginTop: '3%',
    padding:'20px 20px',
    marginLeft: '5%',
    width: '80%'
  },
  btn: {
    marginLeft: '3%',
    marginBottom: '8%'
  }
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }

  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySort(posts, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = posts.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line no-shadow
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function applyPagination(posts, page, limit) {
  return posts.slice(page * limit, page * limit + limit);
}

function PostListView({ className, posts, ...rest }) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  if (!posts) {
    return null;
  }

  const sortedPosts = applySort(posts, 'updatedAt|desc');
  const paginatedPosts = applyPagination(sortedPosts, page, limit);

  return (
    <>
      {paginatedPosts && paginatedPosts.map(post => (
        <Box mb={2}>
          <Card
            className={clsx(classes.root1, className)}
            {...rest}
          >
            <Grid
              alignItems="center"
              container
              justify="space-between"
            >
              <Grid
                className={classes.item}
                item
                md={12}
                sm={12}
                xs={12}
              >
                <Box
                  display="flex"
                  alignItems="center"
                >
                  <Avatar
                    className={classes.avatar}
                    src={post.avatar}
                    alt={post.name}
                  />
                  <div>
                    <Link
                      color="inherit"
                      variant="h6"
                    >
                      {post.name}
                    </Link>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      {post.email}
                    </Typography>
                  </div>
                </Box>
                <Box mt={2}>
                  <Typography
                    variant="h5"
                    color="textPrimary"
                  >
                    {post.content}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>
      ))}
      {paginatedPosts ? (
        <TablePagination
          component="div"
          count={posts.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      ):(
        <></>
      )}
    </>
  );
}

PostListView.propTypes = {
  className: PropTypes.string
};

export default PostListView;
