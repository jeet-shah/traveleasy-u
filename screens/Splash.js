import React,{Component}from 'react';
import { View, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import { styles } from '../component/Styles';

export default class Splash extends Component{
      signedin = async() => {
        firebase.auth().onAuthStateChanged(async function(user){
          if(user){
            if(firebase.auth().currentUser.emailVerified){
              await this.props.navigation.navigate('City')
            }else{
              await this.props.navigation.navigate('LogIn')
            }
          }else{
            await this.props.navigation.navigate('LogIn')
          }
        }.bind(this))
      }

      componentDidMount(){
        this.signedin()
      }

      render(){
        return(
            <View style={styles.container}>
              <ActivityIndicator size="large" />
            </View>
        )
    }
}