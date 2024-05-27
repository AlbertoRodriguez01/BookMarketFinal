import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { Alert } from 'react-native'

export function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email)
}

export const loadImageFromGallery = async(array) => {
    const response = {status: false, image: null }
    const resultPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!resultPermissions.granted) {
        Alert.alert("Debes otorgar permiso para acceder a tu galeria.")
        return response
    }
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: array
    })
    if (result.canceled) {
        return response
    }
    response.status = true
    if (result.assets.length > 0) {
        response.image = result.assets[0].uri
    }
    return response
}

export const fileToBlob = async (path) => {
    const response = await fetch(path);
    const blob = await response.blob();
    return blob;
};
