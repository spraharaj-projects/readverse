import React from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addBookAsync, responseFailure } from '../../store/slices/booksSlice';
import { Formik } from 'formik';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import ImageDropzone from './fields/ImageDropzone';
import NameField from './fields/NameField';
import DescriptionField from './fields/DescriptionField';

const AddBook = ({ show, setShow }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const handleClose = () => {
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        const book = {
            name: values.name,
            shortDesc: values.shortDesc,
            image: values.image
        };

        dispatch(addBookAsync(book, user))
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
        description: Yup.string().notRequired(),
        image: Yup.mixed().notRequired()
    });

    const initialValues = {
        name: '',
        shortDesc: '',
        image: null
    };

    return (
        <Modal
            contentClassName={styles.formModal}
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Add New Book</Modal.Title>
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
                            <ImageDropzone
                                label="Cover Image"
                                values={values}
                                field="image"
                                setFieldValue={setFieldValue}
                            />
                            <NameField
                                label="Book Name"
                                placeholder="Enter Book Name"
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

export default AddBook;
