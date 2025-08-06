// your imports here
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import FlipCard from "./components/FlipCard";

const PRESET_TITLES = [
  "License", "Payment Card", "Gift Card", "Identity Card", "Passport", "Password", "Other",
];

export default function ScanDocInput() {
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

const pickImage = async (setter) => {
  setLoading(true);
  const result = await ImagePicker.launchCameraAsync({
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

      setter(newPath); // this is the persistent URI
    } catch (err) {
      console.error("Error saving image to app storage:", err);
    }
  }
};

  useEffect(() => {
    if (!frontImage) pickImage(setFrontImage);
  }, []);

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
      type: "scan",
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'grey' }}>
      <StatusBar style="dark" />
        <ImageBackground
          source={require("../assets/Backround/backround.png")}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(79, 65, 47, 0.7)", "rgba(48, 81, 96, 0.55)", "rgba(75, 49, 70, 0.78)",]}
            style={styles.gradientOverlay}
          >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView  contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Document</Text>

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
              <TouchableOpacity style={styles.captureButton} onPress={() => pickImage(setFrontImage)}>
                <Text style={styles.buttonText}> ✚  Capture Front</Text>
              </TouchableOpacity>
            )}

            {frontImage && !backImage && (
              <TouchableOpacity style={styles.captureButton} onPress={() => pickImage(setBackImage)}>
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
                      setTitle("");
                    } else {
                      setShowCustomInput(false);
                      setCustomTitle("");
                      setTitle(item);
                    }
                  }}
                >
                  <Text style={{ color: title === item || (item === "Other" && showCustomInput) ? "#fff" : "#fff" ,   fontWeight: "300", }}>
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
                 placeholderTextColor={'rgba(255, 255, 255, 0.37)'}
              />
            )}

            {fields.map((item, index) => (
              <View style={styles.fieldRow} key={index}>
                <TextInput
                placeholderTextColor={'rgba(255, 255, 255, 0.37)'}
                  style={styles.input}
                  placeholder="Card Number .."
                  value={item.key}
                  onChangeText={(text) => updateField(index, "key", text)}
                />
                <TextInput
                 placeholderTextColor={'rgba(255, 255, 255, 0.37)'}
                  style={styles.input}
                  placeholder="12XXX... 345.."
                  value={item.value}
                  onChangeText={(text) => updateField(index, "value", text)}
                />
                <TouchableOpacity onPress={() => removeField(index)}>
                  <Ionicons name="close-circle" size={24} color= "#dadadaff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addField}>
              <Ionicons name="add-circle" size={22} color="#dadadaff" />
              <Text style={styles.addBtnText}>Add Field</Text>
            </TouchableOpacity>

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
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    paddingBottom: 60,
  },
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    padding: 5,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "300",
    color: "#ffffffff",
    marginVertical: 18,
    alignSelf:'center'
  },
  captureButton: {
    backgroundColor: "#7373732a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffffff",
    fontWeight: "300",
  },
  removeButton: {
    alignSelf: "flex-end",
    // backgroundColor: "#ffdad5ff",
    paddingVertical: 1,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  removeText: {
    color: "#d40000ff",
    fontSize: 14,
   fontWeight: "400",
  },
  chip: {
    paddingHorizontal: 19,
    paddingVertical: 8,
    backgroundColor: "#7373732a",
       fontWeight: "300",
    borderRadius: 20,
    marginRight: 10,
      borderColor:"#b1b0b0d0",
    borderWidth:0.5,
  },
  chipSelected: {
    backgroundColor: "#2C3E50",
    borderColor:"#ffffff89",
  },
  input: {
    flex: 1,
    borderWidth: 1,
       borderColor:"#ffffff22",
    padding: 10,
    borderRadius: 8,
    marginRight: 4,
    fontSize: 15,
    marginVertical:5,
backgroundColor: "#7373732a",
       fontWeight: "300",
       color:'rgba(255, 255, 255, 1)',
  },
  fieldRow: {
 flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal:10
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  addBtnText: {
    color: "#dadadaff",
    fontSize: 16,
    marginLeft: 3,
  },
  saveButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
