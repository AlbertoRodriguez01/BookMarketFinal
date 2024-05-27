import React from 'react'
import { StyleSheet, ScrollView, Text, View, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Register from './Register'
import LoginForm from '../../components/account/LoginForms'

export default function Login(){
    return (
      <KeyboardAwareScrollView>
        <Image source={require("../../assets/logo.jpg")} resizeMode='contain' style={styles.image}/>
        <View style={styles.container}>
            <LoginForm/>
            <CreateAccount/>
        </View>
        <Divider style={styles.divider}/>
      </KeyboardAwareScrollView>
    )
}


function CreateAccount(props) {
    const navigation = useNavigation()
    return(
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate(Register)}
        >
            ¿Aun no tienes una cuenta?{" "}
            <Text style={styles.btnRegister}>
                Registrarse
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:"100%",
        marginBottom:20,
    },
    container:{
        marginHorizontal:20
    },
    divider:{
        backgroundColor:"#36ADFC",
        margin: 40
    },
    register:{
        marginTop:15,
        marginHorizontal:10,
        alignSelf: "center"
    },
    btnRegister:{
        color: "#36ADFC",
        fontWeight: "bold"
    }
})
