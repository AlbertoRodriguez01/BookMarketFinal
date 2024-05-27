import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Image,
} from "react-native";
import {
  addDocumentWithoutId,
  deleteFavorite,
  getCurrentUser,
  getDocumentById,
  getIsFavorite,
} from "../../utils/actions";
import Loading from "../../components/Loading";
import { Icon, Rating } from "react-native-elements";
import ListReviews from "../../components/libros/ListReviews";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import { getAuth } from "firebase/auth";
import Toast from "react-native-easy-toast";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;

const ANCHO_CONTENEDOR = widthScreen * 0.7;
const ESPACIO = 10;

const auth = getAuth(firebaseApp);

export default function Libro({ navigation, route }) {
  const toastRef = useRef();

  const { id, name } = route.params;
  const [libro, setLibro] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  auth.onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  navigation.setOptions({ title: name });

  useEffect(() => {
    (async () => {
      if (userLogged && libro) {
        const response = await getIsFavorite(libro.id);
        response.statusResponse && setIsFavorite(response.isFavorite);
      }
    })();
  }, [userLogged, libro]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getDocumentById("Libros", id);
        if (response.statusResponse) {
          setLibro(response.document);
        } else {
          setLibro({});
          Alert.alert(
            "Ocurrio un problema guardando el libro. Intenta de nuevo mas tarde"
          );
        }
      })();
    }, [])
  );

  if (!libro) {
    return <Loading isVisible={true} text="Cargando.." />;
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={{ width: ANCHO_CONTENEDOR }}>
        <View
          style={{
            marginHorizontal: ESPACIO,
            padding: ESPACIO,
            borderRadius: 34,
            backgroundColor: "#fff",
            alignItems: "center",
          }}
        >
          <Image source={{ uri: item }} style={styles.posterImage} />
        </View>
      </View>
    );
  };

  const addFavorite = async () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para agregarlo al carrito debes tener una cuenta!",
        3000
      );
      return;
    }

    setLoading(true);

    const response = await addDocumentWithoutId("Carrito", {
      idUser: getCurrentUser().uid,
      idLibro: libro.id,
    });

    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(true);
      toastRef.current.show("Agregado al carrito con exito", 3000);
    } else {
      toastRef.current.show(
        "No se ha podido agregar al carrito. Intenta mas tarde",
        3000
      );
    }
  };

  const removeFavorite = async () => {
    setLoading(true);
    const response = await deleteFavorite(libro.id);
    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(false);
      toastRef.current.show("Removido del carrito con exito", 3000);
    } else {
      console.log(response.error);
      toastRef.current.show(
        "No se ha podido remover del carrito. Intenta mas tarde",
        3000
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <FlatList
        data={libro.images}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        decelerationRate={0}
        snapToInterval={ANCHO_CONTENEDOR}
        scrollEventThrottle={16}
        keyExtractor={(item) => item}
        renderItem={renderItem}
      />
      <View style={styles.viewFavorites}>
        <Icon
          type="material-community"
          name={!isFavorite ? "cart-outline" : "cart-heart"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#36ADFC" : "#36ADFC"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <TitleLibro
        name={libro.name}
        descripcion={libro.descripcion}
        precio={libro.precio}
        rating={libro.rating}
      />
      <ListReviews navigation={navigation} idLibro={libro.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Cargando..." />
    </ScrollView>
  );
}

function TitleLibro({ name, descripcion, precio, rating }) {
  return (
    <View style={styles.viewLibroTitle}>
      <View style={styles.viewLibroContainer}>
        <Text style={styles.nameLibro}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readOnly
          startingValue={parseFloat(rating)}
        />
      </View>
      <Text style={styles.descLibro}>{descripcion}</Text>
      <Text style={styles.nameLibro}>${precio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  posterImage: {
    width: "100%",
    height: ANCHO_CONTENEDOR * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  viewLibroTitle: {
    padding: 15,
  },
  viewLibroContainer: {
    flexDirection: "row",
  },
  descLibro: {
    marginTop: 8,
    color: "gray",
    textAlign: "justify",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  nameLibro: {
    fontWeight: "bold",
  },
  viewFavorites: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
