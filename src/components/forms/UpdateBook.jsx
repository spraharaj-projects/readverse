import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
    responseFailure,
    updateBookAsync
} from '../../store/slices/booksSlice';
import { Formik } from 'formik';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import ImageDropzone from './fields/ImageDropzone';
import NameField from './fields/NameField';
import DescriptionField from './fields/DescriptionField';
import styles from '../styles/Form.module.css';

const UpdateBook = ({
    show,
    setShow,
    bookId,
    book,
    setSelectedId,
    setSelectedBook
}) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        setSelectedBook(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        if (
            book.name === values.name &&
            book.shortDesc === values.shortDesc &&
            book.cover === values.image
        ) {
            handleClose();
            return;
        } else {
            const updatedBook = Object.assign({}, book);
            updatedBook.name = values.name;
            updatedBook.shortDesc = values.shortDesc;
            updatedBook.image = values.image;
            dispatch(updateBookAsync(bookId, updatedBook))
                .then((result) => {
                    if (result.type === responseFailure.type) {
                        toast.error(result.payload);
                    } else {
                        toast.success(
                            `${result.payload.name} is updated successfully`
                        );
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
        name: book.name,
        shortDesc: book.shortDesc,
        image: book.cover
    };

    return (
        <Modal
            contentClassName={styles.formModal}
            // size="lg"
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>
                    Update <strong>{book.name}</strong>
                </Modal.Title>
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

export default UpdateBook;
