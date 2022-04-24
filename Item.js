import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

const Item = (props) => {

    return(
        <View style={styles.item}>
            <Text style ={styles.itemText}>{props.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignContent: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    itemText: {
        maxWidth: '80%',
        fontSize: 15
    }
});

export default Item;