import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Sharing from 'expo-sharing';
import { Modal, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const ShareCardModal = ({ visible, onClose, card }) => {
  const shareImage = async (uri, title) => {
    if (uri && (await Sharing.isAvailableAsync())) {
      await Sharing.shareAsync(uri, {
        dialogTitle: title,
        mimeType: "image/jpeg",
      });
    } else {
      alert("Sharing not available on this device");
    }
  };

const shareText = async () => {
  if (!card) return;
  let message = `Card Title: ${card.title || 'Untitled'}\n`;
  card.fields?.forEach(field => {
    message += `${field.key}: ${field.value}\n`;
  });
  await Share.share({ message });
};

 return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.handle} />
          

          <TouchableOpacity onPress={() => shareImage(card.frontImage, "Share Front Image")} style={styles.option}>
            <Entypo name="document" size={24} color="black" /><Text style={styles.optionText}>Share Front Image</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => shareImage(card.backImage, "Share Back Image")} style={styles.option}>
            <Entypo name="documents" size={24} color="black" /><Text style={styles.optionText}>Share Back Image</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={shareText} style={styles.option}>
            <FontAwesome name="text-height" size={24} color="black" /><Text style={styles.optionText}>Share Text</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.52)', // Softer overlay
  },
  modalContent: {
    height: '50%', // Covers half the screen
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems:'center'
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000', // Black text
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection:'row',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    justifyContent:"flex-start",
    width:'100%'
  },
  optionText: {
    fontSize: 18,
    color: '#000', // Black text
    textAlign: 'center',
    marginLeft:25
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#000', // Black background
    borderWidth: 1, // Black border for black-and-white look
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal:'40%',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff', // White  text
  },
});

export default ShareCardModal;