import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';
import styles from '../styles/Form.module.css';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/FirebaseSetup';
import { toast } from 'react-toastify';
import {
    responseFailure,
    updateBookAsync
} from '../../store/slices/booksSlice';

const AddReference = ({ show, setShow, book, setBook, nodes, setNodes }) => {
    const dispatch = useDispatch();
    const { books } = useSelector((state) => state.books);
    const [selectedBook, setSelectedBook] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [pageOptions, setPageOptions] = useState({});
    const [isLoading, setLoading] = useState(false);

    const filteredBooks = { ...books };
    delete filteredBooks[book.id];

    const bookOptions = Object.entries(filteredBooks).map(([id, { name }]) => ({
        value: id,
        label: name
    }));

    const handleClose = () => {
        setLoading(false);
        setSelectedBook(null);
        setSelectedPage(null);
        setPageOptions([]);
        setShow(false);
    };

    const handleChangeBook = (selected) => {
        setSelectedBook(selected);
    };

    const handleChangePage = (select) => {
        setSelectedPage(select);
    };

    const handleSubmit = () => {
        setLoading(true);
        if (selectedBook) {
            if (selectedPage) {
                const bookRef = doc(db, 'books', selectedBook.value);
                const pageRef = doc(bookRef, 'pages', selectedPage.value);
                getDoc(pageRef)
                    .then((doc) => {
                        const newBook = { ...book };
                        const newReferences = [...newBook.references];
                        newReferences.push(pageRef);
                        newBook.references = newReferences;
                        dispatch(
                            updateBookAsync(book.id, {
                                references: newReferences
                            })
                        ).then((result) => {
                            if (result.type === responseFailure.type) {
                                toast.error(result.payload);
                            } else {
                                toast.success(
                                    `${selectedBook.label} is added to ${book.name}`
                                );
                                const newNodes = [...nodes];
                                newNodes.push({
                                    id: doc.id,
                                    refUrl: `/${selectedBook.value}/${selectedPage.value}`,
                                    ...doc.data()
                                });
                                setBook(newBook);
                                setNodes(newNodes);
                                handleClose();
                            }
                        });
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });
            } else {
                const bookRef = doc(db, 'books', selectedBook.value);
                getDoc(bookRef)
                    .then((doc) => {
                        const newBook = { ...book };
                        const newReferences = [...newBook.references];
                        newReferences.push(bookRef);
                        newBook.references = newReferences;

                        dispatch(
                            updateBookAsync(book.id, {
                                references: newReferences
                            })
                        ).then((result) => {
                            if (result.type === responseFailure.type) {
                                toast.error(result.payload);
                            } else {
                                toast.success(
                                    `${selectedBook.label} is added to ${book.name}`
                                );
                                const newNodes = [...nodes];
                                newNodes.push({
                                    id: doc.id,
                                    refUrl: `/${selectedBook.value}`,
                                    ...doc.data()
                                });
                                setBook(newBook);
                                setNodes(newNodes);
                                handleClose();
                            }
                        });
                    })
                    .catch((error) => {
                        toast.error(error.message);
                    });
            }
        } else {
            handleClose();
        }
    };

    useEffect(() => {
        if (selectedBook) {
            setLoading(true);
            const bookRef = doc(db, 'books', selectedBook.value);
            const pagesRef = collection(bookRef, 'pages');
            getDocs(pagesRef)
                .then((snapshot) => {
                    const pages = [];
                    snapshot.forEach((page) => {
                        pages.push({ value: page.id, label: page.data().name });
                    });
                    setPageOptions(pages);
                })
                .catch((error) => {
                    toast.error(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [selectedBook]);

    return (
        <Modal
            contentClassName={styles.formModal}
            show={show}
            onHide={handleClose}
            centered>
            <Modal.Header className={styles.modalHeader}>
                <Modal.Title>Add New Reference</Modal.Title>
                <Button variant="dark" size="sm" onClick={handleClose}>
                    <MdClose size={24} />
                </Button>
            </Modal.Header>
            <Modal.Body>
                <Select
                    // closeMenuOnSelect={false}
                    options={bookOptions}
                    value={selectedBook}
                    onChange={handleChangeBook}
                    // isMulti={true}
                />
                <Select
                    // closeMenuOnSelect={false}
                    options={pageOptions}
                    value={selectedPage}
                    onChange={handleChangePage}
                    isLoading={isLoading}
                    // isMulti={true}
                />
            </Modal.Body>
            <Modal.Footer
                className={`${styles.modalFooter} justify-content-center`}>
                <Button
                    className={styles.formBtn}
                    variant="success"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}>
                    {isLoading ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Add'
                    )}
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddReference;
