import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { deleteFavorite, getFavorites } from "../utils/actions";
import { Button, Icon, Image } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { firebaseApp } from "../utils/firebase";
import { getAuth } from "firebase/auth";
import Loading from "../components/Loading";

const auth = getAuth(firebaseApp);

export default function Favorites({ navigation }) {
  const toastRef = useRef();

  const [libros, setLibros] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [totalPagar, setTotalPagar] = useState(0)

  auth.onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        async function getData() {
          setLoading(true);
          const response = await getFavorites();
          setLibros(response.favorites);
          setLoading(false);
        }
        getData();
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );


  useEffect(() => {
    if (libros) {
      const total = libros.reduce((acc, libro) => {
        const precio = parseFloat(libro.precio);
        return isNaN(precio) ? acc : acc + precio;
      }, 0);
      setTotalPagar(total);
    }
  }, [libros]);

  if (!userLogged) {
    return <UserNoLogged navigation={navigation} />;
  }

  if (libros?.length === 0) {
    return <NotFoundLibros />;
  }

  return (
    <View style={styles.viewBody}>
      {libros ? (
        <FlatList
          data={libros}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(libro) => (
            <Libro
              libro={libro}
              setLoading={setLoading}
              toastRef={toastRef}
              navigation={navigation}
              setReloadData={setReloadData}
            />
            
          )}
        />
        
      ) : (
        <View style={styles.loaderLibro}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando Carrito</Text>
        </View>
      )}
      <Text style={styles.totalPagar}>Total a pagar: ${totalPagar}</Text>
      <View>
        <Button
          title="Pagar"
          containerStyle={{ padding: 20 }}
          onPress={() => navigation.navigate("Pago", { libros })}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Por favor espere.." />
    </View>
  );
}

function Libro({ libro, setLoading, toastRef, navigation, setReloadData }) {
  const { id, name, precio, images } = libro.item;

  const confirmRemoveCarrito = () => {
    Alert.alert(
      "Eliminar libro del carrito",
      "¿Estas seguro que deseas eliminar el articulo de tu carrito?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text:"Si",
          onPress: removeCarrito
        }
      ],
      { cancelable: false }
    )
  }

  const removeCarrito = async() => {
    setLoading(true)
    const response = await deleteFavorite(id)
    setLoading(false)
    if (response.statusResponse) {
      setReloadData(true)
      toastRef.current.show("Libro retirado del carrito", 3000)
    } else {
      toastRef.current.show("Error al retriar el libro del carrito", 3000)
    }
  }

  return (
    <View style={styles.libro}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Libros", {
            screen: "Libro",
            params: { id, name, precio },
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={{ uri: images[0] }}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.name}>${precio}</Text>
          <Icon
            type="material-community"
            name="cart-outline"
            color="#f00"
            containerStyle={styles.favorite}
            underlayColor="tranparent"
            onPress={confirmRemoveCarrito}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function NotFoundLibros() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Aun no tienes nada en el carrito
      </Text>
    </View>
  );
}

function UserNoLogged({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View>
        <Icon type="material-community" name="alert-outline" size={50} />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Necesitas iniciar sesion para ver tu carrito
        </Text>
        <Button
          title="Ir al Login"
          containerStyle={{ marginTop: 2, padding:10 }}
          buttonStyle={{ backgroundColor: "#36ADFC" }}
          onPress={() => navigation.navigate("Cuenta")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderLibro: {
    marginVertical: 10,
  },
  libro: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
  totalPagar:{
    fontSize:24,
    marginVertical:10
  }
});