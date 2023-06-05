import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { login, responseFailure } from '../../store/slices/authSlice';
import styles from '../styles/Form.module.css';
import { MdClose } from 'react-icons/md';

const Login = ({ show, setShow }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setLoading(false);
        setError('');
        setShow(false);
    };

    const handleSubmit = (values) => {
        setLoading(true);
        dispatch(login(values.email, values.password))
            .then((result) => {
                if (result.type === responseFailure.type) {
                    setError(result.payload);
                } else {
                    handleClose();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        password: Yup.string().required('Password is required')
    });

    return (
        <Modal
            contentClassName={styles.formModal}
            show={show}
            onHide={handleClose}
            centered
        >
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Sign In</Modal.Title>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    <MdClose size={24} />
                </Button>
            </Modal.Header>

            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Modal.Body className={styles.modalBody}>
                            <Form.Group
                                controlId="formBasicEmail"
                                className={styles.formGroup}
                            >
                                <div className="d-flex justify-content-start">
                                    <Form.Label className={styles.formLabel}>
                                        Email
                                    </Form.Label>
                                </div>
                                <Form.Control
                                    className={`${styles.formField} ${
                                        errors.email && styles.isInvalid
                                    }`}
                                    type="email"
                                    name="email"
                                    placeholder="example@domain.com"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={errors.email}
                                />
                                {errors.email && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <Form.Text className={styles.formText}>
                                            {errors.email}
                                        </Form.Text>
                                    </div>
                                )}
                            </Form.Group>

                            <Form.Group
                                controlId="formBasicPassword"
                                className={styles.formGroup}
                            >
                                <div className="d-flex justify-content-start">
                                    <Form.Label className={styles.formLabel}>
                                        Password
                                    </Form.Label>
                                </div>
                                <Form.Control
                                    className={`${styles.formField} ${
                                        errors.password && styles.isInvalid
                                    }`}
                                    type="password"
                                    name="password"
                                    placeholder="oooooooooo"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={errors.password}
                                />
                                {errors.password && (
                                    <div className="w-100 d-flex justify-content-end">
                                        <Form.Text className={styles.formText}>
                                            {errors.password}
                                        </Form.Text>
                                    </div>
                                )}
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className={styles.modalFooter}>
                            {/* {error && (
                                <div className="d-flex w-100 justify-content-center text-danger">
                                    <span>{error}</span>
                                </div>
                            )} */}
                            <div className="d-flex w-100 justify-content-center">
                                <Button
                                    className="w-25"
                                    variant="success"
                                    type="submit"
                                >
                                    {loading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'Log in'
                                    )}
                                </Button>
                            </div>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default Login;
