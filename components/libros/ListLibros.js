import { size } from 'lodash'
import React from 'react'
import { Text, StyleSheet, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListLibros({ libros, navigation, handeLoadMore}) {
    return (
        <View>
          <FlatList
            data={libros}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handeLoadMore}
            renderItem={(libro) => (
                <Libro libro={libro} navigation={navigation}/>
            )}
          />
        </View>
      ) 
}

function Libro({ libro, navigation, handeLoadMore}){
    const { id, images, name, descripcion, precio, autor, editorial } = libro.item
    const imageLibro = images[0]

    const goLibro = () => {
        navigation.navigate("Libro", {id, name})
    }

    return (
        <TouchableOpacity onPress={goLibro}>
            <View style={styles.viewLibro}>
                <View style={styles.viewLibroImage}>
                    <Image 
                        resizeMode='cover'
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{uri: imageLibro}}
                        style={styles.imgLibro}
                    />
                </View>
            
            <View>
                <Text style={styles.libroName}>{name}</Text>
                <Text style={styles.libroDescripcion}>
                {
                    size(descripcion) > 0 ? `${descripcion.substr(0, 60)}...` : descripcion
                }
                </Text>
                <Text style={styles.libroAutor}>Autor: {autor}</Text>
                <Text style={styles.libroDescripcion}>Editorial: {editorial}</Text>
                <Text style={styles.libroPrecio}>${precio}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewLibro:{
        flexDirection:"row",
        margin:10
    },
    viewLibroImage:{
        marginRight:15
    },
    imgLibro:{
        width:90,
        height:90
    },
    libroName:{
        fontWeight:"bold"
    },
    libroDescripcion:{
        paddingTop:2,
        color:"grey",
        width:"75%"
    },
    libroPrecio:{
        paddingTop:2,
        color:"grey"
    },
    libroAutor:{
        paddingTop:2,
        fontWeight:"semibold"
    }
})
