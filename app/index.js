import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = 250;
const SPACING = 20;
const FULL_CARD_HEIGHT = CARD_HEIGHT + SPACING;

const cards = [
  { id: "1", image: require("../assets/cards/visa.png") },
  { id: "2", image: require("../assets/cards/mastercard.png") },
   {id: '3',image: require("../assets/cards/amexBlack.png") },
  { id: "4", image: require("../assets/cards/amex.png") },
  { id: "5", image: require("../assets/cards/rupay.png") }
  
];

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
 const router = useRouter(); // ✅


  return (
    
    <LinearGradient
      colors={["#617880ff", "#e5e8e8ff","#5a737bff"]}
      style={styles.container}
    >
{modalVisible && (
  <Modal
    visible={modalVisible}
    transparent
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
  >
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      />

      <View style={styles.bottomSheet}>
        <View style={styles.dragIndicator} />
        
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => {
            setModalVisible(false);
            console.log("Take Photo");
          }}
        >
          <Text style={styles.bigButtonText}>📷 Scan Document</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => {
            setModalVisible(false);
            console.log("Choose from Gallery");
          }}
        >
          <Text style={styles.bigButtonText}>🖼️ Choose Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => {
            setModalVisible(false);
            console.log("Custom");
          }}
        >
          <Text style={styles.bigButtonText}>📝 Enter manually</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}



       <TouchableOpacity
      style={styles.addButton}
      onPress={() => {
  //  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
Vibration.vibrate(60);
setModalVisible(true)
        // You'll open modal here later
        console.log("Add document pressed");
      }}
    >
     <Text style={{ fontSize: 40 }}>+</Text>
    </TouchableOpacity>
      <Animated.FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: (height - CARD_HEIGHT) / 2,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * FULL_CARD_HEIGHT,
            index * FULL_CARD_HEIGHT,
            (index + 1) * FULL_CARD_HEIGHT,
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [0.8, 1.15, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollY.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
             <TouchableOpacity
              onPress={() =>{
                router.push({
                  pathname: "/cardDetails",
                  params: { id: item.id },
                })
                Vibration.vibrate(60)}
              }
            >

              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ scale }],
                    opacity,
                  },
                ]}
              >
                <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    height: CARD_HEIGHT,
    width: width - 60,
    marginVertical: SPACING / 2,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "rgba(3, 62, 15, 0)",
    padding: 0,
    justifyContent: "space-between",
    shadowColor: "rgba(64, 64, 64, 0.53)",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    overflow: 'hidden'
  },
 addButton: {
  position: "absolute",
  bottom: 60,               
  alignSelf: "center",         
  width: 69,
  height: 69,
  borderRadius: 60,
  backgroundColor: "#617880d7",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  shadowColor: "#000",
  shadowOpacity: 0.7,
  shadowOffset: { width: 0, height: 4 },
  shadowRadius: 60,
  // elevation: 1,
},
addIcon: {
  width: 24,
  height: 24,
  tintColor: "#333",         // Dark icon
},
modalContainer: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0, 0, 0, 0)", // transparent upper area
},

modalBackdrop: {
  flex: 1, // this allows tap to dismiss modal
},

bottomSheet: {
  margin:15,
  backgroundColor: "#e5e8e8ff",
  paddingTop: 16,
  paddingBottom: 30,
  paddingHorizontal: 20,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  borderBottomEndRadius:24,
  borderBottomStartRadius:24,
  elevation: 5,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.2,
  shadowRadius: 6,
},

dragIndicator: {
  width: 40,
  height: 5,
  borderRadius: 3,
  backgroundColor: "#ccc",
  alignSelf: "center",
  marginBottom: 20,
},

bigButton: {
  backgroundColor: "#617880",
  width: "100%",
  paddingVertical: 18,
  paddingHorizontal:15,
  borderRadius: 14,
  alignItems: "left",
  marginBottom: 14,
},

bigButtonText: {
  color: "white",
  fontSize: 18,
  fontWeight: "600",
  
},

cancelText: {
  marginTop: 8,
  color: "red",
  fontSize: 16,
  fontWeight: "500",
  textAlign: "center",
},



});
