import { Field } from 'formik';
import React from 'react';
import Dropzone from 'react-dropzone';
import { FaEraser } from 'react-icons/fa';
import styles from '../../styles/Form.module.css';

const ImageDropzone = ({ label, values, field, setFieldValue }) => {
    const handleFileInputChange = (acceptedFiles, setFieldValue) => {
        const image = acceptedFiles[0];
        setFieldValue(field, image);
    };

    return (
        <Field name="image">
            {({ field }) => (
                <div>
                    <label htmlFor="image" className={styles.previewLabel}>
                        {label}
                    </label>
                    {values.image && (
                        <FaEraser
                            onClick={() => {
                                setFieldValue('image', null);
                            }}
                        />
                    )}
                    <Dropzone
                        accept={{ 'image/*': [] }}
                        onDrop={(acceptedFiles) =>
                            handleFileInputChange(acceptedFiles, setFieldValue)
                        }>
                        {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject,
                            isFocused
                        }) => (
                            <div
                                {...getRootProps()}
                                className={`${styles.dropzone} ${
                                    isDragActive ? styles.dragzoneActive : ''
                                } ${isFocused ? styles.dragzoneFocus : ''} ${
                                    isDragAccept ? styles.dragzoneAccept : ''
                                } ${
                                    isDragReject ? styles.dragzoneReject : ''
                                }`}>
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Drop the file here...</p>
                                ) : (
                                    <>
                                        {values.image ? (
                                            <>
                                                <img
                                                    src={
                                                        typeof values.image ===
                                                        'object'
                                                            ? URL.createObjectURL(
                                                                  values.image
                                                              )
                                                            : values.image
                                                    }
                                                    alt="Preview"
                                                    className={
                                                        styles.previewImage
                                                    }
                                                />
                                                <p
                                                    className={
                                                        styles.previewMessage
                                                    }>
                                                    Drag and drop an image file,
                                                    or click to select a file
                                                </p>
                                            </>
                                        ) : (
                                            <p>
                                                Drag and drop an image file, or
                                                click to select a file
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </Dropzone>
                </div>
            )}
        </Field>
    );
};

export default ImageDropzone;
