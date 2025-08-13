// your imports here
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import FlipCard from "./components/FlipCard";

const PRESET_TITLES = [
  "License", "Payment Card","Invoice", "Gift Card", "Identity Card", "Passport", "Password", "Other",
];

export default function FromGallery() {
   const navigation = useNavigation();
   const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [title, setTitle] = useState("Document");
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
const pickImageFromGallery = async (setter) => {
  setLoading(true);
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
    allowsEditing: true,
  });
  setLoading(false);

  if (!result.canceled && result.assets?.length > 0) {
    const originalUri = result.assets[0].uri;
    const fileName = originalUri.split('/').pop();
    const newPath = FileSystem.documentDirectory + fileName;

    try {
      await FileSystem.copyAsync({
        from: originalUri,
        to: newPath,
      });

      setter(newPath); // persistent URI
    } catch (err) {
      console.error("Error saving image to app storage:", err);
    }
  }
};

useFocusEffect(
  useCallback(() => {
    if (!frontImage) {
      pickImageFromGallery(setFrontImage);
    }
  }, [frontImage])
);


  useEffect(() => {
    if (params.front) setFrontImage(params.front);
    if (params.back) setBackImage(params.back);
  }, [params.front, params.back]);

  const addField = () => setFields([...fields, { key: "", value: "" }]);
  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };
  const updateField = (index, keyName, value) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [keyName]: value };
    setFields(updated);
  };

  const saveCard = async () => {
    let filteredFields = fields.filter((f) => f.key && f.value);
    let finalTitle = showCustomInput ? customTitle : title;
    // if (!frontImage || !filteredFields.length || !finalTitle) {
    //   console.warn("Missing data.");
    //   return;
    // }

    const newDoc = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      frontImage,
      backImage,
      fields: filteredFields,
      title: finalTitle,
      type: "Selected",
      timestamp: Date.now(),
    };

    try {
      const existing = await AsyncStorage.getItem("documents");
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.push(newDoc);
      await AsyncStorage.setItem("documents", JSON.stringify(parsed));
      router.replace("/");
    } catch (e) {
      console.error("Error saving:", e);
    }
  };
useFocusEffect(
  useCallback(() => {
    setFrontImage('');
    setBackImage('');
    setTitle('Document');
    setCustomTitle('');
    setShowCustomInput(false);
    setFields([{ key: '', value: '' }]);

    // Open gallery instead of camera
    pickImageFromGallery(setFrontImage);
  }, [])
);

   useLayoutEffect(() => {
     navigation.setOptions({
      
       headerTitleAlign: "center",
    headerLeft: () => (
           <View style={{ marginLeft: 10, 
          //  borderColor: 'black', 
          //  borderWidth: 1, 
           padding: 0, borderRadius: 1, width: '100%' }}>
             <Text style={{ fontSize: 17, fontWeight: '700', color: 'rgb(6, 63, 12)' }}>True Wallet</Text>
             {/* <Image style={{width:40, height:40}} source={require('../assets/images/icon.png')} /> */}
           </View>// invisible spacer to balance right icon
         ),  
         headerTitle: () => (
                 <View >

                 </View>
               ),
      
       headerRight: () => (
        <View >
        
         </View>
       ),
     });
   }, [navigation]);
  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor:'grey' }}>
    //   <StatusBar style="dark" />
        <ImageBackground
          source={require("../assets/Backround/backround.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
                  colors={["rgba(179, 154, 52, 0.24)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)",]}

            style={styles.gradientOverlay}
          >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
                {loading && (
                      <Modal transparent animationType="fade">
                        <View style={{
                          flex: 1,
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <View style={{
                            padding: 20,
                            backgroundColor: 'white',
                            borderRadius: 10
                          }}>
                            <Text style={{ marginBottom: 10 }}>Opening Gallery...</Text>
                            <ActivityIndicator size="large" color="#000" />
                          </View>
                        </View>
                      </Modal>
                    )}
          <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
             <View style={styles.formContainer} >
            <Text style={styles.title}>{title}</Text>

            {frontImage ? (
              <>
                <FlipCard frontImage={frontImage} backImage={backImage} />

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    setFrontImage(null);
                    setBackImage(null);
                  }}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.captureButton} onPress={() => pickImageFromGallery(setFrontImage)}>
                <Text style={styles.buttonText}> ✚  Capture Front</Text>
              </TouchableOpacity>
            )}

            {frontImage && !backImage && (
              <TouchableOpacity style={styles.captureButton} onPress={() => pickImageFromGallery(setBackImage)}>
                <Text style={styles.buttonText}>Capture Back (Optional)</Text>
              </TouchableOpacity>
            )}
<View
  style={{
    borderBottomColor: 'rgba(255, 255, 255, 0.37)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom:20
  }}
/>
            {/* Form Section */}

           <View style={styles.formContainer} >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {PRESET_TITLES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    (title === item || (item === "Other" && showCustomInput)) && styles.chipSelected,
                  ]}
                  onPress={() => {
                    if (item === "Other") {
                      setShowCustomInput(true);
                      setTitle("Other");
                    } else {
                      setShowCustomInput(false);
                      setCustomTitle("");
                      setTitle(item);
                    }
                  }}
                >
                  <Text style={{ color: title === item || (item === "Other" && showCustomInput) ? "#fff" : "#000" ,   fontWeight: "300", }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {showCustomInput && (
              <TextInput
                style={styles.input}
                placeholder="Custom title"
                value={customTitle}
                onChangeText={setCustomTitle}
                 placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
              />
            )}

            {fields.map((item, index) => (
              <View style={styles.fieldRow} key={index}>
                <TextInput
                placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                  style={styles.input}
                  placeholder="Card Number .."
                  value={item.key}
                  onChangeText={(text) => updateField(index, "key", text)}
                />
                <TextInput
                 placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                  style={styles.input}
                  placeholder="12XXX... 345.."
                  value={item.value}
                  onChangeText={(text) => updateField(index, "value", text)}
                />
                <TouchableOpacity onPress={() => removeField(index)}>
                  <Ionicons name="close-circle" size={24} color= "#000000ff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addField}>
              <Ionicons name="add-circle" size={22} color="#000000ff" />
              <Text style={styles.addBtnText}>Add Field</Text>
            </TouchableOpacity>
</View>
            {/* <TouchableOpacity
              style={[
                styles.saveButton,
                !frontImage ? styles.disabled : {},
              ]}
              onPress={saveCard}
              disabled={!frontImage ? true : false}
            >
              <Text style={styles.saveText}>Save Card</Text>
            </TouchableOpacity> */}
            </View>
             <View
              style={{
                backgroundColor: "rgba(0,0,0,0.05)",
                borderRadius: 10,
                marginHorizontal: 16,
                paddingVertical: 8,
                paddingHorizontal: 12,
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "rgba(0,0,0,0.7)",
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                🔒 Because of privacy, all cards and files are stored only on your device.
              </Text></View>
      <TouchableOpacity
              style={[
                styles.saveButton,
                !frontImage ? styles.disabled : {},
              ]}
              onPress={saveCard}
              disabled={!frontImage ? true : false}
            >
              <Text style={styles.saveText}>Save Card</Text>
            </TouchableOpacity>
          </ScrollView>
         
        </KeyboardAvoidingView>
        </LinearGradient>
      </ImageBackground>
      
    // </SafeAreaView>
  );
}
const styles = StyleSheet.create({
      backgroundImage: {
    flex: 1,
 
  },
   gradientOverlay: {
    flex: 1,
    // justifyContent: "flex-start",
  },
  container: {
    padding: 1,
    paddingBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#000000ff",
    marginVertical: 12,
    alignSelf: "center",
    textAlign: "center",
  },
  formContainer: {
    // backgroundColor: 'rgba(255, 255, 255, 0.07)',
    padding: 1,
    borderRadius: 10,
    marginVertical: 0,
    marginHorizontal: 0,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    // elevation: 5,
  },
  captureButton: {
    backgroundColor: "#ffffff0a",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#000000ff",
    fontWeight: "500",
  },
  removeButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#ff4d4d04",
  },
  removeText: {
    color: "#ff4d4d",
    fontSize: 14,
    fontWeight: "500",
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#00000009",
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#00000026",
  },
  chipSelected: {
    backgroundColor: "#000000ff",
    borderColor: "#00000090",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00000026",
    padding: 12,
    borderRadius: 10,
    marginRight: 6,
    fontSize: 15,
    marginVertical: 5,
    backgroundColor: "#0000000b",
    color: "#000000ff",
    fontWeight: "400",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 10,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    marginBottom: 24,
    marginTop: 8,
  },
  addBtnText: {
    color: "#000000ff",
    fontSize: 16,
    marginLeft: 6,
  },
  saveButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 16,
marginVertical:15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  saveText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
