import { useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
export default function CardDetails() {
const cards = [
  { id: "1", image: require("../assets/cards/visa.png") },
  { id: "2", image: require("../assets/cards/mastercard.png") },
  { id: "3", image: require("../assets/cards/amex.png") },
  { id: "4", image: require("../assets/cards/rupay.png") },
];
const {id} = useLocalSearchParams();
// let id 
console.log(id, 'id ')
// let id = params.id


  const card = cards.find((c) => c.id == id);

  return (
     <View style={styles.container}>
      <Image source={card?.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Card ID: {id}</Text>
     
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
    height: 250,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
  },
});
