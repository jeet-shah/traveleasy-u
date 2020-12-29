import React, { Component } from 'react';
import { Text, View,TouchableOpacity,Modal, Alert } from 'react-native';
import { styles } from '../component/Styles';
import Dates from 'react-native-dates';
import moment from 'moment';
import firebase from 'firebase';
import db from '../config';
import MyHeaderCity from '../component/MyHeaderCity';


 
export default class DateScreen extends Component {
  constructor(props){
    super(props)
    this.state = {data:null,focus:'startDate',startDate:1,endDate:1,isModalVisible:'false',userid:firebase.auth().currentUser.email,getnoofdays:0}
  }

  showmodal = () => {
    return(
      <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.isModalVisible}
      >
        <View style={styles.container}>
          <Text style={styles.shirttext}>Select Date</Text>
        <View style={{width:300,}}>
          <Dates
            onDatesChange={this.onDatesChange}
            isDateBlocked={this.isDateBlocked}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            focusedInput={this.state.focus}
            range
          />
        </View>
        <View style={{flexDirection:'row',alignContent:'center',marginTop:10,alignItems:'center'}}>
        <TouchableOpacity style={[styles.smallbutton,{alignSelf:'center'}]} onPress={()=>{this.setState({isModalVisible:false})}}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.smallbutton,{alignSelf:'center',marginLeft:40}]} onPress={this.getnoofdays} >
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
        </View>
        </View>
      </Modal>
    )
  }
  getnoofdays = async() => {
    var msDiff = new Date(this.state.endDate).getTime() - new Date(this.state.startDate).getTime();  
    var daysTill30June2035 = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
    if(daysTill30June2035 === null){
      Alert.alert('Select')
    }else{
      await this.setState({
        getnoofdays:daysTill30June2035,
      })
    }
    if(this.state.getnoofdays <= 0){
      Alert.alert('Select a Date Range')
    }
    else{
      this.setState({
        isModalVisible:false
      })
    }
  }
  isDateBlocked = (date) =>
      date.isBefore(moment(), 'day');
 
    onDatesChange = ({ startDate, endDate, focusedInput }) =>
      this.setState({ ...this.state, focus: focusedInput }, () =>
        this.setState({ ...this.state, startDate, endDate })
      );
 
    onDateChange = ({ date }) =>
      this.setState({ ...this.state, date });
  render(){
    return (
      <View style={styles.container}>
        {this.showmodal()}
        <View style={{width:370,alignSelf:'flex-start'}}>
            <MyHeaderCity title="Select Date" navigation={this.props.navigation} />
        </View>
        <View style={{marginBottom:350}}>
        <TouchableOpacity style={[styles.button,{marginTop:270}]} onPress={()=>{this.setState({isModalVisible:true})}}>
          <Text style={styles.buttonText}>Date Picker</Text>
        </TouchableOpacity>
         <TouchableOpacity onPress={()=>{
           console.log(this.state.getnoofdays)
           if(this.state.getnoofdays < 5){
             Alert.alert("Minimum No of Days Shall Be 5")
           }
           else if(this.state.getnoofdays === NaN){
             Alert.alert('Select a date range')
           }
           else{
            this.props.navigation.navigate('Catalogue')
            db.collection("DatesCities").add({
            "Start_Date":this.state.startDate && this.state.startDate.format('LL'),
            "End_Date":this.state.endDate && this.state.endDate.format('LL'),
            "User_Id":this.state.userid
            })
            .catch(error => {
              Alert.alert('Please enter a valid date range')
              console.log(error)
            })
            }
           }} style={[styles.button,{marginTop:20}]}>
           <Text style={styles.buttonText}> Next </Text>
         </TouchableOpacity>
         <Text style={{marginTop:20,borderColor:'black', fontWeight:'bold', borderWidth:2,textAlign:'center' }}> {this.state.getnoofdays} Days </Text>
         </View>
      </View>
    )
  }
}