import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Icon } from "react-native-elements";
import Profile from "../screens/Profile";
import MyOrder from "../screens/MyOrder";
import Catalogue from "../screens/Catalogue";

export const DrawerNavigator = createDrawerNavigator({
    Catalogue:{
        screen:Catalogue,
        navigationOptions:{
            drawerIcon:<Icon name="home" type="font-awesome" />
        }
    },
    Profile:{
        screen:Profile,
        navigationOptions:{
            drawerIcon:<Icon name="user-circle" type="font-awesome" />
        }
    },
    MyOrder:{
        screen:MyOrder,
        navigationOptions:{
            drawerIcon:<Icon name="shopping-cart" type="font-awesome" />
        }
    },
})