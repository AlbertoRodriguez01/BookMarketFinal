import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Input } from "react-native-elements";
import {
  addDocumentWithoutId,
  getCurrentUser,
  deleteFavorite,
} from "../utils/actions";
import Loading from "../components/Loading";

export default function PagoCarrito({ route, navigation }) {
  const { libros } = route.params;

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const [totalPagar, setTotalPagar] = useState(0);

  useEffect(() => {
    if (libros) {
      const total = libros.reduce((acc, libro) => {
        const precio = parseFloat(libro.precio);
        return isNaN(precio) ? acc : acc + precio;
      }, 0);
      setTotalPagar(total);
    }
  }, [libros]);

  const validateFields = () => {
    let valid = true;
    let errors = {};

    // Validar nombre del titular
    if (cardName.trim() === "") {
      errors.cardName = "El nombre del titular es requerido";
      valid = false;
    }

    // Validar número de tarjeta
    const cardNumberRegex = /^\d{16}$/;
    if (!cardNumberRegex.test(cardNumber)) {
      errors.cardNumber = "El número de tarjeta debe tener 16 dígitos";
      valid = false;
    }

    // Validar fecha de vencimiento
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiryDate)) {
      errors.expiryDate = "La fecha de vencimiento debe tener el formato MM/AA";
      valid = false;
    }

    // Validar CVV
    const cvvRegex = /^\d{3}$/;
    if (!cvvRegex.test(cvv)) {
      errors.cvv = "El CVV debe tener 3 dígitos";
      valid = false;
    }

    // Validar dirección
    if (address.trim() === "") {
      errors.address = "La dirección es requerida";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handlePayment = async () => {
    if (validateFields()) {
      const user = getCurrentUser();
      const venta = {
        userId: user.uid,
        cardName,
        cardNumber,
        expiryDate,
        cvv,
        address,
        totalPagar,
        libros,
        createdAt: new Date(),
      };
      const result = await addDocumentWithoutId("Ventas", venta);
      if (result.statusResponse) {
        Alert.alert("Pago exitoso!", "Pago procesado. Disfruta tus libros!");
        await removeCarrito();
        navigation.goBack();
      } else {
        Alert.alert("Error al intentar pagar", "Error al proceder con el pago");
      }
    } else {
      Alert.alert(
        "Error al intentar pagar",
        "Por favor, corrija los errores antes de continuar."
      );
    }
  };

  const removeCarrito = async () => {
    setLoading(true);
    const deletePromises = libros.map(async (libro) => {
      const response = await deleteFavorite(libro.id);
      return response.statusResponse;
    });

    const results = await Promise.all(deletePromises);

    if (results.every((result) => result)) {
      setReloadData(true);
      setLoading(false);
    } else {
      setLoading(false);
      Alert.alert(
        "Error al eliminar libros del carrito",
        "Hubo un problema al intentar eliminar los libros del carrito. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ flexGrow: 1 }}
      >
        <Text style={styles.header}>Detalles del Pedido</Text>
        <FlatList
          data={libros}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.libro}>
              <Text>{item.name}</Text>
              <Text>${item.precio}</Text>
            </View>
          )}
        />
        <Text style={styles.totalPagar}>Total a pagar: ${totalPagar}</Text>
        <Input
          placeholder="Nombre del titular"
          value={cardName}
          onChangeText={setCardName}
          errorMessage={errors.cardName}
          containerStyle={styles.input}
        />
        <Input
          placeholder="Número de tarjeta"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          errorMessage={errors.cardNumber}
          containerStyle={styles.input}
          maxLength={16}
        />
        <Input
          placeholder="Fecha de vencimiento (MM/AA)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          keyboardType="numeric"
          errorMessage={errors.expiryDate}
          containerStyle={styles.input}
        />
        <Input
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          secureTextEntry={true}
          errorMessage={errors.cvv}
          containerStyle={styles.input}
          maxLength={3}
        />
        <Input
          placeholder="Dirección"
          value={address}
          onChangeText={setAddress}
          errorMessage={errors.address}
          containerStyle={styles.input}
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button title="Pagar" onPress={handlePayment} style={styles.btnPagar} />
      </View>
      <Loading isVisible={loading} text="Por favor espere.." />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 5,
  },
  libro: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  totalPagar: {
    fontSize: 24,
    marginVertical: 10,
  },
  btnPagar: {
    padding: 5,
    borderRadius: 50,
  },
  buttonContainer: {
    padding: 20,
  },
});
