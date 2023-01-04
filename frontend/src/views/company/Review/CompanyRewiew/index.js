import React, {
  useState,
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Avatar,
  Grid,
  Container,
  makeStyles,
  Typography,
  Button,
  StepButton
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import CompanyReviewListView from './CompanyReviewListView';
import AddReviewDialog from './AddReviewDialog';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { CompanyInfo } from 'src/constants';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  avatar: {
    marginRight:'20px'
  },
  item: {
    padding: theme.spacing(3),
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
  box: {
    textAlign: 'left',
    paddingTop: "2%",
    paddingLeft: '5%'
  },
  rate: {
    paddingTop: '2%'
  },
  addreview: {
    marginTop: '10px',
    float:'right',
    marginBottom: '-12px'
  }
}));

function CustomerEditView() {
  const classes = useStyles();
  const { companyId } = useParams();
  const { user } = useSelector((state) => state.account);
  const { reviews } = useSelector(state => state.review);

  const company = CompanyInfo.filter((item) => item.id == companyId)[0];

  const [isOpened, setOpened] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [rateResult, setRateResult] = useState(0);

  const handleOpen = () => {
    setOpened(true);
  };

  const handleClose = () => {
    setOpened(false);
  };

  useEffect(() => {
    let total = 0.0;
    let rev = reviews.filter(item => item.company == company.name);
    rev.map(item => total += parseFloat(item.rate));
    setRateResult(rev.length > 0 ? parseInt(total / rev.length * 10) / 10 : 0);
    if( user.company.toLowerCase() != company.name.toLowerCase() )
      setDisabled(true);
  }, []);

  if (!company) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Customer Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box>
          <Grid
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
              >
                <Avatar
                  className={classes.avatar}
                  src={company.logo}
                />
                <div>
                  <Typography
                    variant='h3'
                  >
                    {company.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    {company.email}
                  </Typography>
                </div>
              </Box>
              <Box 
                className={classes.box}
              >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    {company.description}
                  </Typography>
                  <Rating
                    className={classes.rate}
                    name="half-rating-read"
                    value={rateResult}
                    precision={0.1}
                    emptyIcon={<StarBorderIcon fontSize="inherit" />}
                    readOnly
                  />
              </Box>
              <Button
                className={classes.addreview}
                mt={2}
                color="secondary"
                type="button"
                variant="contained"
                onClick={() => handleOpen() }
                disabled={isDisabled}
              >
                Add a review
              </Button>
              <AddReviewDialog
                open={isOpened}
                onClose={handleClose}
              />
            </Grid>
          </Grid>
        </Box>
        <Box>
          <CompanyReviewListView company={company} />
        </Box>
      </Container>
    </Page>
  );
}

export default CustomerEditView;
