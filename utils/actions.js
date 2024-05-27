import { firebaseApp } from "./firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { uploadBytes, getDownloadURL, getStorage, ref } from "firebase/storage";
import storage from "@react-native-firebase/storage";
import { fileToBlob } from "./helpers";
import * as firebase from "./firebase";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  doc,
  getDoc,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { CameraView } from "expo-camera";
import { get } from "lodash";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export const isUserLogged = () => {
  let isLogged = false;
  auth.onAuthStateChanged((user) => {
    user !== null && (isLogged = true);
  });
  return isLogged;
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getUserId = () => {
  return auth.currentUser.uid;
};

export const registerUser = async (email, password) => {
  const result = { statusResponse: true, error: null };
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Este correo ya ha sido registrado";
  }
  return result;
};

export const closeSession = () => {
  auth.signOut();
};

export const loginWithEmailAndPassword = async (email, password) => {
  const result = { statusResponse: true, error: null };
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Usuario o contraseña no validos";
  }
  return result;
};

export const doUploadImage = async (image, path, name) => {
  const result = { statusResponse: false, error: null, url: null };
  const ref = firebase.storage().ref(path).child(name);

  const blob = await fileToBlob(image);
  try {
    await ref.put(blob);
    const url = firebase.storage().ref(`${path}/${name}`).getDownloadURL();
    result.statusResponse = true;
    result.url = url;
  } catch (error) {
    result.error = error.message;
  }
  return result;
};

export const subirImagenes = async (image, path, name) => {
  const result = { statusResponse: false, error: null, url: null };
  const ref = firebase.storage().ref(path).child(name);

  const blob = await fileToBlob(image);
  try {
    await ref.put(blob);
    const url = firebase.storage().ref(`${path}/${name}`).getDownloadURL();
    result.statusResponse = true;
    result.url = url;
  } catch (error) {
    result.error = error.message;
  }
  return result;
};

export const doUpdateProfile = async (data) => {
  const result = { statusResponse: true, error: null };
  try {
    await updateProfile(auth.currentUser, data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const reauthenticate = async (password) => {
  const result = { statusResponse: true, error: null };
  const user = getCurrentUser();
  const credentials = EmailAuthProvider.credential(user.email, password);
  try {
    await reauthenticateWithCredential(auth.currentUser, credentials);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const doUpdatePassword = async (password) => {
  const result = { statusResponse: true, error: null };
  try {
    await updatePassword(auth.currentUser, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const addDocumentWithoutId = async (coleccion, data) => {
  const result = { statusResponse: true, error: null };
  try {
    await addDoc(collection(db, coleccion), { ...data });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getLibros = async (limitLibros) => {
  const result = {
    statusResponse: true,
    error: null,
    libros: [],
    startLibro: null,
  };
  try {
    const librosQuery = query(
      collection(db, "Libros"),
      orderBy("createAt", "desc"),
      limit(limitLibros)
    );

    const response = await getDocs(librosQuery);

    if (response.docs.length > 0) {
      result.startLibro = response.docs[response.docs.length - 1];
    }

    response.forEach((doc) => {
      const libro = doc.data();
      libro.id = doc.id;
      result.libros.push(libro);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getMoreLibros = async (limitLibros, startLibro) => {
  const result = {
    statusResponse: true,
    error: null,
    libros: [],
    startLibro: null,
  };
  try {
    const librosQuery = query(
      collection(db, "Libros"),
      orderBy("createAt", "desc"),
      startAfter(startLibro.createAt),
      limit(limitLibros)
    );

    const response = await getDocs(librosQuery);

    if (response.docs.length > 0) {
      result.startLibro = response.docs[response.docs.length - 1];
    }

    response.forEach((doc) => {
      const libro = doc.data();
      libro.id = doc.id;
      result.libros.push(libro);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getDocumentById = async (coleccion, id) => {
  const result = { statusResponse: true, error: null, document: null };
  try {
    const docRef = doc(db, coleccion, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists) {
      result.document = docSnap.data();
      result.document.id = docSnap.id;
    }
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const updateDocumentById = async (coleccion, id, data) => {
  const result = { statusResponse: true, error: null };
  try {
    const docRef = doc(db, coleccion, id);
    await updateDoc(docRef, data);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getLibrosReviews = async (id) => {
  const result = { statusResponse: true, error: null, reviews: [] };
  try {
    const q = query(collection(db, "Reviews"), where("idLibro", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const review = doc.data();
      review.id = doc.id;
      result.reviews.push(review);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getIsFavorite = async (idLibro) => {
  const result = { statusResponse: true, error: null, isFavorite: false };
  try {
    const user = auth.currentUser;
    const q = query(
      collection(db, "Carrito"),
      where("idLibro", "==", idLibro),
      where("idUser", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    result.isFavorite = querySnapshot.docs.length > 0;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const deleteFavorite = async (idLibro) => {
  const result = { statusResponse: true, error: null };
  try {
    const user = auth.currentUser;
    const q = query(
      collection(db, "Carrito"),
      where("idLibro", "==", idLibro),
      where("idUser", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map((document) => {
      const favoriteId = document.id;
      return deleteDoc(doc(db, "Carrito", favoriteId));
    });
    await Promise.all(deletePromises);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getFavorites = async () => {
  const result = { statusResponse: true, error: null, favorites: [] };
  try {
    const user = auth.currentUser;
    const q = query(collection(db, "Carrito"), where("idUser", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const favoritesPromises = querySnapshot.docs.map(async (document) => {
      const favorite = document.data();
      const libro = await getDocumentById("Libros", favorite.idLibro);
      if (libro.statusResponse) {
        result.favorites.push(libro.document);
      }
    });
    await Promise.all(favoritesPromises);
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const addVenta = async(venta) => {
  const result = { statusResponse: false, error: null}
  try {
    await addDoc(collection(db, "Ventas"), venta)
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result
}
