import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import FlipCard from "./components/FlipCard";

export default function ScanDocInput() {
  const [frontImage, setFrontImage] = useState('');
  const [backImage, setBackImage] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Auto-launch camera for front image on first load if none exists
  useEffect(() => {
    if (!frontImage) {
      pickImage(setFrontImage);
    }
  }, []);

  // Handle route param updates (if using router.push with params)
  useEffect(() => {
    if (params.front) setFrontImage(params.front);
    if (params.back) setBackImage(params.back);
  }, [params.front, params.back]);

return (
   <LinearGradient colors={["#617880ff", "#e5e8e8ff", "#5a737bff"]} style={styles.container}>
  <Text style={styles.title}>Scan Your Document</Text>

  {frontImage ? (
    <>
      {frontImage && (
  <FlipCard frontImage={frontImage} backImage={backImage} />
)}

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

    {/* Save Button */}
    {frontImage && (
     <TouchableOpacity
  style={styles.saveButton}


onPress={async () => {
  console.log("save pressed");

  if (!frontImage) {
    console.warn("❗ frontImage is missing");
    return;
  }

  const newDoc = {
    id: Date.now().toString(),
    frontImage,
    backImage,
  };

  try {
    console.log("Fetching existing documents from AsyncStorage...");
    const existing = await AsyncStorage.getItem("documents");
    console.log("existing:", existing);

    const parsed = existing ? JSON.parse(existing) : [];
    console.log("parsed:", parsed);

    const updated = [...parsed, newDoc];
    console.log("Saving updated documents:", updated);
    await AsyncStorage.setItem("documents", JSON.stringify(updated));

    console.log("✅ Document saved successfully!");
    router.back(); // Or router.push("/") if you're using expo-router
  } catch (e) {
    console.error("❌ Error in saving document:", e);
  }
}}


>
  <Text style={styles.saveText}>Save Document</Text>
</TouchableOpacity>

    )}
  </LinearGradient>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FB",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#F7F9FB",
    marginVertical: 30,
    alignSelf:'center'
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495E",
    marginBottom: 8,
  },
  captureButton: {
    backgroundColor: "#E3EAF2",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    color: "#2C3E50",
    fontWeight: "500",
  },
  preview: {
    width: "100%",
    height: "30%",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#D0D3D4",
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
});

