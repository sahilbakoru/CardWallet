import { Feather, Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from "expo-file-system";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
import EditCardModal from './components/EditCardModal';
import ActionModal from './components/LikeButton';
import ShareModal from './components/ShareModal';

const { width } = Dimensions.get("window");
// ...imports stay unchanged

export default function CardDetails() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [card, setCard] = useState(null);
    const [viewerVisible, setViewerVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [visible, setIsVisible] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
const [likeModalVisible, setLikeModalVisible] = useState(false);
const [deleteAnimation, setDeleteAnimation]= useState(false);
const [editModalVisible, setEditModalVisible] = useState(false);
const [isLiked, setIsLiked] = useState(card?.isLiked || false);
  const backgroundImage = require("../assets/Backround/CardBackround.png");
  // Prepare images array
  const images = [];
  if (card?.frontImage) images.push({ uri: card.frontImage });
  if (card?.backImage) images.push({ uri: card.backImage });



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
        setIsLiked(found?.isLiked || false); 
          setIsFront(true);
      flipAnim.setValue(0); 
      } catch (e) {
        console.error("Failed to load card:", e);
      }
    };
    fetchCard();
  }, [id]);
   useFocusEffect(
    useCallback(() => {
      // Reset states
      setCard(null);
      setIsFront(true);
      flipAnim.setValue(0);
      setViewerVisible(false);
      setCurrentImage('');
      setCopiedItem(null);
      setModalVisible(false);
      setEditModalVisible(false);
      setLikeModalVisible(false)
    setDeleteAnimation(false)
    setIsLiked(false); 
      const fetchCard = async () => {
        try {
          const stored = await AsyncStorage.getItem('documents');
          const parsed = stored ? JSON.parse(stored) : [];
          const found = parsed.find((doc) => doc.id === id);
          if (found) {
            setCard(found);
            setIsLiked(found?.isLiked || false);
          } else {
            Alert.alert('Error', 'Card not found');
            router.back();
          }
        } catch (e) {
          console.error('Failed to load card:', e);
          Alert.alert('Error', 'Failed to load card');
        }
      };
      fetchCard();
      // Cleanup function to reset states when screen loses focus
      return () => {
        setCard(null);
      };
    }, [id])
  );
     useLayoutEffect(() => {
     navigation.setOptions({
      
       headerTitleAlign: "center",
    headerLeft: () => (
           <View style={{ marginLeft: 10, 
          //  borderColor: 'black', 
          //  borderWidth: 1, 
           padding: 0, borderRadius: 1, width: '100%' }}>
             <Text style={{ fontSize: 17, fontWeight: '700', color: 'rgb(6, 63, 12)' }}>True Wallet</Text>
             {/* <Image style={{width:40, height:40}} source={require('../assets/images/icon.png')} /> */}
           </View>// invisible spacer to balance right icon
         ),  
         headerTitle: () => (
                 <View >

                 </View>
               ),
      
       headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 20, gap: 15 }}>
        <TouchableOpacity 
        style={{ marginRight: 10, }}
        onPress={() => setEditModalVisible(true)}
        >
          <Feather name="edit-3" size={30} color="black" />
        </TouchableOpacity>
         <TouchableOpacity
           style={{ marginRight: 10, }}
          onPress={() => setModalVisible(true)}
         >
           <Ionicons name="share-outline" size={30} color="black" />
         </TouchableOpacity>
         </View>
       ),
     });
   }, [navigation]);
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
// Add handleLike function to toggle like state
const handleLike = async () => {
  if(!isLiked) {setLikeModalVisible(true)}

  try {
    const newLikeState = !isLiked;
    setIsLiked(newLikeState);
    
    // Update AsyncStorage with new isLiked value
    const stored = await AsyncStorage.getItem('documents');
    const parsed = stored ? JSON.parse(stored) : [];
    const updatedDocs = parsed.map((doc) =>
      doc.id === id ? { ...doc, isLiked: newLikeState } : doc
    );
    await AsyncStorage.setItem('documents', JSON.stringify(updatedDocs));
  } catch (e) {
    console.error('Failed to update like status:', e);
    Alert.alert('Error', 'Failed to update like status');
  }
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
           setDeleteAnimation(true)
            const timer = setTimeout(() => {
        router.back();
      }, 4000);
      return () => clearTimeout(timer); // Cleanup timer
        
          
        } catch (e) {
          setLikeModalVisible(false)
          alert("Something went wrong !")
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


  if (!card) return <Text style={{ color: "black", padding: 20, alignItems:'center',justifyContent:'center' ,fontSize:40}}>Loading...</Text>;


//
const handleSaveCard = async (updatedCard) => {
  try {
    const stored = await AsyncStorage.getItem('documents');
    const parsed = stored ? JSON.parse(stored) : [];
    const updatedDocs = parsed.map((doc) =>
      doc.id === id ? { ...updatedCard, id, timestamp: doc.timestamp, frontImage: doc.frontImage, backImage: doc.backImage, isLiked: doc.isLiked } : doc
    );
    await AsyncStorage.setItem('documents', JSON.stringify(updatedDocs));
    setCard(updatedCard);
    setEditModalVisible(false);
  } catch (e) {
    console.error('Failed to update card:', e);
    Alert.alert('Error', 'Failed to save changes');
  }
};
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
      colors={["rgba(179, 154, 52, 0.24)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)","rgba(255, 255, 255, 1)",]}
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
              <Fontisto name="spinner-refresh" size={22} color="black" />
              <Text style={styles.flipButtonText}>
                {"Flip "}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Card info section */}
  <View style={styles.detailsContainer}>
  <View style={styles.cardHeader}>
    <MaterialIcons name="wallet" size={35} color="black" /><Text style={styles.cardTitle}>{card.title || "Untitled"}</Text>
   <View style={{marginLeft:'5%'}}>
    <TouchableOpacity onPress={handleLike}>
        <Text>
          {isLiked ? <AntDesign name="heart" size={24} color="rgba(255, 0, 55, 1)" /> : <AntDesign name="hearto" size={24} color="black" />}
        </Text>
      </TouchableOpacity>
    <ActionModal        
         visible={likeModalVisible}
        onClose={() => setLikeModalVisible(false)}
        actionType={"like"} size={100} time={1500}  />
        </View>
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
        {card.timestamp ? new Date(card.timestamp).toLocaleDateString() : "N/A"} <Fontisto name="date" size={15} color="black" />
      </Text>
    </View>
  </View>
  <TouchableOpacity 
        style={styles.actionButton} 
        onPress={() => setViewerVisible(true)}
        disabled={images.length === 0}
      ><Ionicons name="image-outline" size={25} color="black" />
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

        <TouchableOpacity style={styles.deleteButton} onPress={()=> handleDelete()}>
  <AntDesign name="delete" size={22} color="red" /><Text style={styles.deleteText}>Delete Card</Text>
        </TouchableOpacity>
 <ShareModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  card={card} 
/>
<ActionModal        
         visible={deleteAnimation}
        onClose={() => setDeleteAnimation(false)}
        actionType={"delete"} size={100} time={4000}  />
      </View>
     
    </LinearGradient>
     </ScrollView>
   <EditCardModal
  visible={editModalVisible}
  onClose={() => setEditModalVisible(false)}
  card={card}
  onSave={handleSaveCard}
/>
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
gap:"5%"
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
    fontSize: 18,
    fontWeight: "500",
    color: "#000000dd",
    textTransform: "capitalize",

  },
  detailValue: {
    fontSize: 18,
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
     marginLeft:8
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
     flexDirection: "row",
  },
  deleteText: {
    color: "#ff4d4d",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginLeft:8
  },
});

