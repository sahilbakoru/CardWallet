import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Dimensions,
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
const { width } = Dimensions.get("window");
const PRESET_TITLES = [
  "License",
  "Payment Card",
  "Gift Card",
  "Identity Card",
  "Passport",
  "Password",
  "Other",
];

export default function ManualInput() {
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const router = useRouter();
  const backgroundImage = require("../../assets/Backround/CardBackround.png");
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
    const filteredFields = fields.filter((f) => f.key && f.value);
    if (!filteredFields.length || !(title || customTitle)) return;

    const cardData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: "Manual",
      fields: filteredFields,
      timestamp: Date.now(),
      title: showCustomInput ? customTitle : title,
    };

    const existing = await AsyncStorage.getItem("documents");
    const parsed = existing ? JSON.parse(existing) : [];
    parsed.push(cardData);
    await AsyncStorage.setItem("documents", JSON.stringify(parsed));

    router.replace("/");
  };
useFocusEffect(
  useCallback(() => {
    // Reset all form fields when screen is focused
    setTitle("");
    setCustomTitle("");
    setShowCustomInput(false);
    setFields([{ key: "", value: "" }]);
  }, [])
);
return (
  // <SafeAreaView style={{ flex: 1,backgroundColor: 'grey'  }}>
  //       <StatusBar style="dark" />
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: 'white' }}
    >
      <View style={styles.formContainer} >
      <View style={styles.container}>
        <Text style={styles.title}>Create Document</Text>
     
     <View style={styles.card} >

    <ImageBackground
                          source={backgroundImage}
                          imageStyle={{ borderRadius: 16, opacity: 1 }}
                          style={{
                            height: "100%",
                            width: "100%",
                            borderRadius: 16,
                            overflow: "hidden",
                          }}
                        >
                          <LinearGradient
                            colors={["#8abc7f53", "#e1857e4e", "#7fbcb853", "#c6c85b4a"]}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: 16,
                              padding: 20,
                              justifyContent: "center",
                            }}
                          >
        <Text style={styles.cardTitle}>
          {showCustomInput ? customTitle : title || "Untitled"}
        </Text>
        {fields?.slice(0, 3).map((field, index) => (
          <View key={`field-${index}`}>
            <Text style={styles.cardField}>
              {field.key}:{" "}
              <Text style={styles.cardFieldValue}>{field.value}</Text>
            </Text>
          </View>
        ))}
      </LinearGradient>
    </ImageBackground>
</View>
     <View style={styles.formContainer} >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PRESET_TITLES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                (title === item || (item === "Other" && showCustomInput)) &&
                  styles.chipSelected,
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
              <Text
                style={{
                  color:
                    title === item || (item === "Other" && showCustomInput)
                      ? "#333"
                      : "#333",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showCustomInput && (
          <View style={{marginHorizontal:10, marginTop:10}}>
          <TextInput
            style={styles.input}
            placeholder="Custom title"
            value={customTitle}
            onChangeText={setCustomTitle}
          />
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          {fields.map((item, index) => (
            <View style={styles.fieldRow} key={index}>
              <TextInput
               placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                style={styles.input}
                 placeholder= {"Name... "} 
                value={item.key}
                onChangeText={(text) => updateField(index, "key", text)}
              />
              <TextInput
               placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                style={styles.input}
               placeholder="XXX..345.."
                value={item.value}
                onChangeText={(text) => updateField(index, "value", text)}
              />
              <TouchableOpacity  onPress={() => removeField(index)}>
                <Ionicons name="close-circle" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addField}>
          <Ionicons name="add-circle" size={22} color="#000000ff"  />
          <Text style={styles.addBtnText}>Add Field</Text>
        </TouchableOpacity>
</View>
        {/* <TouchableOpacity
          style={[
            styles.saveBtn,
            !fields.some((f) => f.key && f.value) || (!title && !customTitle)
              ? styles.disabled
              : {},
          ]}
          onPress={saveCard}
          disabled={
            !fields.some((f) => f.key && f.value) || (!title && !customTitle)
          }
        >
          <Text style={styles.saveBtnText}>Save Card</Text>
        </TouchableOpacity> */}
      </View>
      </View>
    </ScrollView>
    <View style={{ backgroundColor: "#ffffffff",}}>
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
    </Text>
  </View>
      <TouchableOpacity
          style={[
            styles.saveBtn,
            !fields.some((f) => f.key && f.value) || (!title && !customTitle)
              ? styles.disabled
              : {},
          ]}
          onPress={saveCard}
          disabled={
            !fields.some((f) => f.key && f.value) || (!title && !customTitle)
          }
        >
          <Text style={styles.saveBtnText}>Save Card</Text>
        </TouchableOpacity>
        </View>
    
  </KeyboardAvoidingView>
  // </TouchableWithoutFeedback>
  // </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 1,
    paddingBottom:20,
    marginVertical:10,

  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    marginHorizontal:10,
    alignSelf:'center'
  },
    card: {
    width: width - 40,
    height: 230,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    alignSelf:'center'
  },
   cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000ff",
    textTransform: "capitalize",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginHorizontal:10
  },
    formContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    padding: 5,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal:5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
    backgroundColor: "#00000020",
    borderColor: "#00000090",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 10,
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
  saveBtn: {
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
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
