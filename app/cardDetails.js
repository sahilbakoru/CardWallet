import { Feather, FontAwesome6, Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from "expo-file-system";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import ImageView from "react-native-image-viewing";

const { width } = Dimensions.get("window");
// ...imports stay unchanged

export default function CardDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
    const [viewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [visible, setIsVisible] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  const backgroundImage = require("../assets/Backround/CardBackround.png");
  // Prepare images array
  const images = [];
  if (card?.frontImage) images.push({ uri: card.frontImage });
  if (card?.backImage) images.push({ uri: card.backImage });

// useFocusEffect(
//   useCallback(() => {
//     const fetchCard = async () => {
//       try {
//         const stored = await AsyncStorage.getItem("documents");
//         const parsed = stored ? JSON.parse(stored) : [];
//         const found = parsed.find((doc) => doc.id === id);
//         console.log(found, 'card details');
//         setCard(found);
//       } catch (e) {
//         console.error("Failed to load card:", e);
//       }
//     };

//     fetchCard();
//   }, [id])
// );

useFocusEffect(
  useCallback(() => {
    setIsFront(true);
    flipAnim.setValue(0);
  }, [])
);
  useEffect(() => {
    const fetchCard = async () => {
      try {
        const stored = await AsyncStorage.getItem("documents");
        const parsed = stored ? JSON.parse(stored) : [];
        const found = parsed.find((doc) => doc.id === id);
        console.log(found,'card details')
        setCard(found);
          setIsFront(true);
      flipAnim.setValue(0); 
      } catch (e) {
        console.error("Failed to load card:", e);
      }
    };
    fetchCard();
  }, [id]);
const flipAnim = useRef(new Animated.Value(0)).current;
const [isFront, setIsFront] = useState(true);
const frontInterpolate = flipAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ["0deg", "180deg"],
});

const backInterpolate = flipAnim.interpolate({
  inputRange: [0, 180],
  outputRange: ["180deg", "360deg"],
});

const flipToFrontStyle = {
  transform: [{ rotateY: frontInterpolate }],
};

const flipToBackStyle = {
  transform: [{ rotateY: backInterpolate }],
};
const triggerFlip = () => {
  const toValue = isFront ? 180 : 0;

  Animated.timing(flipAnim, {
    toValue,
    duration: 800,
    easing: Easing.inOut(Easing.ease),
    useNativeDriver: true,
  }).start();

  setIsFront(!isFront);
};

const handleDelete = async () => {
  Alert.alert("Delete", "Are you sure you want to delete this card?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          const stored = await AsyncStorage.getItem("documents");
          const parsed = stored ? JSON.parse(stored) : [];

          // Find the card being deleted
          const card = parsed.find((doc) => doc.id === id);

          // Delete front/back images if they exist
          if (card?.frontImage) {
            const info = await FileSystem.getInfoAsync(card.frontImage);
            if (info.exists) await FileSystem.deleteAsync(card.frontImage);
          }

          if (card?.backImage) {
            const info = await FileSystem.getInfoAsync(card.backImage);
            if (info.exists) await FileSystem.deleteAsync(card.backImage);
          }

          // Remove the card from storage
          const updated = parsed.filter((doc) => doc.id !== id);
          await AsyncStorage.setItem("documents", JSON.stringify(updated));

          router.back();
        } catch (e) {
          console.error("Failed to delete card and images:", e);
        }
      },
    },
  ]);
};
  const handleCopy = async (text, fieldName) => {
    try {
      await Clipboard.setStringAsync(text);
      console.log("item codded :" , text)
      setCopiedItem(fieldName);
  setTimeout(() => setCopiedItem(null), 1500); // Reset after 1.5 seconds
      // Alert.alert('Copied!', 'Text copied to clipboard');
    } catch (error) {
      console.error('Failed to copy text:', error);
      Alert.alert('Error', 'Failed to copy text');
    }
  };


  if (!card) return <Text style={{ color: "white", padding: 20 }}>Loading...</Text>;

// Prepare images array
 
return (
  // <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
  //   <StatusBar style="dark" />
  <ImageBackground
    source={require("../assets/Backround/backround.png")}
    style={styles.backgroundImage}
    resizeMode="cover"
  >
     < ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} >
    <LinearGradient
      colors={["rgba(255, 255, 255, 1)", "rgba(255, 255, 255, 1)"]}
        // colors={["rgba(255, 208, 147, 0.56)", "rgba(133, 216, 255, 0.48)", "rgba(255, 174, 239, 0.52)",]}
      style={styles.gradientOverlay}
    >
    
      <View style={styles.container}>

        {/* CARD IMAGE (Animated if back exists, else just front image) */}
     <View style={[
    styles.card,
    { overflow: card?.backImage ? "visible" : "hidden" }
  ]} >
  {card?.frontImage ? (
    <>
      {/* Front Image */}
      <Animated.View
        style={[styles.flipCard, flipToFrontStyle, { zIndex: isFront ? 1 : 0 }]}
      >
        <Image
          source={{ uri: card?.frontImage }}
          style={styles.cardImage}
        />
      </Animated.View>

      {/* Back Image */}
      {card?.backImage && (
        <Animated.View
          style={[
            styles.flipCard,
            styles.flipCardBack,
            flipToBackStyle,
            { zIndex: isFront ? 0 : 1 },
          ]}
        >
          <Image
            source={{ uri: card.backImage }}
            style={styles.cardImage}
          />
        </Animated.View>
      )}
    </>
  ) : (
    // Fallback UI for manually added card (no frontImage)
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
          {card.title || "Untitled"}
        </Text>
        {card.fields?.slice(0, 3).map((field, index) => (
          <View key={`field-${index}-${card.timestamp}`}>
            <Text style={styles.cardField}>
              {field.key}:{" "}
              <Text style={styles.cardFieldValue}>{field.value}</Text>
            </Text>
          </View>
        ))}
      </LinearGradient>
    </ImageBackground>
  )}
</View>


        {/* Flip button only if back image exists */}
        {card.backImage && (
          <TouchableOpacity style={styles.flipButton} onPress={triggerFlip}>
            <View style={styles.flipButtonContent}>
              <FontAwesome6 name="arrows-rotate" size={18} color="rgb(0,0,0)" />
              <Text style={styles.flipButtonText}>
                {"Flip "}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Card info section */}
  <View style={styles.detailsContainer}>
  <View style={styles.cardHeader}>
    <Text style={styles.cardTitle}>{card.title || "Untitled"}</Text>
    <View style={styles.statusIndicator} />
  </View>
  <View style={styles.cardBody}>
    {/* Type Row */}
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>Type</Text>
      <Text style={styles.detailValue}>{card.type || "N/A"}</Text>
    </View>

    {/* Custom Fields (Dynamic) */}
    {card.fields?.map((field, index) => (
                  <View style={styles.detailRow} key={`field-${index}`}>
                    <Text style={styles.detailLabel}>{field.key.trim()}</Text>
                    <TouchableOpacity 
                      style={styles.copyContainer}
                      onPress={() => handleCopy(field.value, field.key)}
                    >
                      <Text style={styles.detailValue}>{field.value}</Text>
                      {copiedItem === field.key ? (
    <Feather name="check" size={17} color="rgba(39, 131, 0, 1)"  />
  ) : (
    <Feather name="copy" size={16} color="rgb(0,0,0)"  />
  )}
                    </TouchableOpacity>
                  </View>
                ))}

    {/* Timestamp Row */}
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>Date Added</Text>
      <Text style={styles.detailValue}>
        {card.timestamp ? new Date(card.timestamp).toLocaleDateString() : "N/A"}
      </Text>
    </View>
  </View>
  <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => setViewerVisible(true)}
        disabled={images.length === 0}
      >
        <Text style={styles.actionText}>
          View Images ({images.length})
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#000000ff" />
      </TouchableOpacity>
<ImageView
        images={images}
        imageIndex={0}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        doubleTapToZoomEnabled
        swipeToCloseEnabled
        backgroundColor="rgba(0,0,0,0.9)"
       
        
      />
     
</View>

        <Text style={styles.text}>Card ID: {id}</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Card</Text>
        </TouchableOpacity>
      </View>
     
    </LinearGradient>
     </ScrollView>
   
  </ImageBackground>
  // </SafeAreaView>
);

}
const CARD_HEIGHT = 230;
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
   
  },

  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  card: {
    width: width - 40,
    height: 230,
    borderRadius: 20,
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
  flipCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 20,
  },
  flipCardBack: {
    position: "absolute",
    top: 0,
    backfaceVisibility: "hidden",
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000ff",
    marginLeft: 8,
  },
  flipButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.13)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    backdropFilter: "blur(10px)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#00000022",
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000ff",
    textTransform: "capitalize",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#38a169",
  },
  cardBody: {
    paddingVertical: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#00000015",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000dd",
    textTransform: "capitalize",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "400",
    color: "#000000ff",
    textAlign: "right",
    maxWidth: "100%",
    paddingHorizontal: 4, 
    paddingVertical:2
    //    borderColor:'black',
    // borderWidth:1
  },
   copyContainer: {
    flexDirection: 'row',
    alignItems: "center",
 
  },
  copyIcon: {
    marginLeft: 2,
  },
  viewerContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    backgroundColor: "#00000010",
  },
  actionText: {
    color: "#000000ff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    color: "#808080ff",
    marginTop: 10,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d20",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 12,
    marginTop: 10,
  },
  deleteText: {
    color: "#ff4d4d",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

