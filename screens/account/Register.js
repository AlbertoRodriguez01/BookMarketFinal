import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RegisterForm from '../../components/account/RegisterForm'

export default function Register() {
    return (
        <KeyboardAwareScrollView>
            <Image source={require("../../assets/logo.jpg")} resizeMode='contain' style={styles.image}/>
          <RegisterForm/>
        </KeyboardAwareScrollView>
      )
}

const styles = StyleSheet.create({
    image:{
        height:150,
        width:"100%",
        marginBottom:20
    }
})