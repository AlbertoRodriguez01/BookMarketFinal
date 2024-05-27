import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import Favorites from '../screens/Favorites'
import PagoCarrito from '../screens/PagoCarrito'

const Stack = createStackNavigator()

export default function FavoritesStack() {
  return(
    <Stack.Navigator>
        <Stack.Screen
            name="Favoritos"
            component={Favorites}
            options={{title: "Carrito"}}
        />
        <Stack.Screen
            name="Pago"
            component={PagoCarrito}
            options={{title: "Formulario de Pago"}}
        />
    </Stack.Navigator>
  )
}
