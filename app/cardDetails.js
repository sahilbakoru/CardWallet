import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

export default function CardDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
  const backgroundImage = require("../assets/Backround/CardBackround.png");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const stored = await AsyncStorage.getItem("documents");
        const parsed = stored ? JSON.parse(stored) : [];
        const found = parsed.find((doc) => doc.id === id);
        console.log(found, "card data ")
        setCard(found);
      } catch (e) {
        console.error("Failed to load card:", e);
      }
    };
    fetchCard();
  }, [id]);

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

  return (
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
          <View style={styles.card}>
            {card.frontImage ? (
              <Image source={{ uri: card.frontImage }} style={styles.cardImage} />
            ) : (
              <ImageBackground
                source={backgroundImage}
                imageStyle={{ borderRadius: 16, opacity: 1 }}
                style={styles.cardBackground}
              >
                <LinearGradient
                  colors={["#8abc7f53", "#e1857e4e", "#7fbcb853", "#c6c85b4a"]}
                  style={styles.cardContent}
                >
                  <Text
                    key={`${card.id}`}
                    style={styles.cardTitle}
                  >
                    {card.title || "Untitled"}
                  </Text>

                  {card.fields?.slice(0,3).map((field, index) => (
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

          <Text style={styles.text}>Card ID: {id}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteText}>Delete Card</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const CARD_HEIGHT = 230;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  gradientOverlay: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: CARD_HEIGHT,
    width: width - 60,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#fffefeff",
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardBackground: {
    height: "100%",
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardContent: {
    height: "100%",
    width: "100%",
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000ff",
    marginBottom: 12,
    letterSpacing: 1.2,
    textAlign: "center",
  },
  cardField: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000ff",
    marginBottom: 6,
  },
  cardFieldValue: {
    color: "#454545ff",
    fontWeight: "600",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: "white",
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
