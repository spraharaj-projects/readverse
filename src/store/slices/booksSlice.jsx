import { createSlice } from '@reduxjs/toolkit';
import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { db, storage } from '../../firebase/FirebaseSetup';
import {
    deleteObject,
    getDownloadURL,
    getMetadata,
    ref,
    uploadBytes
} from 'firebase/storage';

const initialState = {
    books: {},
    isLoading: false,
    error: null
};

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {
        intiateProcess: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchBooks: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.books = action.payload;
        },
        responseFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addBook: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.books[action.payload.id] = action.payload;
        },
        updateBook: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.books[action.payload.id] = action.payload;
        },
        deleteBook: (state, action) => {
            state.isLoading = false;
            state.error = null;
            delete state.books[action.payload];
        }
    }
});

export const {
    intiateProcess,
    fetchBooks,
    responseFailure,
    addBook,
    updateBook,
    deleteBook
} = booksSlice.actions;

export default booksSlice.reducer;

export const fetchBooksAsync = () => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const booksCollection = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCollection);
        const books = {};
        booksSnapshot.forEach((doc) => {
            books[doc.id] = doc.data();
        });
        dispatch(fetchBooks(books));
        return { type: addBook.type, payload: books };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const addBookAsync = (book, user) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const booksCollectionRef = collection(db, 'books');
        const booksQuery = query(
            booksCollectionRef,
            where('name', '==', book.name)
        );
        const querySnapshot = await getDocs(booksQuery);
        if (querySnapshot.empty) {
            const newBook = {
                name: book.name,
                shortDesc: book.shortDesc,
                cover: null,
                author: { uid: user.uid, name: user.displayName },
                private: book.private ?? true,
                likes: 0,
                views: 0,
                links: [],
                references: [],
                createdOn: Timestamp.fromDate(new Date()),
                updatedOn: Timestamp.fromDate(new Date())
            };

            const docRef = await addDoc(booksCollectionRef, newBook);

            if (book.image) {
                const uploadImageName = `books-cover/${
                    docRef.id
                }.${book.image.name.split('.').pop()}`;
                const imageStorageRef = ref(storage, uploadImageName);
                await uploadBytes(imageStorageRef, book.image);
                newBook.cover = await getDownloadURL(imageStorageRef);
                updateDoc(docRef, newBook);
            }

            newBook.id = docRef.id;
            dispatch(addBook(newBook));
            return { type: addBook.type, payload: newBook };
        } else {
            throw new Error(`Book with name ${book.name} already exists.`);
        }
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const updateBookAsync = (bookId, updatedFields) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const booksCollectionRef = collection(db, 'books');
        const bookDocRef = doc(booksCollectionRef, bookId);
        const bookDoc = await getDoc(bookDocRef);
        if (bookDoc.exists()) {
            const currentBook = bookDoc.data();

            if (updatedFields.name && updatedFields.name !== currentBook.name) {
                const booksQuery = query(
                    booksCollectionRef,
                    where('name', '==', updatedFields.name)
                );
                const querySnapshot = await getDocs(booksQuery);
                if (!querySnapshot.empty) {
                    throw new Error(
                        `Book with name ${updatedFields.name} already exists.`
                    );
                }
            }

            const updatedBook = Object.assign({}, currentBook, {
                name: updatedFields.name ?? currentBook.name,
                shortDesc: updatedFields.shortDesc ?? currentBook.shortDesc,
                private: updatedFields.private ?? currentBook.private,
                links: updatedFields.links ?? currentBook.links,
                references: updatedFields.references ?? currentBook.references,
                likes: updatedFields.likes ?? currentBook.likes,
                views: updatedFields.views ?? currentBook.views,
                updatedOn:
                    'likes' in updatedFields || 'views' in updatedFields
                        ? currentBook.updatedOn
                        : Timestamp.fromDate(new Date())
            });
            if ('image' in updatedFields) {
                if (updatedFields.image) {
                    if (typeof updatedFields.image === 'object') {
                        const uploadImageName = `books-cover/${bookId}.${updatedFields.image.name
                            .split('.')
                            .pop()}`;
                        const imageStorageRef = ref(storage, uploadImageName);
                        await uploadBytes(imageStorageRef, updatedFields.image);
                        updatedBook.cover = await getDownloadURL(
                            imageStorageRef
                        );
                    }
                } else {
                    if (currentBook.cover) {
                        const imageStorageRef = ref(storage, currentBook.cover);
                        await deleteObject(imageStorageRef);
                        updatedBook.cover = null;
                    }
                }
            }
            await updateDoc(bookDocRef, updatedBook);
            updatedBook.id = bookId;
            dispatch(updateBook(updatedBook));
            return { type: updateBook.type, payload: updatedBook };
        } else {
            throw new Error(`Book with name ${book.name} not exists.`);
        }
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const deleteBookAsync = (bookId) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const bookDocRef = doc(db, 'books', bookId);
        const bookDoc = await getDoc(bookDocRef);
        if (bookDoc.exists()) {
            const deletedBook = { ...bookDoc.data() };
            if (deletedBook.cover !== null) {
                const coverImageRef = ref(storage, deletedBook.cover);
                const fileExists = await getMetadata(coverImageRef)
                    .then(() => true)
                    .catch((error) => {
                        if (error.code === 'storage/object-not-found') {
                            return false;
                        }
                        throw error;
                    });
                if (fileExists) {
                    await deleteObject(coverImageRef);
                }
            }
            await deleteDoc(bookDocRef);
            dispatch(deleteBook(bookId));
            return { type: deleteBook.type, payload: deletedBook };
        }
    } catch (error) {
        dispatch(responseFailure());
        return { type: responseFailure.type, payload: error.message };
    }
};
