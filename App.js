import React from 'react';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { StackNavigator } from './component/StackNavigator';
import Splash from './screens/Splash';
import { DrawerNavigator } from "./component/DrawerNavigator";

export default function App() {
  return (
      <AppContainer />
  );
}

const SwitchNavigator = createSwitchNavigator({
  Splash: { screen:Splash },
  Stack: { screen:StackNavigator },
  Drawer : { screen:DrawerNavigator }
});

const AppContainer = createAppContainer(SwitchNavigator)