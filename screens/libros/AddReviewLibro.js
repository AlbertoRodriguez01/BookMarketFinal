import React, {useState, useRef } from 'react'
import { Text, StyleSheet, View, TurboModuleRegistry } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { isEmpty } from 'lodash'
import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocumentById } from '../../utils/actions'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export default function AddReviewLibro({ navigation, route }) {

    const { idLibro } = route.params
    const toastRef = useRef()

    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [errorTitle, setErrorTitle] = useState(null)
    const [review, setReview] = useState("")
    const [errorReview, setErrorReview] = useState(null)
    const [loading, setLoading] = useState(false)

    const addReview = async() => {

        if(!validForm()){
            return
        }

        setLoading(true)

        const user = getCurrentUser()
        const data = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idLibro: idLibro,
            title,
            review,
            rating,
            createAt: new Date()
        }
        const responseAddReview = await addDocumentWithoutId("Reviews", data)
        if(!responseAddReview.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al enviar el comentario. Intenta mas tarde", 3000)
        }

        const responseGetLibro = await getDocumentById("Libros", idLibro)
        if(!responseGetLibro.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al obtener el libro. Intenta mas tarde", 3000)
        }

        const libro = responseGetLibro.document
        const ratingTotal = libro.ratingTotal + rating
        const quantityVoting = libro.quantityVoting + 1
        const ratingResult = ratingTotal / quantityVoting
        const responseUpdateLibro = await updateDocumentById("Libros", idLibro, {
            ratingTotal,
            quantityVoting, 
            rating: ratingResult
        })

        setLoading(false)

        if(!responseUpdateLibro.statusResponse) {
            toastRef.current.show("Error al actualizar el libro. Intenta mas tarde", 3000)
            return
        }

        navigation.goBack()
    }

    const validForm = () => {
        setErrorTitle(null)
        setErrorReview(null)
        let isValid = true
        
        if (!rating) { 
            toastRef.current.show("Debes darle una puntacion al libro.", 3000)
            isValid = false 
        }

        if (isEmpty(title)) {
            setErrorTitle("Debes ingresar un título a tu comentario.")
            isValid = false
        }

        if (isEmpty(review)) {
            setErrorReview("Debes ingresar un comentario.")
            isValid = false
        }

        return isValid
        
    }

    return (
        <KeyboardAwareScrollView style={styles.viewBody}>
          <View style={styles.viewRating}>
            <AirbnbRating
                count={5}
                reviews={["Malo", "Regular", "Normal", "Muy bueno", "Excelente"]}
                defaultRating={0}
                size={35}
                onFinishRating={(value) => setRating(value)}
            />
          </View>
          <View style={styles.formReview}>
            <Input
                placeholder='Titulo..'
                containerStyle={styles.input}
                onChange={(e) => setTitle(e.nativeEvent.text)}
                errorMessage={errorTitle}
            />
            <Input
                placeholder='Reseña..'
                containerStyle={styles.input}
                multiline
                sytle={styles.textArea}
                onChange={(e) => setReview(e.nativeEvent.text)}
                errorMessage={errorReview}
            />
            <Button
                title="Enviar comentario"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={addReview}
            />
          </View>
          <Toast ref={toastRef} position='center' opacity={0.9}/>
          <Loading isVisible={loading} text="Enviando comentario..."/>
        </KeyboardAwareScrollView>
      )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    },
    viewRating:{
        height:110,
        backgroundColor:"#f2f2f2"
    },
    formReview:{
        flex:1,
        alignItems: "center",
        margin:10,
        marginTop:40
    },
    input:{
        marginBottom:10
    },
    textArea:{
        height:150,
        width:"100%",
        padding:0,
        margin:0
    },
    btnContainer:{
        flex:1,
        justifyContent:"flex-end",
        marginTop:20,
        marginBottom:10,
        width:"95%"
    },
    btn:{
        backgroundColor: "#36ADFC"
    }
})
