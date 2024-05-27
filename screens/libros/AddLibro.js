import React, { useRef, useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import AddLibroForm from '../../components/libros/AddLibroForm'
import Toast from 'react-native-easy-toast'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loading from '../../components/Loading'

export default function AddLibro({ navigation }) {

  const toastRef = useRef()
  const [loading, setLoading] = useState(false)

    return (
        <KeyboardAwareScrollView>
          <AddLibroForm toastRef={toastRef} setLoading={setLoading} navigation={navigation}/>
          <Loading isVisible={loading} text="Agregando libro"/>
          <Toast ref={toastRef} position='center' opacity={0.9}/>
        </KeyboardAwareScrollView>
      )
}

const styles = StyleSheet.create({})