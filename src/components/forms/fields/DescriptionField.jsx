import React from 'react';
import { Form } from 'react-bootstrap';
import { Field } from 'formik';
import styles from '../../styles/Form.module.css';

const DescriptionField = ({
    label,
    placeholder,
    values,
    errors,
    touched,
    handleChange
}) => {
    return (
        <Form.Group
            controlId="newPageForm.shortDesc"
            className={styles.formGroupTextArea}>
            <div className="d-flex justify-content-start">
                <Form.Label className={styles.formLabel}>{label}</Form.Label>
            </div>
            <Form.Control
                className={styles.formTextArea}
                as={Field}
                component="textarea"
                name="shortDesc"
                value={values.shortDesc}
                onChange={handleChange}
                placeholder={placeholder}
                isInvalid={errors.shortDesc && touched.shortDesc}
            />
            <Form.Control.Feedback type="invalid">
                {errors.shortDesc && touched.shortDesc && errors.shortDesc}
            </Form.Control.Feedback>
        </Form.Group>
    );
};

export default DescriptionField;
