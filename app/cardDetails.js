import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
// ...imports stay unchanged

export default function CardDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const backgroundImage = require("../assets/Backround/CardBackround.png");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const stored = await AsyncStorage.getItem("documents");
        const parsed = stored ? JSON.parse(stored) : [];
        const found = parsed.find((doc) => doc.id === id);
        console.log(found,'card details')
        setCard(found);
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
            const updated = parsed.filter((doc) => doc.id !== id);
            await AsyncStorage.setItem("documents", JSON.stringify(updated));
            router.back();
          } catch (e) {
            console.error("Failed to delete card:", e);
          }
        },
      },
    ]);
  };

  if (!card) return <Text style={{ color: "white", padding: 20 }}>Loading...</Text>;

  const imageToShow = isFlipped && card.backImage ? card.backImage : card.frontImage;

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
    <StatusBar style="dark" />
  <ImageBackground
    source={require("../assets/Backround/backround.png")}
    style={styles.backgroundImage}
    resizeMode="cover"
  >
    <LinearGradient
      colors={["rgba(0, 0, 0, 0.78)", "rgba(75, 75, 75, 0.7)"]}
      style={styles.gradientOverlay}
    >
      <View style={styles.container}>

        {/* CARD IMAGE (Animated if back exists, else just front image) */}
     <View style={[
    styles.card,
    { overflow: card?.backImage ? "visible" : "hidden" }
  ]} >
  {card.frontImage ? (
    <>
      {/* Front Image */}
      <Animated.View
        style={[styles.flipCard, flipToFrontStyle, { zIndex: isFront ? 1 : 0 }]}
      >
        <Image
          source={{ uri: card.frontImage }}
          style={styles.cardImage}
        />
      </Animated.View>

      {/* Back Image */}
      {card.backImage && (
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
      imageStyle={{ borderRadius: 16 }}
      style={styles.cardBackground}
    >
      <LinearGradient
        colors={["#8abc7f53", "#e1857e4e", "#7fbcb853", "#c6c85b4a"]}
        style={styles.cardContent}
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
              <FontAwesome6 name="arrows-rotate" size={18} color="white" />
              <Text style={styles.flipButtonText}>
                {isFlipped ? "Show Front" : "Flip "}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Card info section */}
        <View style={styles.detailsBox}>
          <Text style={styles.detailsTitle}>Card Info</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={styles.detailValue}>National ID</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Issued:</Text>
            <Text style={styles.detailValue}>2019-07-23</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expires:</Text>
            <Text style={styles.detailValue}>2029-07-23</Text>
          </View>
        </View>

        <Text style={styles.text}>Card ID: {id}</Text>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Card</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </ImageBackground>
  </SafeAreaView>
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
    paddingTop: 40,
  },
  card: {
    width: width - 32,
    height: 230,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    // shadowColor: "#000",
    // shadowOpacity: 0.15,
    // shadowRadius: 12,
    // shadowOffset: { width: 0, height: 4 },
    // elevation: 6,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
  cardBackground: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 10,
    textAlign: "center",
  },
  cardField: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    lineHeight: 20,
  },
  cardFieldValue: {
    fontWeight: "600",
    color: "#444",
  },
  flipButton: {
    backgroundColor: "#f1f2f60d",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffffff",
  },
  flipButtonContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8, // or use marginRight if gap isn't supported in your RN version
},

  text: {
    fontSize: 14,
    color: "#dcdcdc",
    marginTop: 10,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  detailsBox: {
    width: width - 40,
    backgroundColor: "#ffffff09",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffffff",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontWeight: "600",
    color: "#fcfcfcff",
  },
  detailValue: {
    color: "#f5f5f5ff",
    fontWeight: "500",
  },
  flipCard: {
  position: "absolute",
  width: "100%",
  height: "100%",
  backfaceVisibility: "hidden",
  borderRadius: 16,
},
flipCardBack: {
  position: "absolute",
  top: 0,
  backfaceVisibility: "hidden",
},

});
