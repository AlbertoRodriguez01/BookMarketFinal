import React from 'react'
import { Text, StyleSheet, View, ScrollView, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function UserGuest() {

    const navigation = useNavigation()

    return (
          <ScrollView
            centerContent
            style={styles.viewBody}
          >
            <Image source={require("../../assets/logo.jpg")} resizeMode='contain' style={styles.image}/>
            <Text style={styles.title}>Consulta tu perfil</Text>
            <Text style={styles.descripcion}>Adentrate en un nuevo mundo de lectura!</Text>
            <Button
                buttonStyle={styles.boton}
                title="Ver tu perfil"
                onPress={() => navigation.navigate("Login")}
            />
          </ScrollView>
          
      )
}

const styles = StyleSheet.create({
    viewBody:{
        marginHorizontal:30
    },
    image:{
        height:300,
        width:"100%",
        marginBottom:10,
    },
    title:{
        fontWeight:"bold",
        fontSize:19,
        marginVertical: 10,
        textAlign:"center"
    },
    descripcion:{
        textAlign:"justify",
        marginBottom:20,
        color:"gray"
    },
    boton:{
        backgroundColor:"#36ADFC"
    }
})
