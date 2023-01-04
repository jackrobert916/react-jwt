import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Avatar,
  Box,
  Card,
  Container,
  Link,
  TablePagination,
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Page from 'src/components/Page';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import { SET_REVIEWS } from 'src/actions/reviewActions';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
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

function applySort(reviews, sort) {
  const [orderBy, order] = sort.split('|');
  const comparator = getComparator(order, orderBy);
  const stabilizedThis = reviews.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    // eslint-disable-next-line no-shadow
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function applyPagination(reviews, page, limit) {
  return reviews.slice(page * limit, page * limit + limit);
}

function CompanyReviewListView({ className, company, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { reviews } = useSelector(state => state.review);

  const getReviews = () => {
    axios
      .get(`${API_BASE_URL}/company/review`)
      .then((response) => {
        dispatch({
          type: SET_REVIEWS,
          payload: {
            reviews: response.data.review,
          }
        });
      });
  };

  useEffect(() => {
    getReviews();
  }, []);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  if (!reviews) {
    return null;
  }

  const filteredReviews = reviews.filter(item => item.company == company.name)
  const sortedReviews = applySort(filteredReviews, 'updatedAt|desc');
  const paginatedReviews = applyPagination(sortedReviews, page, limit);

  return (
    <Page
      className={classes.root}
      title="Company Review"
    >
      <Container maxWidth={false}>
        {paginatedReviews && paginatedReviews.map(review => (
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
                      src={review.avatar}
                    />
                    <div>
                      <Link
                        color="inherit"
                        variant="h6"
                      >
                        {review.name == '' ? 'Anonymous' : review.name}
                      </Link>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                        {review.email}
                      </Typography>
                    </div>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      variant="h5"
                      color="textPrimary"
                    >
                      {review.content}
                    </Typography>
                  </Box>
                  <Box mt={1}>
                  <Rating
                    name="half-rating-read"
                    value={review.rate}
                    precision={0.1}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    readOnly
                  />
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        ))}
        {paginatedReviews ? (
          <TablePagination
            component="div"
            count={sortedReviews.length}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 25]}
          />
        ):(
          <></>
        )}
      </Container>
    </Page>
  );
}

CompanyReviewListView.propTypes = {
  className: PropTypes.string
};

export default CompanyReviewListView;
