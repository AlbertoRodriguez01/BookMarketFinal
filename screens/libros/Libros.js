import React, { useState, useEffect, useCallback } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { getCurrentUser, getLibros, getMoreLibros, isUserLogged } from '../../utils/actions'
import Loading from '../../components/Loading'
import { useFocusEffect } from '@react-navigation/native'

import { firebaseApp } from '../../utils/firebase'
import { getAuth } from 'firebase/auth'
import ListLibros from '../../components/libros/ListLibros'
import { size } from 'lodash'
 
const auth = getAuth(firebaseApp)

export default function Libros({ navigation }) {
  
  const [user, setUser] = useState(null)
  const [startLibro, setStartLibro] = useState(null)
  const [libros, setLibros] = useState([])
  const [loading, setLoading] = useState(false)

  const limitLibros = 7

  useEffect(() => {
    auth.onAuthStateChanged((userInfo) => {
      userInfo ? setUser(true) : setUser(false)
  })
  }, [])


  useFocusEffect(
    useCallback(() => {
      async function getData(){
        setLoading(true)
        const response = await getLibros(limitLibros)
        if(response.statusResponse){
          setStartLibro(response.startLibro)
          setLibros(response.libros)
        }
        setLoading(false)
      }
      getData()
    }, [])
  )

  const handeLoadMore = async() => {
    if(!startLibro) {
      return
    }

    setLoading(true)
    const response = await getMoreLibros(limitLibros, startLibro)
      if(response.statusResponse){
        setStartLibro(response.startLibro)
        setLibros(...libros, ...response.libros)
      }
    setLoading(false)
  }

  if (user === null) {
    return <Loading isVisible={true} text="Cargando..."/>
  }

  return (
    <View style={styles.viewBody}>
      {
        size(libros) > 0 ? (
          <ListLibros libros={libros} navigation={navigation} handeLoadMore={handeLoadMore}/>
        ) : (
          <View style={styles.notFoundView}>
              <Text style={styles.notFoundText}> No hay libros registrados </Text>
          </View>
        )
      }
        {
          user && ( 
            <Icon 
            type="material-community"
            name="plus"
            color="#36ADFC"
            reverse
            containerStyle={styles.btnContainer}
            onPress={() => {
              navigation.navigate("Add-Libro")
            }}
          /> )
        }
        <Loading isVisible={loading} text="Cargando libros"/>
    </View>
  )
}

const styles = StyleSheet.create({
  viewBody:{
    flex:1
  },
  btnContainer:{
    position:"absolute",
    bottom:10,
    right:10,
    shadowColor:"black",
    shadowOffset: { width:2, height:2},
    shadowOpacity: 0.5
  },
  notFoundView:{
    felx:1,
    justifyContent:"center",
    alignItems:"center"
  },
  notFoundText:{
    fontSize:18,
    fontWeight:"bold"
  }
})
