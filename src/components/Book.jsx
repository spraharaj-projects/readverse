import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    fetchPagesAsync,
    resetPages,
    responseFailure
} from '../store/slices/pagesSlice';
import { updateBookAsync } from '../store/slices/booksSlice';
import AddPage from './forms/AddPage';
import UpdatePage from './forms/UpdatePage';
import DeletePage from './forms/DeletePage';
import styles from './styles/Book.module.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

import { runBookNetGenerator } from '../svgGenerator/bookNetGenerator';
import Spinner from './Spinner';
import { toast } from 'react-toastify';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/FirebaseSetup';
import AddReference from './forms/AddReference';

const Book = ({ searchQuery }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const svgContainerRef = useRef(null);
    const { bookId } = useParams();
    const { pages, books, user } = useSelector((state) => {
        return {
            pages: state.pages.pages,
            books: state.books.books,
            user: state.auth.user
        };
    });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [isEdit, setEdit] = useState(false);
    const [book, setBook] = useState(null);
    const [selectedPage, setSelectedPage] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddPage, setShowAddPage] = useState(false);
    const [showAddReference, setShowAddReference] = useState(false);
    const [showUpdatePage, setShowUpdatePage] = useState(false);
    const [showDeletePage, setShowDeletePage] = useState(false);
    useEffect(() => {
        setLoading(true);
        dispatch(fetchPagesAsync(bookId)).then((result) => {
            if (result.type === responseFailure.type) {
                setError(result.payload);
                setLoading(false);
            } else {
                const bookRef = doc(db, 'books', bookId);
                const allNodes = [...result.payload];
                getDoc(bookRef).then((doc) => {
                    const bookDoc = doc.data();
                    const referencePromises = bookDoc.references.map((ref) =>
                        getDoc(ref).then((doc) => ({
                            id: doc.id,
                            refUrl:
                                '/' +
                                ref.path
                                    .replace('books', '')
                                    .replace('pages', '')
                                    .split('/')
                                    .filter((id) => id !== '')
                                    .join('/'),
                            ...doc.data()
                        }))
                    );
                    Promise.all(referencePromises)
                        .then((refData) => {
                            refData.forEach((data) => allNodes.push(data));
                            setBook({ id: doc.id, ...bookDoc });
                            document.title = `${bookDoc.name} | ReadVerse | Lumindrix`;
                            setNodes(allNodes);
                            setLinks(books[bookId].links);
                            setLoading(false);
                        })
                        .catch((error) => toast.error(error.message));
                });
            }
        });

        return () => {
            dispatch(resetPages);
            setNodes([]);
            setLinks([]);
        };
    }, [user, bookId, dispatch]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // setLoading(true);
        setNodes(pages);
        setLinks(books[bookId].links);
        // setLoading(false);
        return () => {
            setNodes([]);
            setLinks([]);
        };
    }, [user, pages]);

    useEffect(() => {
        // setLoading(true);
        let svgGenerator;
        if (svgContainerRef.current && !isLoading) {
            const data = {
                nodes: nodes,
                links: links
            };
            svgGenerator = runBookNetGenerator({
                svgContainerRef,
                data,
                styles,
                isEdit,
                setLinks,
                saveNewLink,
                setEdit,
                setSelectedPage,
                setSelectedId,
                handleAddPageShow,
                handleAddReferenceShow,
                handleUpdatePageShow,
                handleDeletePageShow,
                navigate,
                user,
                handleRefreshPages
            });
        }
        // setLoading(false);
        return () => {
            if (svgContainerRef.current && !isLoading) {
                svgGenerator.simulation.stop();
                svgGenerator.svg.remove();
            }
        };
    }, [user, isEdit, nodes, links, dimensions.width, dimensions.height]);

    function handleResize() {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    const handleAddPageShow = () => setShowAddPage(true);
    const handleAddReferenceShow = () => setShowAddReference(true);
    const handleUpdatePageShow = () => setShowUpdatePage(true);
    const handleDeletePageShow = () => setShowDeletePage(true);

    const handleRefreshPages = () => {
        setLoading(true);
        dispatch(fetchPagesAsync(bookId)).then((result) => {
            if (result.type === responseFailure.type) {
                setError(result.payload);
            } else {
                const bookRef = doc(db, 'books', bookId);
                const allNodes = [...result.payload];
                getDoc(bookRef).then((doc) => {
                    const bookDoc = doc.data();
                    const referencePromises = bookDoc.references.map((ref) =>
                        getDoc(ref).then((doc) => ({
                            id: doc.id,
                            refUrl:
                                '/' +
                                ref.path
                                    .replace('books', '')
                                    .replace('pages', '')
                                    .split('/')
                                    .filter((id) => id !== '')
                                    .join('/'),
                            ...doc.data()
                        }))
                    );
                    Promise.all(referencePromises)
                        .then((refData) => {
                            refData.forEach((data) => allNodes.push(data));
                            setBook({ id: doc.id, ...bookDoc });
                            setNodes(allNodes);
                            setLinks(books[bookId].links);
                            setLoading(false);
                        })
                        .catch((error) => toast.error(error.message));
                });
            }
        });
    };

    const saveNewLink = (newLinks, type) => {
        dispatch(updateBookAsync(bookId, newLinks)).then((res) => {
            toast.success(
                `Link ${type === 'add' ? 'added' : 'deleted'} successfully`
            );
        });
    };

    return isLoading ? (
        <Spinner />
    ) : (
        <div ref={svgContainerRef} className={styles.svgContainer}>
            <Tooltip id="my-tooltip" className={styles.tooltip} />
            <AddPage
                show={showAddPage}
                setShow={setShowAddPage}
                bookId={bookId}
            />
            <AddReference
                show={showAddReference}
                setShow={setShowAddReference}
                book={book}
                setBook={setBook}
                nodes={nodes}
                setNodes={setNodes}
            />
            {selectedId && selectedPage && (
                <UpdatePage
                    show={showUpdatePage}
                    setShow={setShowUpdatePage}
                    bookId={book.id}
                    pageId={selectedId}
                    page={selectedPage}
                    setSelectedId={setSelectedId}
                    setSelectedPage={setSelectedPage}
                />
            )}
            {selectedId && selectedPage && (
                <DeletePage
                    show={showDeletePage}
                    setShow={setShowDeletePage}
                    book={book}
                    setBook={setBook}
                    pageId={selectedId}
                    page={selectedPage}
                    setSelectedId={setSelectedId}
                    setSelectedPage={setSelectedPage}
                    setLinks={setLinks}
                    nodes={nodes}
                    setNodes={setNodes}
                />
            )}
        </div>
    );
};

export default Book;
