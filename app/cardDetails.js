import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

export default function CardDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [card, setCard] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const stored = await AsyncStorage.getItem("documents");
        const parsed = stored ? JSON.parse(stored) : [];
        const found = parsed.find((doc) => doc.id === id);
        console.log(found, 'doc info')
        setCard(found);
      } catch (e) {
        console.error("Failed to load card:", e);
      }
    };

    fetchCard();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this card?", [
      {
        text: "Cancel",
        style: "cancel",
      },
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

  if (!card) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {card.frontImage && (
        <Image source={{ uri: card.frontImage }} style={styles.image} />
      )}
      {card.backImage && (
        <Image source={{ uri: card.backImage }} style={styles.image} />
      )}
      <Text style={styles.text}>Card ID: {id}</Text>
      <Button title="Delete Card" color="red" onPress={handleDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: "100%",
    height: '30%',
    marginBottom: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
  },
});
