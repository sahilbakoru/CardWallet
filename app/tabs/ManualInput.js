import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useState } from "react";
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
import ActionModal from '../components/LikeButton';

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
    const navigation = useNavigation();
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [title, setTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [saveAnimation, setSaveAnimation] =useState(false)
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
   setSaveAnimation(true)
            const timer = setTimeout(() => {
         router.replace("/");
      }, 1500);
      return () => clearTimeout(timer); // Cleanup timer
  };
  useFocusEffect(
    useCallback(() => {
      // Reset all form fields when screen is focused
      setTitle("");
      setCustomTitle("");
      setShowCustomInput(false);
      setFields([{ key: "", value: "" }]);
      setSaveAnimation(false)
    }, [])
  );

  //  header 
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
    <ImageBackground
        source={require("../../assets/Backround/backround.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
            colors={["rgba(179, 154, 52, 0.24)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)",]}
              // colors={["rgba(255, 208, 147, 0.56)", "rgba(133, 216, 255, 0.48)", "rgba(255, 174, 239, 0.52)",]}
            style={styles.gradientOverlay}
          >
      <ScrollView
      showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        // style={{ backgroundColor: '#fff' }}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create Document</Text>

          <View style={styles.card}>
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

          <View style={styles.formContainer}>
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
                      fontSize: 16,
                      fontWeight: '400',
                      color:
                        title === item || (item === "Other" && showCustomInput)
                          ? '#fff'
                          : '#000',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {showCustomInput && (
              <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                <TextInput
                  style={styles.input}
                  placeholder="Custom title"
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                />
              </View>
            )}

            <View style={{ marginTop: 20 }}>
              {fields.map((item, index) => (
                <View style={styles.fieldRow} key={index}>
                  <TextInput
                    placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                    style={styles.input}
                    placeholder="Name..."
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
                  <TouchableOpacity onPress={() => removeField(index)}>
                    <Ionicons name="close-circle" size={24} color="#000" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={addField}>
              <Ionicons name="add-circle" size={24} color="#000" />
              <Text style={styles.addBtnText}>Add Field</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <View style={styles.privacyNotice}>
            <Text style={styles.privacyText}>
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
        <ActionModal        
         visible={saveAnimation}
        onClose={() => setSaveAnimation(false)}
        actionType={"save"} size={100} time={2000}  />
      </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
    </ImageBackground>
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
    flex: 1,
    padding: 5,
    paddingTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    width: width - 40,
    height: 230,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  cardField: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginVertical: 4,
  },
  cardFieldValue: {
    fontWeight: '400',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    color: '#000',
    marginVertical: 5,
  },
  addBtn: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
    marginLeft: 10,
  },
  addBtnText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 25,
  },
  footerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 15,
  },
  privacyNotice: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
});