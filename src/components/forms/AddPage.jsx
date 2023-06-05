import React from 'react';
import { Button, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addPageAsync, responseFailure } from '../../store/slices/pagesSlice';
import NameField from './fields/NameField';
import * as Yup from 'yup';
import DescriptionField from './fields/DescriptionField';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';

const AddPage = ({ show, setShow, bookId }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const page = {
            name: values.name,
            shortDesc: values.shortDesc
        };

        dispatch(addPageAsync(bookId, page))
            .then((result) => {
                if (result.type === responseFailure.type) {
                    toast.error(result.payload);
                } else {
                    toast.success(
                        `${result.payload.name} is added successfully`
                    );
                    handleClose();
                }
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(5, 'Name must be at least 5 characters')
            .matches(
                /^[\w\s'"-]+$/,
                'Name can only contain letters, numbers, underscores, hyphens, single quotes, double quotes and spaces'
            )
            .required('Name is required'),
        description: Yup.string().notRequired()
    });

    const initialValues = {
        name: '',
        shortDesc: ''
    };

    return (
        <Modal
            contentClassName={styles.formModal}
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Add New Page</Modal.Title>
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
                    isSubmitting
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body>
                            <NameField
                                label="Page Name"
                                placeholder="Enter Page Name"
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
                            />
                            <DescriptionField
                                label="Description"
                                placeholder="Enter a short description"
                                values={values}
                                errors={errors}
                                touched={touched}
                                handleChange={handleChange}
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
                                    'Add'
                                )}
                            </Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default AddPage;
