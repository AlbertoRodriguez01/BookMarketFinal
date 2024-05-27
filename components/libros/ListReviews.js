import React, { useState, useCallback } from 'react'
import { Text, StyleSheet, View,ActivityIndicator } from 'react-native'
import { firebaseApp } from '../../utils/firebase'
import { getAuth } from 'firebase/auth'
import { Avatar, Button, Rating } from 'react-native-elements'
import moment from 'moment/min/moment-with-locales'
import { size, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import { getLibrosReviews } from '../../utils/actions'
 
const auth = getAuth(firebaseApp)
moment.locale("es")

export default function ListReviews({ navigation, idLibro }) {

    const [userLogged, setUserLogged] = useState(false)
    const [reviews, setReviews] = useState([])

    auth.onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getLibrosReviews(idLibro)
                if(response.statusResponse) {
                    setReviews(response.reviews)
                }
            })()
        }, [])
    )

    return (
        <View>
          {
            userLogged ? (
                <Button
                    title="Escribe una opinion del libro"
                    titleStyle={styles.btnTitleAddReview}
                    style={styles.btnAddReview}
                    onPress={() => navigation.navigate("Add-Review-Libro", { idLibro })}
                    icon={{
                        type:"material-community",
                        name:"square-edit-outline",
                        color:"#fff"
                    }}
                />
            ) : ( 
                <Text style={styles.mustLoginText} onPress={() => navigation.navigate("Login")}>
                    Para escriribir una opinion es necesario estar logueado.{" "}
                    <Text style={styles.loginText}>
                        Pulsa AQUI para iniciar sesion
                    </Text>
                </Text>
            )
          }
          {
            size(reviews) > 0 && (
                map(reviews, reviewDocument => (
                    <Review reviewDocument={reviewDocument}/>
                ))
            )
          }
        </View>
    )
}


function Review({ reviewDocument }){
    const { title, review, createAt, avatarUser, rating } = reviewDocument
    const createReview = new Date(createAt.seconds * 1000)

    return(
        <View style={styles.viewReview}>
            <View style={styles.imageAvatar}>
                <Avatar
                    renderPlaceholderContent={<ActivityIndicator color="#fff"/>}
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={
                        avatarUser ? { uri: avatarUser} : require("../../assets/avatar-default.jpg")
                    }
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Rating
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>{moment(createReview).format("LLL")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview:{
        backgroundColor:"transparent"
    },
    btnTitleAddReview:{
        color:"#fff"
    },
    mustLoginText:{
        textAlign:"center",
        color:"#36ADFC",
        padding:20
    },
    loginText:{
        fontWeight:"bold"
    },
    viewReview:{
        flexDirection:"row",
        padding:10,
        paddingBottom:20,
        borderBottomColor:"#e3e3e3",
        borderBottomWidth:1
    },
    imageAvatar:{
        marginRight:15
    },
    viewInfo:{
        flex:1,
        alignItems:"flex-start"
    },
    reviewTitle:{
        fontWeight:"bold"
    },
    reviewText:{
        paddingTop:2,
        color:"gray",
        marginBottom:5
    },
    reviewDate:{
        marginTop:5,
        color:"gray",
        fontSize:12,
        position:"absolute",
        right:0,
        bottom:0
    }
})
