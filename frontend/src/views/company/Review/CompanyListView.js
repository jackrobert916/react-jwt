import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import {
  Avatar,
  Box,
  Card,
  Container,
  Link,
  makeStyles,
  Grid,
  Typography
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Page from 'src/components/Page';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useSelector } from 'react-redux';

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

function CompanyListView({ className, companies, ...rest }) {
  const classes = useStyles();
  const { reviews } = useSelector(state => state.review);

  if (!companies) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Company Review"
    >
      <Container maxWidth={false}>
        {companies && companies.map(company => {
          let total = 0.0;
          let rev = reviews.filter(item => item.company == company.name);
          rev.map(item => total += parseFloat(item.rate));
          const rateResult = rev.length > 0 ? parseInt(total / rev.length * 10) / 10 : 0;
          return (
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
                        src={company.logo}
                      />
                      <div>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={`/app/company/review/${company.id}`}
                          variant="h6"
                        >
                          {company.name}
                        </Link>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                        >
                          {company.email}
                        </Typography>
                      </div>
                    </Box>
                    <Box mt={2}>
                      <Typography
                        variant="h5"
                        color="textPrimary"
                      >
                        {company.description}
                      </Typography>
                    </Box>
                    <Box mt={1} style={{display: 'flex'}}>
                    <Rating
                      name="half-rating-read"
                      value={rateResult}
                      precision={0.1}
                      emptyIcon={<StarBorderIcon fontSize="inherit" />}
                      readOnly
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      {rateResult == 0 ? '' : rateResult}
                    </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Box>
          )
        })}
      </Container>
    </Page>
  );
}

CompanyListView.propTypes = {
  className: PropTypes.string
};

export default CompanyListView;
