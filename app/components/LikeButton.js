// ActionModal.js
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { Modal, StyleSheet, View } from 'react-native';

const ActionModal = ({ visible, onClose, actionType = 'save', size = 100, time=1500 }) => {
  const animationRef = useRef(null);

  // Programmatic Lottie file selection
  const getLottieSource = (type) => {
    const lottieMap = {
      save: require('../../assets/saved.json'),
      like: require('../../assets/Like.json'), 
      delete: require('../../assets/Delete.json'), // Add if available
    };
    return lottieMap[type] || require('../../assets/saved.json'); // Fallback to saved.json
  };

  // Play animation and auto-close 
  useEffect(() => {
    if (visible) {
      animationRef.current?.play(0, 500); // Adjust frame numbers based on your JSON
      const timer = setTimeout(() => {
        onClose();
      }, time);
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [visible, onClose]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LottieView
          ref={animationRef}
          source={getLottieSource(actionType)}
          autoPlay={false}
          loop={false}
          style={{ width: size *3, height: size *3}}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)' 
  },
});

export default ActionModal;