import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    responseFailure,
    updatePageAsync
} from '../../store/slices/pagesSlice';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import NameField from './fields/NameField';
import DescriptionField from './fields/DescriptionField';
import { Formik } from 'formik';
import * as Yup from 'yup';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';

const UpdatePage = ({
    show,
    setShow,
    bookId,
    pageId,
    page,
    setSelectedId,
    setSelectedPage
}) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        setSelectedPage(null);
        setSelectedId(null);
        setShow(false);
    };

    const handleSubmit = (values, { setSubmitting }) => {
        if (page.name === values.name && page.shortDesc === values.shortDesc) {
            handleClose();
            return;
        } else {
            const updatedPage = Object.assign({}, page);
            updatedPage.name = values.name;
            updatedPage.shortDesc = values.shortDesc;
            dispatch(updatePageAsync(bookId, pageId, updatedPage))
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
        description: Yup.string().notRequired()
    });

    const initialValues = {
        name: page.name,
        shortDesc: page.shortDesc
    };

    return (
        <Modal
            contentClassName={styles.formModal}
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>
                    Update <strong>{page.name}</strong>
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

export default UpdatePage;
