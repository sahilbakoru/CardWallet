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
  <SafeAreaView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
    <StatusBar style="dark" />
    <LinearGradient colors={['#ffffff', '#e6ecf2']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Scan Your Document</Text>
            <View style={styles.underline} />
          </View>

          <View style={styles.imageSection}>
            {frontImage ? (
              <>
                <FlipCard frontImage={frontImage} backImage={backImage} style={styles.card} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    setFrontImage(null);
                    setBackImage(null);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => pickImage(setFrontImage)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Capture Front Side</Text>
              </TouchableOpacity>
            )}
            {frontImage && !backImage && (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => pickImage(setBackImage)}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>Capture Back Side (Optional)</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.formSection}>
            <View style={styles.chipWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                    activeOpacity={0.7}
                  >
                    <Text style={styles.chipText}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {showCustomInput && (
              <TextInput
                style={styles.input}
                placeholder="Custom title"
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholderTextColor="#718096"
              />
            )}

            {fields.map((item, index) => (
              <View style={styles.fieldRow} key={index}>
                <TextInput
                  style={styles.input}
                  placeholder="Label"
                  value={item.key}
                  onChangeText={(text) => updateField(index, "key", text)}
                  placeholderTextColor="#718096"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Value"
                  value={item.value}
                  onChangeText={(text) => updateField(index, "value", text)}
                  placeholderTextColor="#718096"
                />
                <TouchableOpacity onPress={() => removeField(index)} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={24} color="#e53e3e" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.addBtn}
              onPress={addField}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={22} color="#2b6cb0" />
              <Text style={styles.addBtnText}>Add Field</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !frontImage ? styles.disabled : {},
              ]}
              onPress={saveCard}
              disabled={!frontImage ? true : false}
              activeOpacity={0.7}
            >
              <Text style={styles.saveText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3748',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  underline: {
    height: 2,
    width: 50,
    backgroundColor: '#2b6cb0',
    marginTop: 5,
    borderRadius: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  captureButton: {
    backgroundColor: '#edf2f7',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  buttonText: {
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#fc8181',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    borderBottomColor: '#e2e8f0',
    borderBottomWidth: 1,
    marginBottom: 25,
  },
  formSection: {
    padding: 10,
  },
  chipWrapper: {
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#edf2f7',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  chipSelected: {
    backgroundColor: '#2b6cb0',
    borderColor: '#2c5282',
  },
  chipText: {
    color: '#2d3748',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    padding: 10,
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  addBtnText: {
    color: '#2b6cb0',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#2b6cb0',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
