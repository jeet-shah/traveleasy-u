import React, { Component } from 'react';
import { View, StyleSheet,Text } from 'react-native';
import { Icon } from 'react-native-elements';

export default class MyHeaderDate extends Component{

    render(){
        return(
            <View style={styles.header}>
                <Icon style={styles.icon} size={35} color='#696969' name='bars' type='font-awesome' onPress={()=>{this.props.navigation.toggleDrawer()}} />
                <View style={{width:"70%",paddingLeft:60}}>
                    <Text style={styles.headertext}> {this.props.title} </Text>
                </View>
                <Icon style={styles.icon} size={35} color='#696969' name='shopping-cart' type='font-awesome' onPress={()=>{this.props.navigation.navigate('Cart')}} />
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