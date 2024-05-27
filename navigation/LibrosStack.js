import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Libros from '../screens/libros/Libros'
import AddLibro from '../screens/libros/AddLibro'
import Libro from '../screens/libros/Libro'
import AddReviewLibro from '../screens/libros/AddReviewLibro'

const Stack = createStackNavigator()

export default function LibrosStack() {
  return(
    <Stack.Navigator>
        <Stack.Screen
            name="Libros"
            component={Libros}
            options={{title: "Libros"}}
        />
        <Stack.Screen
            name="Add-Libro"
            component={AddLibro}
            options={{title: "Agregar Libro"}}
        />
        <Stack.Screen
            name="Libro"
            component={Libro}
        />
        <Stack.Screen
            name="Add-Review-Libro"
            component={AddReviewLibro}
            options={{title: "Nuevo comentario"}}
        />
    </Stack.Navigator>
  )
}
