
import React from 'react';
import { Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Linking, StyleSheet, Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const StatusAppBar = ({ title }) => {
    const navigation = useNavigation();

    const handleContactUs=()=>{
        const phoneNumber = '94772549526';
        const url = `https://wa.me/${phoneNumber}`;
    
        Linking.openURL(url)
          .catch((err) => console.error('Failed to open URL:', err));
      
    }
  

    return (
        <Appbar.Header style={styles.header}>
        <Appbar.Action icon={() => <Icon name="arrow-left" size={24} />} onPress={() => navigation.goBack()} />

       
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
        </View>

        
        <Appbar.Action icon={() => <Icon name="whatsapp" size={24} />} onPress={() => handleContactUs()} />
    </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    header: {
       
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default StatusAppBar;
