import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const PRESET_TITLES = [
  'License', 'Payment Card', 'Invoice', 'Gift Card', 'Identity Card', 'Passport', 'Password', 'Other',
];

const EditCardModal = ({ visible, onClose, card, onSave }) => {
  const [title, setTitle] = useState(card?.title || 'Document');
  const [customTitle, setCustomTitle] = useState(
    card?.title && !PRESET_TITLES.includes(card.title) ? card.title : ''
  );
  const [showCustomInput, setShowCustomInput] = useState(!PRESET_TITLES.includes(card?.title));
  const [type, setType] = useState(card?.type || 'Scan');
  const [fields, setFields] = useState(card?.fields || [{ key: '', value: '' }]);

  const addField = () => {
    setFields([...fields, { key: '', value: '' }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, keyName, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [keyName]: value };
    setFields(updatedFields);
  };

  const handleSave = () => {
    const filteredFields = fields.filter((f) => f.key && f.value);
    const finalTitle = showCustomInput ? customTitle : title;
    if (!finalTitle || !filteredFields.length) {
      Alert.alert('Error', 'Please provide a title and at least one valid field.');
      return;
    }
    onSave({ ...card, title: finalTitle, type, fields: filteredFields });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <Text style={styles.modalTitle}>Edit</Text> */}
               <Feather style={styles.modalTitle} name="edit-2" size={30} color="black" />

            <Text style={styles.label}>Title</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {PRESET_TITLES.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    (title === item || (item === 'Other' && showCustomInput)) && styles.chipSelected,
                  ]}
                  onPress={() => {
                    if (item === 'Other') {
                      setShowCustomInput(true);
                      setTitle('Other');
                    } else {
                      setShowCustomInput(false);
                      setCustomTitle('');
                      setTitle(item);
                    }
                  }}
                >
                  <Text
                    style={{
                      color: title === item || (item === 'Other' && showCustomInput) ? '#fff' : '#000',
                      fontWeight: '300',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {showCustomInput && (
              <TextInput
                style={styles.input}
                placeholder="Custom title"
                value={customTitle}
                onChangeText={setCustomTitle}
                placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
              />
            )}

            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="Enter card type"
              placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
            />

            <Text style={styles.label}>Fields</Text>
            {fields.map((item, index) => (
              <View style={styles.fieldRow} key={`field-${index}`}>
                <TextInput
                  style={styles.input}
                  placeholder="Field Name"
                  value={item.key}
                  onChangeText={(text) => updateField(index, 'key', text)}
                  placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Field Value"
                  value={item.value}
                  onChangeText={(text) => updateField(index, 'value', text)}
                  placeholderTextColor={'rgba(0, 0, 0, 0.37)'}
                />
                <TouchableOpacity onPress={() => removeField(index)}>
                  <Ionicons name="close-circle" size={24} color="#000000ff" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addBtn} onPress={addField}>
              <Ionicons name="add-circle" size={22} color="#000000ff" />
              <Text style={styles.addBtnText}>Add Field</Text>
            </TouchableOpacity>

          
          </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.52)', // Match ShareCardModal overlay
  },
  modalContent: {
    height: '80%', // Half-screen like ShareCardModal
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
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#f5f5f5',
    color: '#000',
    marginVertical: 5,
    marginRight: 6,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  addBtn: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'flex-start',
    width: '100%',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 18,
    color: '#000',
    marginLeft: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EditCardModal;