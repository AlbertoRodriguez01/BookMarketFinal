import React, { useState } from 'react'
import { Text, StyleSheet, View, Alert } from 'react-native'
import { Avatar, Button, Icon, Image, Input } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash'
import { loadImageFromGallery, fileToBlob } from '../../utils/helpers'
import { getDownloadURL, ref, uploadBytes, getStorage } from 'firebase/storage';
import { doUpdateProfile } from '../../utils/actions';
import { firebaseApp } from '../../utils/firebase'
import shortid from 'shortid';

export default function InfoUser({ user, setLoading, setLoadingText }) {

    const [photoUrl, setPhotoUrl] = useState(user.photoURL)


    return (
        <View style={styles.container}>
         <Avatar 
            rounded
            size="large"
            source={
                photoUrl
                ? {uri: photoUrl}
                : require('../../assets/avatar-default.jpg')
            }
         />
         <View style={styles.infoUser}>
            <Text style={styles.displayName}>
                {
                    user.displayName ? user.displayName : "Anonimo"
                }
            </Text>
            <Text>{user.email}</Text>
         </View>
        </View>
      )
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row",
        backgroundColor:"#f9f9f9",
        paddingVertical:30
    },
    infoUser:{
        marginLeft:20
    },
    displayName:{
        fontWeight:"bold",
        paddingBottom:5
    },
    btnChangePhoto: {
        marginTop: 10,
        backgroundColor: "#36ADFC"
    }
})