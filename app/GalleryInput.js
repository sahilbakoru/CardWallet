import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';


export const pickImage = async (onImageSelected) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission required', 'We need access to your photo library!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 1,
  });
console.log(result, 'result after image selection');
  if (!result.canceled) {
    const uri = result.assets[0].uri;
    console.log("Image URI:", uri);
    onImageSelected(uri); // callback to your component to handle save
  } else {
    console.log("Image selection canceled");
  }
};

