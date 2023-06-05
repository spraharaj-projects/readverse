import React from 'react';
import { Form } from 'react-bootstrap';
import { Field } from 'formik';
import styles from '../../styles/Form.module.css';

const NameField = ({
    label,
    placeholder,
    values,
    errors,
    touched,
    handleChange
}) => {
    return (
        <Form.Group
            controlId="newPageForm.pageName"
            className={styles.formGroup}>
            <div className="d-flex justify-content-start">
                <Form.Label className={styles.formLabel}>{label}</Form.Label>
            </div>
            <Form.Control
                className={`${styles.formField} ${
                    errors.name && styles.isInvalid
                }`}
                as={Field}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder={placeholder}
                isInvalid={errors.name && touched.name}
            />
            {errors.name && touched.name && (
                <div className="w-100 d-flex justify-content-end">
                    <Form.Text className={styles.formText}>
                        {errors.name}
                    </Form.Text>
                </div>
            )}
        </Form.Group>
    );
};

export default NameField;
