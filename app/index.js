import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef } from "react";

import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity
} from "react-native";
const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = 250;
const SPACING = 20;
const FULL_CARD_HEIGHT = CARD_HEIGHT + SPACING;

const cards = [
  { id: "1", image: require("../assets/cards/visa.png") },
  { id: "2", image: require("../assets/cards/mastercard.png") },
  { id: "3", image: require("../assets/cards/amex.png") },
  { id: "4", image: require("../assets/cards/rupay.png") },
];

export default function Index() {
  const scrollY = useRef(new Animated.Value(0)).current;
 const router = useRouter(); // ✅
  return (
    <LinearGradient
      colors={["#617880ff", "#e5e8e8ff"]}
      style={styles.container}
    >
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
              onPress={() =>
                router.push({
                  pathname: "/cardDetails",
                  params: { id: item.id },
                })
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
    borderRadius: 16,
  },
});
