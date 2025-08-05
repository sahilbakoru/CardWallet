// your imports here
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from "react";
import {
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
      setter(result.assets[0].uri);
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
      <LinearGradient colors={[ "#e5e8e8ff", "#e5e8e8ff"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView  contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <Text style={styles.title}>Scan Your Document</Text>

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
                <Text style={styles.buttonText}>Capture Front Side</Text>
              </TouchableOpacity>
            )}

            {frontImage && !backImage && (
              <TouchableOpacity style={styles.captureButton} onPress={() => pickImage(setBackImage)}>
                <Text style={styles.buttonText}>Capture Back Side (Optional)</Text>
              </TouchableOpacity>
            )}
<View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom:20
  }}
/>
            {/* Form Section */}

            {/* <Text style={styles.label}>Select a Title</Text> */}
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
                  <Text style={{ color: title === item || (item === "Other" && showCustomInput) ? "#fff" : "#333" }}>
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
              />
            )}

            {fields.map((item, index) => (
              <View style={styles.fieldRow} key={index}>
                <TextInput
                  style={styles.input}
                  placeholder="Label"
                  value={item.key}
                  onChangeText={(text) => updateField(index, "key", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Value"
                  value={item.value}
                  onChangeText={(text) => updateField(index, "value", text)}
                />
                <TouchableOpacity onPress={() => removeField(index)}>
                  <Ionicons name="close-circle" size={24} color="#999" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addField}>
              <Ionicons name="add-circle" size={22} color="#007AFF" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  // title: {
  //   fontSize: 22,
  //   fontWeight: "600",
  //   color: "#fff",
  //   marginBottom: 20,
  //   marginTop: 30,
  //   alignSelf: "center",
  // },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "black",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000ff",
    marginVertical: 30,
    alignSelf:'center'
  },
  captureButton: {
    backgroundColor: "#bac3cdff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  removeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#E74C3C",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 25,
  },
  removeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 8,
      borderColor:'black',
    borderWidth:0.5,
  },
  chipSelected: {
    backgroundColor: "#007AFF",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 15,
    marginVertical:5,
    backgroundColor:'white'
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
  },
  addBtnText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 6,
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
