import React, {useState} from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    Dialog,
    Divider,
    Grid,
    TextField,
    Typography,
    makeStyles,
} from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from 'src/config';
import { CompanyInfo } from 'src/constants';
import { SET_REVIEWS } from 'src/actions/reviewActions';


const useStyles = makeStyles((theme) => ({
    root: {
        
    },
}));

function AddReviewDialog({
    className,
    onClose,
    open,
    ...rest
}) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { companyId } = useParams();
    const { user } = useSelector((state) => state.account);

    const company = CompanyInfo.filter(item => item.id == companyId)[0];

    return (
        <Dialog
            className={classes.root}
            onClose={onClose}
            open={open}
            maxWidth="md"
            fullWidth
            {...rest}
        >
            <Formik
                initialValues={{
                    content: '',
                    rate01: 0,
                    rate02: 0,
                    rate03: 0,
                    rate04: 0,
                    isAnony: false
                }}
                validationSchema={Yup.object().shape({
                    content: Yup.string().max(255),
                    rate01: Yup.number(),
                    rate02: Yup.number(),
                    rate03: Yup.number(),
                    rate04: Yup.number(),
                    isAnony: Yup.bool()
                })}
                onSubmit={async (values, {
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    try {
                        const rateValue = parseFloat((values.rate01 + values.rate02 + values.rate03 + values.rate04) / 4);

                        const data = {
                            name: values.isAnony ? '' : user.name,
                            email: values.isAnony ? '' : user.email,
                            content: values.content,
                            rate: rateValue,
                            company: company.name
                        };
                        
                        await axios.post(`${API_BASE_URL}/company/review/create`, data);

                        setStatus({ success: true });
                        setSubmitting(false);
                        enqueueSnackbar('New review created', {
                            variant: 'success',
                            action: <Button>See all</Button>
                        });
                        onClose();

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

                    } catch (error) {
                        setStatus({ success: false });
                        setErrors({ submit: error.message });
                        setSubmitting(false);
                        enqueueSnackbar('Failed review', {
                            variant: 'error',
                            action: <Button>See all</Button>
                        });
                        onClose();
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
                    values,
                    setFieldValue
                }) => (
                <form onSubmit={handleSubmit}>
                    <Card
                        className={clsx(classes.root, className)}
                        {...rest}
                    >
                        <CardHeader title="New Review for Company" />
                        <Divider />
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
                                <Grid
                                item
                                md={12}
                                xs={12}
                                >
                                    <TextField
                                        multiline
                                        rows={7}
                                        error={Boolean(touched.content && errors.content)}
                                        fullWidth
                                        helperText={touched.content && errors.content}
                                        label="Type review"
                                        name="content"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        required
                                        value={values.content}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    container
                                    justify='flex-end'
                                >
                                    <Typography
                                        style={{marginRight: '20px'}}
                                        variant="h5"
                                        color="textPrimary"
                                    >
                                        Company culture
                                    </Typography>
                                    <Rating
                                        name="rate01"
                                        value={values.rate01}
                                        onChange={(event, newValue) => {
                                            setFieldValue('rate01', newValue);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    container
                                    justify='flex-end'
                                >
                                    <Typography
                                        style={{marginRight: '20px'}}
                                        variant="h5"
                                        color="textPrimary"
                                    >
                                        Compensation & Benifits
                                    </Typography>
                                    <Rating
                                        name="rate02"
                                        value={values.rate02}
                                        onChange={(event, newValue) => {
                                            setFieldValue('rate02', newValue);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    container
                                    justify='flex-end'
                                >
                                    <Typography
                                        style={{marginRight: '20px'}}
                                        variant="h5"
                                        color="textPrimary"
                                    >
                                        Career oppertunities
                                    </Typography>
                                    <Rating
                                        name="rate03"
                                        value={values.rate03}
                                        onChange={(event, newValue) => {
                                            setFieldValue('rate03', newValue);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    container
                                    justify='flex-end'
                                >
                                    <Typography
                                        style={{marginRight: '20px'}}
                                        variant="h5"
                                        color="textPrimary"
                                    >
                                        Work/Life balance
                                    </Typography>
                                    <Rating
                                        name="rate04"
                                        value={values.rate04}
                                        onChange={(event, newValue) => {
                                            setFieldValue('rate04', newValue);
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={12}
                                    xs={12}
                                    container
                                    justify='flex-end'
                                    alignItems='center'
                                >
                                    <Checkbox
                                        style={{marginRight: '10px'}}
                                        checked={values.isAnony}
                                        name="anonymous"
                                        onChange={(event, val) =>
                                            setFieldValue('isAnony', val)
                                        }
                                    />
                                    <Typography
                                        variant="h5"
                                        color="textPrimary"
                                    >
                                        Anonymously Mode
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box mt={2} style={{display: 'flex', justifyContent: 'center'}}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    Complete
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </form>
                )}
            </Formik>
        </Dialog>
    )
}

AddReviewDialog.propTypes = {
    className: PropTypes.string,
    onClose: PropTypes.func,
    open: PropTypes.bool
};

AddReviewDialog.defaultProps = {
    open: false,
    onClose: () => { }
};

export default AddReviewDialog;