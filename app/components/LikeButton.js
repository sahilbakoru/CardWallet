// LikeButton.js
import AntDesign from '@expo/vector-icons/AntDesign';
import LottieView from 'lottie-react-native';
import { useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
const LikeButton = ({ size = 40 }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
let tempLike  = !isLiked;
    setIsLiked(!isLiked);
    // Button animation: Scale up and back
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Show modal with larger heart animation
    if(tempLike) {setModalVisible(true) } 
     
    Animated.sequence([
      Animated.timing(modalScale, {
        toValue: 1.5,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
 if(tempLike) {
    // Hide modal after 1 second
    setTimeout(() => {
      setModalVisible(false);
      modalScale.setValue(1); // Reset modal scale
    }, 1300);
  };
}
  return (
    <View style={styles.container}>
      {/* Like Button */}
      <TouchableOpacity onPress={handlePress}>
        <Animated.Text
          style={[
            styles.heart,
            {
              transform: [{ scale: buttonScale }],
              color: isLiked ? '#ff4d4d' : '#ccc',
            },
          ]}
        >
          {isLiked ? <AntDesign name="heart" size={24} color="rgba(253, 81, 81, 1)" /> :<AntDesign name="hearto" size={24} color="black" />}
        </Animated.Text>
      </TouchableOpacity>

      {/* Modal with Larger Heart */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* <Animated.Text
            style={[
              styles.modalHeart,
              {
                transform: [{ scale: modalScale }],
                color: isLiked ? '#ff4d4d' : '#ccc',
              },
            ]}
          >
            {isLiked ? '❤️' : '♡'}
          </Animated.Text> */}
          <LottieView
            source={require('../../assets/Like.json')}
           autoPlay
            loop
            style={{ width: size * 3, height: size * 3 }} // 3x larger than button
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heart: {
    fontSize: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  modalHeart: {
    fontSize: 100, // Larger heart
  },
});

export default LikeButton;