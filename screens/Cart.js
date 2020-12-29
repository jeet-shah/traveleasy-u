import React from 'react';
import { styles } from '../component/Styles';
import { TextInput,Text, View, TouchableOpacity,Modal, FlatList, ScrollView, Alert,LogBox,DevSettings } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { WebView } from 'react-native-webview';
import { Icon, ListItem } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

export default class Cart extends React.Component{

    constructor(){
        super()
        this.state={
            PantInfo:[],
            PantKey:[],
            PantPrice:0,
            ShirtInfo:[],
            ShirtKey:[],
            ShirtPrice:0,
            WatchInfo:[],
            WatchKey:[],
            WatchPrice:0,
            TieInfo:[],
            TieKey:[],
            TiePrice:0,
            SportInfo:[],
            SportKey:[],
            SportPrice:0,
            FormalInfo:[],
            FormalKey:[],
            FormalPrice:0,
            userID:firebase.auth().currentUser.email,
            showModal:false,
            Status:"Pending",
            TotalPrice:0,
            expoPushToken:'',
            docid1:'',
            refresh1:false,
            docid2:'',
            docid3:'',
            docid4:'',
            docid5:'',
            docid6:'',
            docid7:'',
            docid8:'',
            delieveryaddress:''
        }
    }

    registerForPushNotificationsAsync = async () => {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          this.setState({ expoPushToken: token });
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        };

    getrequesteditemPant = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Pant').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var PantInfo = []
        var PantPrice = 0
        var Key = []
        snapshot.docs.map(doc => {
            var PantInfos = doc.data()
            PantInfo.push(PantInfos)
            PantPrice = PantInfo.reduce(( a, v ) => a = a + v.Price , 0)
            var Keys = doc.data().Key
            Key.push(Keys)
            this.setState({
                PantInfo:PantInfo,
                PantPrice:PantPrice,
                PantKey:Key
            })
        });
    }

    getrequesteditemShirt = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Shirt').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var ShirtInfo = []
        var ShirtPrice = 0
        snapshot.docs.map(doc => {
            var ShirtInfos = doc.data()
            ShirtInfo.push(ShirtInfos)
            ShirtPrice = ShirtInfo.reduce((a,v) => a = a+v.Price,0)
            this.setState({
                ShirtInfo:ShirtInfo,
                ShirtPrice:ShirtPrice
            })
        });
    }

    getrequesteditemWatch = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Watch').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var WatchInfo = []
        var WatchPrice = 0
        snapshot.docs.map(doc => {
            var WatchInfos = doc.data()
            WatchInfo.push(WatchInfos)
            WatchPrice = WatchInfo.reduce((a,v)=>a = a+v.Price,0)
            this.setState({
                WatchInfo:WatchInfo,
                WatchPrice:WatchPrice
            })
        });
    }

    getrequesteditemTie = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Tie').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var TieInfo = []
        var TiePrice = 0
        snapshot.docs.map(doc => {
            var TieInfos = doc.data()
            TieInfo.push(TieInfos)
            TiePrice = TieInfo.reduce((a,v)=>a = a+v.Price,0)
            this.setState({
                TieInfo:TieInfo,
                TiePrice:TiePrice
            })
        });
    }

    getrequesteditemSport = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Sport').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var SportInfo = []
        var SportPrice = 0
        snapshot.docs.map(doc => {
            var SportInfos = doc.data()
            SportInfo.push(SportInfos)
            SportPrice = SportInfo.reduce((a,v)=>a = a+v.Price,0)
            this.setState({
                SportInfo:SportInfo,
                SportPrice:SportPrice
            })
        });
    }

    getrequesteditemFormal = async() => {
        const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Formal').where("userID","==",this.state.userID);
        const snapshot = await citiesRef.get();
        var FormalInfo = []
        var FormalPrice = 0
        snapshot.docs.map(doc => {
            var FormalInfos = doc.data()
            FormalInfo.push(FormalInfos)
            FormalPrice = FormalInfo.reduce((a,v)=>a = a+v.Price,0)
            this.setState({
                FormalInfo:FormalInfo,
                FormalPrice:FormalPrice
            })
        });
    }

    async componentDidMount(){
        await this.getrequesteditemPant()
        await this.getrequesteditemFormal()
        await this.getrequesteditemShirt()
        await this.getrequesteditemSport()
        await this.getrequesteditemTie()
        await this.getrequesteditemWatch()
        await this.registerForPushNotificationsAsync()
        LogBox.ignoreLogs(['VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.']);
    }

    handleResponse = async(data) => {
        if(data.title === 'success'){
            this.setState({Status:'Complete',showModal:false})
            await this.sendPushNotification()
            await this.paymentstatus()
            this.props.navigation.navigate('City')
        }else if(data.title === 'cancel'){
            this.setState({Status:'Cancel',showModal:false})
        }else{
            return;
        }
    }

    paymentstatus = async() => {
        db.collection('Cart').doc(this.state.userID).collection('Status').where("TotalPrice","==",parseInt(this.state.PantPrice + this.state.ShirtPrice + this.state.WatchPrice + this.state.TiePrice + this.state.SportPrice + this.state.FormalPrice)).get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                let docid = doc.id
                this.setState({docid8:docid})
            })
        })
        console.log(this.state.docid8)
        db.collection('Cart').doc(this.state.userID).collection('Status').doc(this.state.docid8).update({
            "PaymentStatus":"Success"
        })
    }

    sendPushNotification = async() => {
        const message = {
            to:this.state.expoPushToken,
            sound:'default',
            title:'Travel Easy',
            body:'Payment Successful'
        };
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.PantName} ({item.PantSize})</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Qty: {item.PantQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Pant').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.PantName === items.PantName && items.PantSize === item.PantSize)){
                    db.collection('Cart').doc(this.state.userID).collection('Pant').where("PantSize","==",item.PantSize).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid1:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Pant').doc(this.state.docid1).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    keyExtractor1 = (item, index) => index.toString()
    renderItem1 = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.ShirtName} ({item.ShirtSize})</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Quantity: {item.ShirtQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Shirt').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.ShirtName === items.ShirtName && items.ShirtSize === item.ShirtSize)){
                    db.collection('Cart').doc(this.state.userID).collection('Shirt').where("ShirtSize","==",item.ShirtSize).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid2:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Shirt').doc(this.state.docid2).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    keyExtractor2 = (item, index) => index.toString()
    renderItem2 = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.WatchName}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Quantity: {item.WatchQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Watch').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.WatchName === items.WatchName)){
                    db.collection('Cart').doc(this.state.userID).collection('Watch').where("WatchName","==",item.WatchName).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid3:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Watch').doc(this.state.docid3).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    keyExtractor3 = (item, index) => index.toString()
    renderItem3 = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.TieName}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Quantity: {item.TieQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Tie').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.TieName === items.TieName)){
                    db.collection('Cart').doc(this.state.userID).collection('Tie').where("TieName","==",item.TieName).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid4:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Tie').doc(this.state.docid4).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    keyExtractor4 = (item, index) => index.toString()
    renderItem4 = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.SportName} ({item.SportSize})</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Quantity: {item.SportQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Sport').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.SportName === items.SportName && items.SportSize === item.SportSize)){
                    db.collection('Cart').doc(this.state.userID).collection('Sport').where("SportSize","==",item.SportSize).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid5:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Pant').doc(this.state.docid5).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    keyExtractor5 = (item, index) => index.toString()
    renderItem5 = ({ item }) => {
        return(
          <ListItem bottomDivider>
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:'bold',fontSize:18,color:'black'}}>{item.FormalName} ({item.FormalSize})</ListItem.Title>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Quantity: {item.FormalQuantity}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Rate: {item.Rate}</ListItem.Subtitle>
                <ListItem.Subtitle style={{fontSize:18,color:'black'}}>Price: {item.Price}</ListItem.Subtitle>
            </ListItem.Content>
            <Icon name="trash" type="font-awesome-5" size={25} color="red" onPress={async()=>{
                const citiesRef = db.collection('Cart').doc(this.state.userID).collection('Fornal').where("userID","==",this.state.userID);
                const snapshot = await citiesRef.get();
                var PantInfo = []
                snapshot.docs.map(doc => {
                    var PantInfos = doc.data()
                    PantInfo.push(PantInfos)
                })
                if(PantInfo.filter(items => item.FormalName === items.FormalName && items.FormalSize === item.FormalSize)){
                    db.collection('Cart').doc(this.state.userID).collection('Formal').where("FormalSize","==",item.FormalSize).get()
                    .then(snapshots => {
                        snapshots.docs.forEach(doc => {
                            let docid = doc.id
                            this.setState({docid6:docid})
                        })
                        db.collection('Cart').doc(this.state.userID).collection('Formal').doc(this.state.docid6).delete()
                    })
                }
                setTimeout(()=>{
                    this.props.navigation.replace('Cart')
                },2000)
            }} />
          </ListItem>
        )
    }

    render(){
        return(
            <ScrollView>
                <View style={[styles.container,{height:700}]}>
                    <View style={{flexDirection:'row'}}>
                    </View>
                    <Modal
                    visible={this.state.showModal}
                    onRequestClose={()=>{this.setState({showModal:false})}}
                    >
                        <WebView
                        source={{uri:"http://192.168.1.106:3000"}}
                        onNavigationStateChange={data => this.handleResponse(data)}
                        />
                    </Modal>
                    <View style={{width:"85%",alignContent:'center',alignItems:'center',justifyContent:'center',borderColor:'black',borderWidth:2}}>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.PantInfo}
                                keyExtractor={this.keyExtractor}
                                renderItem={this.renderItem}
                                scrollEnabled={false}
                                extraData={this.state}  
                            />
                        </View>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.ShirtInfo}
                                keyExtractor={this.keyExtractor1}
                                renderItem={this.renderItem1}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.WatchInfo}
                                keyExtractor={this.keyExtractor2}
                                renderItem={this.renderItem2}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.TieInfo}
                                keyExtractor={this.keyExtractor3}
                                renderItem={this.renderItem3}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.SportInfo}
                                keyExtractor={this.keyExtractor4}
                                renderItem={this.renderItem4}
                                scrollEnabled={false}
                            />
                        </View>
                        <View style={{width:"100%"}}>
                            <FlatList 
                                data={this.state.FormalInfo}
                                keyExtractor={this.keyExtractor5}
                                renderItem={this.renderItem5}
                                scrollEnabled={false}
                            />
                        </View>
                        <Text style={[styles.shirttext,{backgroundColor:'white',marginTop:10,width:"100%",textAlign:'center',height:30,textAlignVertical:'center'}]}>
                            Total Price: {parseInt(this.state.PantPrice + this.state.ShirtPrice + this.state.WatchPrice + this.state.TiePrice + this.state.SportPrice + this.state.FormalPrice)}
                        </Text>
                    </View>
                    <TextInput
                        style={styles.formTextInput}
                        placeholder="Enter delievery address"
                        placeholderTextColor="black"
                        multiline={true}
                        onChangeText={(text)=>{
                        this.setState({
                            delieveryaddress: text
                        })
                        }}
                    />
                    <TouchableOpacity style={[styles.button,{marginTop:10}]} onPress={()=>{
                        if(parseInt(this.state.PantPrice + this.state.ShirtPrice + this.state.WatchPrice + this.state.TiePrice + this.state.SportPrice + this.state.FormalPrice) === 0){
                            Alert.alert("Cart is empty")
                        }
                        else if(this.state.delieveryaddress.length < 10){
                            Alert.alert('Enter proper address')
                        }
                        else{
                            db.collection('Status').add({
                                "TotalPrice":parseInt(this.state.PantPrice + this.state.ShirtPrice + this.state.WatchPrice + this.state.TiePrice + this.state.SportPrice + this.state.FormalPrice),
                            })
                            db.collection('Cart').doc(this.state.userID).collection('Address').add({
                                "DelieveryAddress":this.state.delieveryaddress
                            })
                            this.setState({showModal:true})
                        } 
                    }}>
                        <Text style={styles.buttonText}>Pay Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}