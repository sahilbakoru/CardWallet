import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

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
      type: "manual",
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

return (
  // <SafeAreaView style={{ flex: 1,backgroundColor: 'grey'  }}>
  //       <StatusBar style="dark" />
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: 'white' }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Add Document Details</Text>

        <Text style={styles.label}>Select a Title</Text>
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
                      ? "#fff"
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
              <TouchableOpacity  onPress={() => removeField(index)}>
                <Ionicons name="close-circle" size={24} color="#999" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addField}>
          <Ionicons name="add-circle" size={22} color="#007AFF" />
          <Text style={styles.addBtnText}>Add Field</Text>
        </TouchableOpacity>

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
    </ScrollView>
    
  </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
  // </SafeAreaView>
);

}

const styles = StyleSheet.create({
  container: {
    padding: 1,
    paddingBottom:20,
    marginVertical:40,

  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 46,
    marginVertical:10,
    marginHorizontal:10,
    alignSelf:'center'
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
        marginHorizontal:10
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    marginRight: 8,
    borderColor:'black',
    borderWidth:0.5,
        marginHorizontal:10
  },
  chipSelected: {
    backgroundColor: "#007AFF",
     borderWidth:0,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal:10
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
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal:10,
    justifyContent:'center',
  },
  addBtnText: {
    color: "#007AFF",
    fontSize: 16,
    marginLeft: 6,
   marginHorizontal:10,
   marginVertical:10
  },
  saveBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
        marginHorizontal:10
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
