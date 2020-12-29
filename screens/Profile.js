import React from "react";
import { TextInput,Text,View,TouchableOpacity } from "react-native";
import { styles } from "../component/Styles";
import db from '../config'
import firebase from "firebase";
import { Avatar } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from "react-native";
import MyHeaderProfile from "../component/MyHeaderProfile";

export default class Profile extends React.Component{

    constructor(){
        super()
        this.state = {
            userid:firebase.auth().currentUser.email,
            address:'',
            phoneno:'',
            name:'',
            docid:'',
            firstname:'',
            lastname:'',
            image:"#"
        }
    }

    getuserinfo = async() => {
        var collection = db.collection('users').where("email_id","==",this.state.userid)
        var snapshot = await collection.get()
        snapshot.docs.map(doc => {
            this.setState({
                address:doc.data().address,
                phoneno:doc.data().contact,
                name:doc.data().first_name + doc.data().last_name,
                firstname:doc.data().first_name,
                lastname:doc.data().last_name
            })
        })
    }

    selctpicture = async() => {
        const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.All,
          allowsEditing:true,
          aspect:[4,3],
          quality:1
        })
        if(! cancelled){
          this.uplaodimage(uri,this.state.userid)
        }
      }
    
      uplaodimage = async(uri,imagename) => {
        var response = await fetch(uri)
        var blob = await response.blob()
        var ref = firebase.storage().ref().child("user_profiles/" + imagename)
        return ref.put(blob).then((response)=>{
          this.fetchimage(imagename)
        })
      }
    
      fetchimage = async(imagename) => {
        var storageref = firebase.storage().ref().child("user_profiles/" + imagename)
        storageref.getDownloadURL().then((url)=>{
          this.setState({
            image:url
          })
        })
      }

    componentDidMount(){
        this.getuserinfo()
        this.fetchimage(this.state.userid)
    }

    updateuser = async() => {
        var collection = db.collection('users').where("email_id","==",this.state.userid)
        var snapshot = await collection.get()
        snapshot.docs.map(doc => {
            this.setState({
                docid:doc.id
            })
        })
        db.collection('users').doc(this.state.docid).delete()
        db.collection('users').add({
            first_name:this.state.firstname,
            last_name:this.state.lastname,
            contact:this.state.phoneno,
            email_id:this.state.userid,
            address:this.state.address
          })
    }

    render(){
        return(
            <ScrollView contentContainerStyle={{alignItems:'center',justifyContent:'center',width:'100%',height:"100%"}}>
                <View style={[styles.container,{width:"100%",height:"100%"}]}>
                    <View>
                        <MyHeaderProfile title={"Profile"} />
                    </View>
                    <View style={{alignSelf:'center',}}>
                        <Avatar rounded source={{uri:this.state.image}} size = {150} onPress={()=>{this.selctpicture()}} containerStyle={styles.imagecontainer} showEditButton={true} />
                    </View>
                    <Text style={[styles.formTextInput,{height:45,textAlignVertical:'center',fontSize:16,borderRadius:10,borderWidth:2,borderColor:"grey",}]}> {this.state.userid} </Text>
                    <TextInput
                        value={this.state.firstname}
                        placeholder={"Enter First Name"}
                        style={[styles.formTextInput,{height:45}]}
                        placeholderTextColor={"grey"}
                        maxLength = {15}
                        onChangeText={(text)=>{
                            this.setState({
                                firstname: text
                            })
                        }}
                    />
                    <TextInput
                        value={this.state.lastname}
                        placeholder={"Enter Last Name"}
                        style={[styles.formTextInput,{height:45}]}
                        placeholderTextColor={"grey"}
                        maxLength = {15}
                        onChangeText={(text)=>{
                            this.setState({
                                lastname: text
                            })
                        }}
                    />
                    <TextInput
                        style={[styles.formTextInput,{height:45}]}
                        value={this.state.phoneno}
                        placeholder={"Enter 10 Digit Mobile No"}
                        placeholderTextColor={"grey"}
                        maxLength ={10}
                        keyboardType={'numeric'}
                        onChangeText={(text)=>{
                            this.setState({
                                phoneno: text
                            })
                        }}
                    />
                    <TextInput
                        style={styles.formTextInput}
                        value={this.state.address}
                        placeholder={"Enter Address"}
                        placeholderTextColor={"grey"}
                        onChangeText={(text)=>{
                            this.setState({
                                address: text
                            })
                        }}
                    />
                    <TouchableOpacity onPress={this.updateuser} style={[styles.button,{marginTop:20,width:'80%',borderColor:'black',borderRadius:10,borderWidth:1,}]}>
                        <Text style={styles.buttonText}> Save </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}