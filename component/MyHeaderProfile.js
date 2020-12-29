import React, { Component } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import firebase from 'firebase'
import { Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default class MyHeaderProfile extends Component{

    render(){
        return(
            <View style={styles.header}>
                <Icon style={styles.icon} size={35} color='#696969' name='bars' type='font-awesome' />
                <View style={{width:"90%",paddingLeft:80}}>
                    <Text style={styles.headertext}> {this.props.title} </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        width:375,
        height:80,
        flexDirection:"row",
        backgroundColor:"#eaf8fe",
        paddingTop:45,
        alignItems:"center",
        alignSelf:"center"
    },
    headertext:{
        fontWeight:'bold',
        fontSize:20,
        letterSpacing:1,
        color:"black",
        alignSelf:"center"
    },
})