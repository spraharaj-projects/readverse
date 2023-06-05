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
    pages: [],
    isLoading: false,
    error: null
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        intiateProcess: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchPages: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.pages = action.payload;
        },
        responseFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        addPage: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.pages.push(action.payload);
        },
        updatePage: (state, action) => {
            state.isLoading = false;
            state.error = null;
            const index = state.pages.findIndex(
                (page) => page.id === action.payload.id
            );
            state.pages[index] = action.payload;
        },
        deletePage: (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.pages = state.pages.filter(
                (page) => page.id !== action.payload
            );
        },
        resetPages: (state) => {
            state = initialState;
        }
    }
});

export const {
    intiateProcess,
    fetchPages,
    responseFailure,
    addPage,
    updatePage,
    deletePage,
    resetPages
} = pagesSlice.actions;

export default pagesSlice.reducer;

export const fetchPagesAsync = (bookId) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const bookDocRef = doc(db, 'books', bookId);
        const pageCollectionRef = collection(bookDocRef, 'pages');
        const pagesSnapshot = await getDocs(pageCollectionRef);
        const pages = [];
        pagesSnapshot.forEach((doc) => {
            pages.push({
                id: doc.id,
                ...doc.data()
            });
        });
        dispatch(fetchPages(pages));
        return { type: updatePage.type, payload: pages };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const addPageAsync = (bookId, page) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const bookDocRef = doc(db, 'books', bookId);
        const pageCollectionRef = collection(bookDocRef, 'pages');
        const pagesQuery = query(
            pageCollectionRef,
            where('name', '==', page.name)
        );
        const querySnapshot = await getDocs(pagesQuery);
        if (querySnapshot.empty) {
            const newPage = {
                name: page.name,
                shortDesc: page.shortDesc,
                mdUrl: null,
                createdOn: Timestamp.fromDate(new Date()),
                updatedOn: Timestamp.fromDate(new Date())
            };
            const docRef = await addDoc(pageCollectionRef, newPage);
            const mdFileRef = ref(storage, `${bookId}/${docRef.id}.md`);
            const fileContents = `# ${page.name}\n\n${page.shortDesc}`;
            const fileBlob = new Blob([fileContents], {
                type: 'text/markdown'
            });
            const snapshot = await uploadBytes(mdFileRef, fileBlob);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            newPage.mdUrl = downloadUrl;
            updateDoc(docRef, newPage);
            newPage.id = docRef.id;
            dispatch(addPage(newPage));
            return { type: addPage.type, payload: newPage };
        } else {
            throw new Error(`Page with name ${page.name} already exists.`);
        }
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const updatePageAsync =
    (bookId, pageId, updatedFields) => async (dispatch) => {
        dispatch(intiateProcess());
        try {
            const bookDocRef = doc(db, 'books', bookId);
            const pagesCollectionRef = collection(bookDocRef, 'pages');
            const pageDocRef = doc(bookDocRef, 'pages', pageId);
            const pageDoc = await getDoc(pageDocRef);
            if (pageDoc.exists()) {
                const currentPage = pageDoc.data();
                if (
                    updatedFields.name &&
                    updatedFields.name !== currentPage.name
                ) {
                    const pagesQuery = query(
                        pagesCollectionRef,
                        where('name', '==', updatedFields.name)
                    );
                    const querySnapshot = await getDocs(pagesQuery);
                    if (!querySnapshot.empty) {
                        throw new Error(
                            `Page with name ${updatedFields.name} already exists.`
                        );
                    }
                }

                const updatedPage = Object.assign({}, currentPage, {
                    name: updatedFields.name ?? currentPage.name,
                    shortDesc: updatedFields.shortDesc ?? currentPage.shortDesc,
                    updatedOn: Timestamp.fromDate(new Date())
                });

                await updateDoc(pageDocRef, updatedPage);
                updatedPage.id = pageId;
                dispatch(updatePage(updatedPage));
                return { type: updatePage.type, payload: updatedPage };
            } else {
                throw new Error(`Page with name ${page.name} not exists.`);
            }
        } catch (error) {
            dispatch(responseFailure(error.message));
            return { type: responseFailure.type, payload: error.message };
        }
    };

export const deletePageAsync = (bookId, pageId) => async (dispatch) => {
    dispatch(intiateProcess());
    try {
        const bookDocRef = doc(db, 'books', bookId);
        const bookDoc = await getDoc(bookDocRef);
        if (bookDoc.exists()) {
            const links = bookDoc.data().links;
            const pageDocRef = doc(bookDocRef, 'pages', pageId);
            const mdFileRef = ref(storage, `${bookId}/${pageId}.md`);
            const pageDoc = await getDoc(pageDocRef);
            if (pageDoc.exists()) {
                const deletedPage = { ...pageDoc.data() };
                const fileExists = await getMetadata(mdFileRef)
                    .then(() => true)
                    .catch((error) => {
                        if (error.code === 'storage/object-not-found') {
                            return false;
                        }
                        throw error;
                    });

                if (fileExists) {
                    await deleteObject(mdFileRef);
                }
                await deleteDoc(pageDocRef);
                const newLinks = links.filter(
                    (link) => link.source !== pageId && link.target !== pageId
                );
                await updateDoc(bookDocRef, {
                    links: newLinks,
                    updatedOn: Timestamp.fromDate(new Date())
                });
                dispatch(deletePage(pageId));
                return {
                    type: deletePage.type,
                    payload: { page: deletedPage, links: newLinks }
                };
            } else {
                throw new Error('Page not exist!');
            }
        } else {
            throw new Error('Book not exist!');
        }
    } catch (error) {
        dispatch(responseFailure());
        return { type: responseFailure.type, payload: error.message };
    }
};
