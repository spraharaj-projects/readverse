import { createSlice } from '@reduxjs/toolkit';
import { auth, db } from '../../firebase/FirebaseSetup';
import { signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const initialState = {
    user: null,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        responseFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserLike: (state, action) => {
            const user = { ...state.user };
            state.user = Object.assign({}, user, {
                likedBooks: action.payload.likedBooks ?? state.user.likedBooks,
                viewedBooks:
                    action.payload.viewedBooks ?? state.user.viewedBooks
            });
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setUser,
    setLoading,
    responseFailure,
    clearError,
    updateUser,
    updateUserLike
} = authSlice.actions;

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const userAdditionalData = userDoc.data();
        
        dispatch(
            setUser({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                verified: user.emailVerified,
                likedBooks: userAdditionalData.likedBooks,
                viewedBooks: userAdditionalData.viewedBooks
            })
        );
        return { type: setUser.type, payload: user };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const updateUserAsync = (user, updatedFields) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        if ('imageURL' in updatedFields) {
            if (updatedFields.imageURL) {
                if (typeof updatedFields.imageURL === 'object') {
                    const uploadImageName = `profile-images/${
                        user.uid
                    }.${updatedFields.image.name.split('.').pop()}`;
                    const imageStorageRef = ref(storage, uploadImageName);
                    await uploadBytes(imageStorageRef, updatedFields.image);
                    updatedFields.imageURL = await getDownloadURL(
                        imageStorageRef
                    );
                }
            } else {
                if (user.imageURL) {
                    const imageStorageRef = ref(storage, user.imageURL);
                    await deleteObject(imageStorageRef);
                    updatedFields.imageURL = null;
                }
            }
        }
        await updateProfile(auth.currentUser, updatedFields);
        dispatch(updateUser(updatedFields));
        return { type: updateUser.type, payload: updatedFields };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const register = (email, password, userFields) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;
        const updatedUser = {
            uid: user.uid,
            email: user.email,
            displayName: userFields.displayName,
            phoneNumber: userFields.phoneNumber,
            photoURL: userFields.photoURL
        };
        await user.updateProfile({
            displayName: updatedUser.displayName,
            photoURL: updatedUser.photoURL
        });
        dispatch(setUser(updatedUser));
        return { type: setUser.type, payload: updatedUser };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        await auth.signOut();
        dispatch(setUser(null));
        return { type: setUser.type, payload: null };
    } catch (error) {
        dispatch(responseFailure(error.message));
        return { type: responseFailure.type, payload: error.message };
    }
};

export const updatedUserLikeAsync =
    (uid, userExtra) => async (dispatch, getState) => {
        try {
            const state = getState();
            
            dispatch(setLoading(true));
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const currentUser = userDoc.data();
                const updatedUser = Object.assign({}, currentUser, {
                    likedBooks: userExtra.likedBooks ?? currentUser.likedBooks,
                    viewedBooks:
                        userExtra.viewedBooks ?? currentUser.viewedBooks
                });
                await updateDoc(userDocRef, updatedUser);
                dispatch(updateUserLike(updatedUser));
                return { type: updateUserLike.type, payload: updatedUser };
            } else {
                throw new Error(`User not found in users db`);
            }
        } catch (error) {
            dispatch(responseFailure(error.message));
            return { type: responseFailure.type, payload: error.message };
        }
    };

export default authSlice.reducer;
