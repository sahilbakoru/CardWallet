import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";
import { pickImage } from './GalleryInput';
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = 230;
const SPACING = 20;
const FULL_CARD_HEIGHT = CARD_HEIGHT + SPACING;

// const cards = [
//   { id: "1", image: require("../assets/cards/visa.png") },
//   { id: "2", image: require("../assets/cards/mastercard.png") },
//    {id: '3',image: require("../assets/cards/amexBlack.png") },
//   { id: "4", image: require("../assets/cards/amex.png") },
//   { id: "5", image: require("../assets/cards/rupay.png") }

// ];

export default function Index() {
    const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Add this state
  const [filteredCards, setFilteredCards] = useState([]); // Add this state

const [isGalleryOpening, setIsGalleryOpening] = useState(false);

  const [cards, setCards] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter(); 
  const backgroundImage = require("../assets/Backround/CardBackround.png");
  useFocusEffect(
    React.useCallback(() => {
      const loadCards = async () => {
        try {
          const stored = await AsyncStorage.getItem("documents");
          // console.log(stored,'stored')
          if (stored) {
            const parsed = JSON.parse(stored);
            // console.log(parsed,'parsed')
            setCards(parsed);
             setFilteredCards(parsed); // Initialize filteredCards with all cards
          }
        } catch (e) {
          console.error("Failed to load documents:", e);
        }
      };

      loadCards();
    }, [])
  );
    useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(card => {
        // Search in title
        if (card.title && card.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        // Search in fields
        if (card.fields) {
          return card.fields.some(field => 
            field.value && field.value.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        return false;
      });
      setFilteredCards(filtered);
    }
  }, [searchQuery, cards]);
   // Set the header button
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
       headerLeft: () => (
      <View style={{marginLeft: 10 , borderColor:'black', borderWidth:0, padding:5, borderRadius:10}}>
<Image style={{width:40, height:40}} source={require('../assets/images/icon.png')} />
      </View>// invisible spacer to balance right icon
    ),
      headerTitle: () => (
       
      <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#888"
            style={styles.searchInput}
            onChangeText={setSearchQuery} // Add this
          />
        </View>

    ),
      headerRight: () => (
        <TouchableOpacity
          style={{ marginRight: 15, }}
          onPress={() => {
            //  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Vibration.vibrate(60);
            setModalVisible(true)
            // You'll open modal here later
            console.log("Add document pressed");
          }}
        >
          <Ionicons name="add-circle-outline" size={30} color="#000000ff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation,searchQuery]);

  return (
    // <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
      
      // <StatusBar style="dark" />
    <ImageBackground
      source={require('../assets/Backround/backround.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(255, 208, 147, 0.56)", "rgba(133, 216, 255, 0.48)", "rgba(255, 174, 239, 0.52)",]}
        style={styles.container}
      >
        {isGalleryOpening && (
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
                    router.push({ pathname: "/ScanDocInput" });
                    console.log("Take Photo");
                  }}
                >
                  <View style={styles.bigButtonContent}>
                    <MaterialIcons name="document-scanner" size={24} color="black" style={{ marginRight: 10 }} />
                    <Text style={styles.bigButtonText}>Scan Document</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity
                  style={styles.bigButton}
                  onPress={async () => {
                    setModalVisible(false);
                     setIsGalleryOpening(true);
                    await pickImage(async (uri) => {
                     
                      const newDoc = {
                        id: Date.now().toString(),
                        frontImage: uri,
                        backImage: null,
                      };

                      try {
                        const existing = await AsyncStorage.getItem("documents");
                        const parsed = existing ? JSON.parse(existing) : [];
                        const updated = [...parsed, newDoc];

                        await AsyncStorage.setItem("documents", JSON.stringify(updated));
                        setCards(updated); // update state to show instantly
                      } catch (e) {
                        console.error("Failed to save document from gallery:", e);
                      }
                    });
                     setIsGalleryOpening(false);
                  }}
                >
                  <View style={styles.bigButtonContent}>
                    <MaterialIcons name="add-photo-alternate" size={24} color="black" style={{ marginRight: 10 }} />
                    <Text style={styles.bigButtonText}>Choose Photo</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.bigButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.push("./tabs/ManualInput");
                  }}
                >
                  <View style={styles.bigButtonContent}>
                    <Feather name="edit" size={24} color="black" style={{ marginRight: 10 }} />
                    <Text style={styles.bigButtonText}>Enter Manually</Text>
                  </View>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}



        {/* <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            //  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            Vibration.vibrate(60);
            setModalVisible(true)
            // You'll open modal here later
            console.log("Add document pressed");
          }}
        >
          <Text style={{ fontSize: 40, color: 'rgba(173, 172, 172, 1)' }}>+</Text>
        </TouchableOpacity> */}
        {filteredCards.length === 0 ? (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 }}>
    <Image
      source={require("../assets/images/emptyWallet.png")} // <-- place your empty state image here
      style={{
        width: 180,
        height: 180,
        marginBottom: 20,
        resizeMode: "contain"
      }}
    />
    <Text style={{ fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 8 }}>
      You have no cards
    </Text>
    <Text style={{ fontSize: 16, color: "#555", textAlign: "center", marginBottom: 20 }}>
      Looks like you don’t have any cards or documents saved at the moment.
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: "#000",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10
      }}
      onPress={() => setModalVisible(true)}
    >
      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
        Add Card
      </Text>
    </TouchableOpacity>
  </View>
) : (
        <Animated.FlatList
          data={filteredCards}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: (height - CARD_HEIGHT) / 2.5,  // chnage the cards position on screen 
          }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
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
              activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: "/cardDetails",
                    params: { id: item.id },
                  });
                }}
              >
                <Animated.View
                  style={[
                    styles.card,
                    {
                      transform: [{ scale }],
                      // opacity
                    },
                  ]}
                >
                  {item.frontImage ? (
                    // 📷 Image-based card
          
                    <Image
                      source={{ uri: item.frontImage }}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
           
                  ) : (
                    // 📝 Manual card
                    <ImageBackground
                      source={backgroundImage}
                      imageStyle={{ borderRadius: 16, opacity: 1 }}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: 16,
                        overflow: "hidden",
                        borderColor:'black',
                        borderWidth:0.3
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
                        <Text
                          key={`${item.id}`}
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#000000ff",
                            marginBottom: 12,
                            letterSpacing: 1.2,
                            textAlign: 'center'
                          }}
                        >
                          {item?.title || "Untitled"}
                        </Text>

                        {item.fields.slice(0, 2)?.map((field, index) => (
                          <View key={`field-${index}-${item.timestamp}`}>
                            <Text
                              style={{
                                fontSize: 15,
                                fontWeight: "500",
                                color: "#000000ff",
                                marginBottom: 6,
                              }}
                            >
                              {field.key}:{" "}
                              <Text style={{ color: "#454545ff", fontWeight: "600" }}>
                                {field.value}
                              </Text>
                            </Text>
                          </View>
                        ))}



                      </LinearGradient>
                    </ImageBackground>



                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          }}

        /> 
        )}
      </LinearGradient>

    </ImageBackground>
    
    // {/* </SafeAreaView> */}
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
   searchWrapper: {
    flexDirection:"row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    width: 200, // small enough to leave room for icons
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,

  },
  card: {
    height: CARD_HEIGHT,
    width: width - 60,
    marginVertical: SPACING / 5,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#00000008",
    padding: 0,
    justifyContent: "space-between",
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    overflow: "hidden",
      borderColor:'black',
    borderWidth:0.5

  },
  addButton: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    width: 69,
    height: 69,
    borderRadius: 60,
    backgroundColor: "rgba(75, 75, 75, 0.7)",
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
    tintColor: "rgba(255, 255, 255, 1)",
    color: "rgba(255, 255, 255, 1)",
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
    margin: 15,
    backgroundColor: "#e5e8e8ff",
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
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
    backgroundColor: "#e5e8e8ff",
    width: "100%",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 14,
    alignItems: "flex-start", // still aligns left
  },

  bigButtonContent: {
    flexDirection: "row",
    alignItems: "center", // <-- makes icon & text vertically centered
  },

  bigButtonText: {
    color: "#617880",
    fontSize: 20,
    fontWeight: "600",
  },


  cancelText: {
    marginTop: 35,
    color: "red",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },



});
