import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LibrosStack from './LibrosStack'
import FavoritesStack from './FavoritesStack'
import AccountStack from './AccountStack'
import { Icon } from 'react-native-elements'



const Tab = createBottomTabNavigator()

export default function Navigation(){

    

    const screenOptions = (route, color) => {
        let iconName
        switch(route.name){
            case "Libros":
                iconName = "book-open-variant"
                break;
            case "Favoritos":
                iconName = "cart-variant"
                break;
            case "Cuenta":
                iconName = "account"
                break;
        }

        return (
            <Icon
                type='material-community'
                name={iconName}
                size={22}
                color={color}
            />
        )
    }


    return (
      <NavigationContainer>
        <Tab.Navigator 
            initialRouteName='Libros'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color }) => screenOptions(route, color),
                inactiveTintColor: "#0B4167",
                activeTintColor: "#36ADFC"
            })}
        >
            <Tab.Screen
                name="Libros"
                component={LibrosStack}
                options={{title: "Libros", headerShown:false}}
            />
            <Tab.Screen
                name="Favoritos"
                component={FavoritesStack}
                options={{title: "Carrito", headerShown:false}}
            />
            <Tab.Screen
                name="Cuenta"
                component={AccountStack}
                options={{title: "Cuenta", headerShown:false}}
            />
        </Tab.Navigator>
      </NavigationContainer>
    )
}
