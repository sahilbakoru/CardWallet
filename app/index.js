import { useRef } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text
} from "react-native";

const { height, width } = Dimensions.get("window");
const CARD_HEIGHT = 250;
const SPACING = 20;
const FULL_CARD_HEIGHT = CARD_HEIGHT + SPACING;

const cards = [
  { id: "1", name: "Visa Classic", balance: "$2,500" },
  { id: "2", name: "MasterCard Gold", balance: "$1,200" },
  { id: "3", name: "Amex Platinum", balance: "$5,750" },
  { id: "4", name: "RuPay Debit", balance: "$560" },
  { id: "5", name: "Business Card", balance: "$9,999" },
];

export default function Index() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
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
  outputRange: [0.8, 1.15, 0.8], // more zoom effect
  extrapolate: "clamp",
});

const opacity = scrollY.interpolate({
  inputRange,
  outputRange: [0.4, 1, 0.4], // dim non-focused cards
  extrapolate: "clamp",
});


          return (
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardBalance}>{item.balance}</Text>
            </Animated.View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(195, 215, 225, 1)",
  },
  card: {
    height: CARD_HEIGHT,
    width: width - 60,
    marginVertical: SPACING / 2,
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: "#222",
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  cardBalance: {
    fontSize: 24,
    color: "#aaa",
    fontWeight: "600",
  },
});
