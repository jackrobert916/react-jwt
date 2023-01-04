import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Grid, makeStyles, Container} from '@material-ui/core';
import ProfileDetails from './ProfileDetails';
import Page from 'src/components/Page';
import Header from './Header';
import CompanyListView from './CompanyListView';
import { CompanyInfo } from 'src/constants';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import { SET_REVIEWS } from 'src/actions/reviewActions';

const useStyles = makeStyles(() => ({
  root: {
    marginTop:24
  }
}));

function General({ className, ...rest }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);

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
  }

  useEffect (() => {
    getReviews();
  }, [])

  return (
    <Page
    className={classes.root}
    title="Company"
  >
      <Container maxWidth="xl">
        <Header />
        <Grid
          container
          spacing={3}
          {...rest}
        >
          <Grid
            item
            lg={8}
            md={6}
            xl={9}
            xs={12}
          >
            <CompanyListView companies={CompanyInfo} />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <ProfileDetails user={user} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

General.propTypes = {
  className: PropTypes.string
};

export default General;
