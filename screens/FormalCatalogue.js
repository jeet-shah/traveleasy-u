import React from 'react';
import { Text, View,Image,TouchableOpacity,ScrollView,Dimensions,Modal, TouchableHighlight } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import MyHeader from '../component/MyHeader';
import {styles} from '../component/Styles';
import DropDownPicker from 'react-native-dropdown-picker';
import db from '../config';
import firebase from 'firebase';

export default class FormalCatalogue extends React.Component{

    constructor(props){
        super(props);
        this.state={
            name:this.props.navigation.getParam("details4")['name'],
            image:this.props.navigation.getParam("details4")['avatar_url'],
            subtitle:this.props.navigation.getParam('details4')['subtitle'],
            rate:0,
            count:0,
            size:'42',
            userID:firebase.auth().currentUser.email,
            isModal1Visible:'false',
            isModal2Visible:'false',
            isModal3Visible:'false',
            image1:[
                {url:this.props.navigation.getParam("details4")['avatar_url']}
            ],
            image2:[
                {url:'data:image/jpeg;base64,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'}
            ],
            image3:[
                {url:'data:image/jpeg;base64,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'}
            ],
            price:0,
            docid:''
        }
    }

    rate = () => {
        if(this.state.subtitle === "Rent Rs: 35/Day"){
            this.setState({
                rate:35
            })
        }else{
            this.setState({
                rate:30
            })
        }
    }

    componentDidMount(){
        this.rate()
    }

    deletedata = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Formal').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var PantInfo = []
        snapshot.docs.map(doc => {
            var PantInfos = doc.data()
            PantInfo.push(PantInfos)
        })
        if(PantInfo.filter(item => item.FormalName === this.state.name && item.FormalSize === this.state.size).length === 0){
            console.log(this.state.name)
            console.log(this.state.size)
            console.log()
            db.collection('Cart').doc(this.state.userID).collection('Formal').add({
                "FormalName":this.state.name,
                "FormalQuantity":this.state.count,
                "FormalSize":this.state.size,
                "Rate":this.state.rate,
                "userID":this.state.userID,
                "Price":this.state.rate * this.state.count
            })
        }else{
            db.collection('Cart').doc(this.state.userID).collection('Formal').where("FormalName","==",this.state.name).get()
            .then(snapshots => {
                snapshots.docs.forEach(doc => {
                    let docid = doc.id
                    this.setState({
                        docid:docid
                    })
                })
                db.collection('Cart').doc(this.state.userID).collection('Formal').doc(this.state.docid).delete()
                .then(()=>{
                    db.collection('Cart').doc(this.state.userID).collection('Formal').add({
                        "FormalName":this.state.name,
                        "FormalQuantity":this.state.count,
                        "FormalSize":this.state.size,
                        "Rate":this.state.rate,
                        "userID":this.state.userID,
                        "Price":this.state.rate * this.state.count
                    })
                })
            })
        }
    }

    magnify1 = () => {
        return(
            <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModal1Visible}
            style={{width:'100%'}}
            >
                <View style={[styles.container,]}>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal1Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                    <View style={{width:370,height:'50%'}}>
                        <ImageViewer imageUrls={this.state.image1}/>
                    </View>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal1Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    magnify2 = () => {
        return(
            <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModal2Visible}
            style={{width:'100%'}}
            >
                <View style={styles.container}>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal2Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                    <View style={{width:370,height:'50%'}}>
                        <ImageViewer imageUrls={this.state.image2}/>
                    </View>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal2Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    magnify3 = () => {
        return(
            <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.isModal3Visible}
            style={{width:'100%'}}
            >
                <View style={styles.container}>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal3Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                    <View style={{width:370,height:'50%'}}>
                        <ImageViewer imageUrls={this.state.image3}/>
                    </View>
                    <View style={{width:370,height:'25%'}}>
                        <TouchableHighlight onPress={()=>{this.setState({isModal3Visible:false})}}>
                            <View style={{width:'100%',height:'100%'}}></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        )
    }

    render(){
        let dimensions = Dimensions.get("window");
        let imageHeight = Math.round((dimensions.width * 9) / 16);
        let imageWidth = dimensions.width;
        return(
            <View style={styles.container}>
                {this.magnify1()}
                {this.magnify2()}
                {this.magnify3()}
                <View style={{width:370,marginTop:60}}>
                <MyHeader title={this.state.name} navigation={this.props.navigation} />
                </View>
                <View style={{height:300}}>
                <ScrollView
                horizontal={true}
              >
                  <TouchableOpacity onPress={()=>{this.setState({isModal1Visible:true})}}>
                  <Image 
                    source={{uri:this.state.image}}
                    style={{height: imageHeight, width: imageWidth}}
                   />
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{this.setState({isModal2Visible:true})}}>
                   <Image 
                    source={{uri:'data:image/jpeg;base64,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'}}
                    style={{height: imageHeight, width: imageWidth}}
                   />
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>{this.setState({isModal3Visible:true})}}>
                   <Image 
                    source={{uri:'data:image/jpeg;base64,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'}}
                    style={{height: imageHeight, width: imageWidth}}
                   />
                   </TouchableOpacity>
              </ScrollView>
                </View>
              <Text style={{marginTop:20,fontWeight:'bold'}}> {this.state.subtitle} </Text>
            <View style={{flexDirection:'row',marginTop:20,marginBottom:425}}>
                <DropDownPicker
                    items={[
                        {label: '8', value: '8',selected:true},
                        {label: '9', value: '9'},
                        {label: '10', value: '10'}
                    ]}
                    containerStyle={{height: 40}}
                    onChangeItem={item => this.setState({size:item.label})}
                    placeholder="Size"
                    style={{width:80}}
                    dropDownStyle={{width:80}}
                />
                <TouchableOpacity onPress={()=>{
                    if(this.state.count === 0){
                        this.setState({count:0})
                    }else{
                        this.setState({count:this.state.count-1})
                    }
                }} style={[styles.squarebutton,{marginLeft:15}]}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.shirttext,{fontSize:20,backgroundColor:'white',textAlignVertical:'center',paddingTop:8,marginLeft:5,marginRight:5,height:40}]}> {this.state.count} </Text>
                <TouchableOpacity onPress={()=>{this.setState({count:this.state.count+1})}} style={styles.squarebutton}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.smallbutton,{marginLeft:10}]} onPress={()=>{this.deletedata()}}>
                <Text style={[styles.buttonText,{fontSize:13,fontWeight:'bold'}]}> Add To Cart </Text>
            </TouchableOpacity>
            </View>
            </View>
        )
    }
}