import { Formik } from 'formik';
import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import ImageDropzone from './fields/ImageDropzone';
import NameField from './fields/NameField';
import styles from '../styles/Form.module.css';
import { updateProfile } from 'firebase/auth';
import { responseFailure, updateUserAsync } from '../../store/slices/authSlice';
import { toast } from 'react-toastify';

const UpdateProfile = ({ show, setShow, user }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        if (
            user.displayName === values.name &&
            user.imageURL === values.image
        ) {
            handleClose();
            return;
        } else {
            const updatedProfile = Object.assign({}, user);
            updatedProfile.displayName = values.name;
            updatedProfile.imageURL = values.image;
            dispatch(updateUserAsync(user, updatedProfile))
                .then((result) => {
                    if (result.type === responseFailure.type) {
                        toast.error(result.payload);
                    } else {
                        toast.success('Profile updated successfully');
                        handleClose();
                    }
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(
                /^[\w\s'"-]+$/,
                'Name can only contain letters, numbers, underscores, hyphens, single quotes, double quotes and spaces'
            )
            .required('Name is required'),
        image: Yup.mixed().notRequired()
    });

    const initialValues = {
        name: user.displayName ?? '',
        image: user.imageURL
    };

    return (
        <Modal
            contentClassName={styles.formModal}
            // size="lg"
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Update Profile</Modal.Title>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    <MdClose size={24} />
                </Button>
            </Modal.Header>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({
                    handleSubmit,
                    handleChange,
                    touched,
                    values,
                    errors,
                    setFieldValue,
                    isSubmitting
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <NameField
                                label="User Name"
                                placeholder="Enter user Name"
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                            />
                            <ImageDropzone
                                label="Profile Image"
                                values={values}
                                field="image"
                                setFieldValue={setFieldValue}
                            />
                        </Modal.Body>
                        <Modal.Footer
                            className={`${styles.modalFooter} justify-content-center`}>
                            <Button
                                className={styles.formBtn}
                                variant="success"
                                type="submit"
                                onClick={handleSubmit}
                                disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Update'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default UpdateProfile;
