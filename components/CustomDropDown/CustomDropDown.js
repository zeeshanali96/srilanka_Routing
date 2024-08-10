// CustomDropdown.js
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  View,
  Modal,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Text, Button, Portal} from 'react-native-paper';

const CustomDropdown = ({
  label,
  data,
  value,
  onSelect,
  placeholder,
  onBlur,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item =>
    item?.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const {t} = useTranslation();

  const handleSelect = item => {
    onSelect(item.value); // Pass the value (string) instead of the entire object
    setIsVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[styles.input, error ? styles.errorInput : null]}>
        <Text>{value ? value : placeholder}</Text>
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={isVisible}
          onDismiss={() => setIsVisible(false)}
          contentContainerStyle={styles.modalContent}>
          <TextInput
            label={t('search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <FlatList
            data={filteredData}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.item}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
          />
          <Button
            mode="contained"
            style={styles.closeButton}
            onPress={() => setIsVisible(false)}>
            {t('close')}
          </Button>
        </Modal>
      </Portal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  searchInput: {
    marginBottom: 10,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
  },
  listContainer: {
    paddingBottom: 10,
  },
  closeButton: {
    marginTop: 15,
    marginHorizontal: 10,
  },
});

export default CustomDropdown;
