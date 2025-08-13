import Fontisto from '@expo/vector-icons/Fontisto';
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 230;

export default function FlipCard({ frontImage, backImage }) {
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
    Animated.timing(flipAnim, {
      toValue: isFront ? 180 : 0,
      duration: 700,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsFront(!isFront);
  };

  if (!frontImage) return null;

  return (
    <View style={styles.wrapper}>
      <View style={[
    styles.card,
    { overflow: backImage ? "visible" : "hidden" }
  ]} >
        {/* FRONT */}
        <Animated.View
          style={[styles.flipCard, flipToFrontStyle, { zIndex: isFront ? 1 : 0 }]}
        >
          <Image source={{ uri: frontImage }} style={styles.cardImage} />
        </Animated.View>

        {/* BACK */}
        {backImage && (
          <Animated.View
            style={[
              styles.flipCard,
              styles.flipCardBack,
              flipToBackStyle,
              { zIndex: isFront ? 0 : 1 },
            ]}
          >
            <Image source={{ uri: backImage }} style={styles.cardImage} />
          </Animated.View>
        )}
      </View>

      {backImage && (
        <TouchableOpacity style={styles.flipButton} onPress={triggerFlip}>
          <View style={styles.flipButtonContent}>
            <Fontisto name="spinner-refresh" size={20} color="black" />
            <Text style={styles.flipButtonText}>Flip</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 1,
  },
  card: {
    width: width - 32,
    height: CARD_HEIGHT,
    borderRadius: 16,
    // overflow: "",
    backgroundColor: "#00000009",
  },
  flipCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 16,
  },
  flipCardBack: {
    top: 0,
    backfaceVisibility: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 16,
  },
  flipButton: {
    marginTop: 10,
    backgroundColor: "#00000017",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  flipButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#000000e4",
  },
});
