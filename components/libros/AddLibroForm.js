import React, {useState } from 'react'
import { Text, StyleSheet, View, ScrollView, Alert, Dimensions} from 'react-native'
import { Avatar, Button, Icon, Image, Input } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash'
import { loadImageFromGallery } from '../../utils/helpers'
import { fileToBlob } from '../../utils/helpers';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { firebaseApp } from '../../utils/firebase'
import shortid from 'shortid';
import { addDocumentWithoutId, getCurrentUser } from '../../utils/actions'


const widthScreen = Dimensions.get("window").width

export default function AddLibroForm({ toastRef, setLoading, navigation }) {

    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescripcion, setErrorDescripcion] = useState(null)
    const [errorPrecio, setErrorPrecio] = useState(null)
    const [errorAutor, setErrorAutor] = useState(null)
    const [errorEditorial, setErrorEditorial] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    const addLibro = async() => {
        console.log(formData)
        if (!validForm()) {
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()
        const libro = {
            name: formData.name,
            descripcion: formData.descripcion,
            precio: formData.precio,
            autor: formData.autor,
            editorial: formData.editorial,
            images: responseUploadImages,
            createAt: new Date(),
            createdBy: getCurrentUser().uid,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0
        }   
        const responseAddDocument = await addDocumentWithoutId("Libros", libro)
        setLoading(false)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al guardar el libro. Intenta mas tarde", 3000)
            return
        }
        
        navigation.navigate("Libros")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const result = { statusResponse: false, error: null, url: null };
                const storage = getStorage(firebaseApp);
                const storageRef = ref(storage, 'libros/Lid_' + shortid.generate());
                const blob = await fileToBlob(image);
                try {
                    await uploadBytes(storageRef, blob);
                    const url = await getDownloadURL(storageRef);
                    result.statusResponse = true;
                    result.url = url
                } catch (error) {
                    result.error = error.message;
                }
                
                if(result.statusResponse){
                    imagesUrl.push(result.url)  
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if(isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre del libro")
            isValid = false
        }

        if(isEmpty(formData.descripcion)) {
            setErrorDescripcion("Debes ingresar una sinopsis para libro")
            isValid = false
        }

        if(isEmpty(formData.precio)) {
            setErrorPrecio("Debes ingresar el precio del libro")
            isValid = false
        }

        if(isEmpty(formData.autor)) {
            setErrorAutor("Debes ingresar el autor del libro")
            isValid = false
        }

        if(isEmpty(formData.editorial)) {
            setErrorEditorial("Debes ingresar la editorial del libro")
            isValid = false
        }

        if(size(imagesSelected) === 0){
            toastRef.current.show("Debes agregar al menos una imagen del libro")
            isValid = false
        }

        return isValid
    }

    const clearErrors = () =>{
        setErrorPrecio(null)
        setErrorDescripcion(null)
        setErrorName(null)
        setErrorAutor(null)
        setErrorEditorial(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageLibro imageLibro={imagesSelected[0]}/>
          <FormAdd
            formData={formData}
            setFormData={setFormData}
            errorName={errorName}
            errorDescripcion={errorDescripcion}
            errorPrecio={errorPrecio}
            errorAutor={errorAutor}
            errorEditorial={errorEditorial}
          />
          <UploadImage
            toastRef={toastRef}
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
          />
          <Button 
            title="Agregar Libro"
            onPress={addLibro}
            buttonStyle={styles.btnAddLibro}
          />
        </ScrollView>
      )
}

function ImageLibro({ imageLibro }){
    return (
        <View style={styles.viewPhoto}>
            <Image 
                style={{width:widthScreen, height: 200}}
                source={
                    imageLibro ? {uri: imageLibro }: require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {

    const imageSelected = async() => {
        const response = await loadImageFromGallery([2, 3])
        if(!response.status) {
            toastRef.current.show("No haz seleccionado ninguna imagen", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert("Eliminar imagen", "¿Estas seguro que quieres eliminar la imagen?", [
            {
                text:"No",
                style:"cancel"
            },
            {
                text:"Si",
                onPress: () => {
                    setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== image)
                    )
                }
            }
        ],{
            cancelable: true
        })
    }

    return (
        <ScrollView horizontal style={styles.viewImages}>
            {
                size(imagesSelected) < 5 && (<Icon 
                                type='material-community'
                                name='camera'
                                color="#7a7a7a"
                                containerStyle={styles.containerIcon}
                                onPress={imageSelected}
                            />)
            }
            {map(imagesSelected, (imageLibro, index) => (
                <Avatar
                    key={index}
                    style={styles.miniatureStyle}
                    source={{uri: imageLibro}}
                    onPress={() => removeImage(imageLibro)}
                />
            ))}
        </ScrollView>
    )
}

function FormAdd({ formData, setFormData, errorName, errorDescripcion, errorPrecio, errorAutor, errorEditorial}) {

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text })
    }

    return(
        <View style={styles.viewForm}>
            <Input
                placeholder='Nombre del libro'
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder='Sinopsis'
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.descripcion}
                onChange={(e) => onChange(e, "descripcion")}
                errorMessage={errorDescripcion}
            />
            <Input
                placeholder='Autor'
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.autor}
                onChange={(e) => onChange(e, "autor")}
                errorMessage={errorAutor}
            />
            <Input
                placeholder='Editorial'
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.editorial}
                onChange={(e) => onChange(e, "editorial")}
                errorMessage={errorEditorial}
            />
            <Input
                placeholder='Precio'
                defaultValue={formData.precio}
                onChange={(e) => onChange(e, "precio")}
                errorMessage={errorPrecio}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        name: "",
        descripcion: "",
        precio: "",
        autor:"",
        editorial:""
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        height:"100%"
    },
    viewForm:{
        marginHorizontal:10
    },
    textArea:{
        height:100,
        width:"100%"
    },
    btnAddLibro:{
        margin:20,
        backgroundColor:"#36ADFC"
    },
    viewImages:{
        flexDirection:"row",
        marginHorizontal:20,
        marginTop: 30
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:79,
        backgroundColor:"#e3e3e3"
    },
    miniatureStyle:{
        width:70,
        height:70,
        marginRight:10
    },
    viewPhoto:{
        alignItems:"center",
        height:200,
        marginBottom:20
    }
})