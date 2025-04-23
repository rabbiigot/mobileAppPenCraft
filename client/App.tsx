// In App.js in a new project

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import HomeScreen from './screens/home';
import NoteScreen from './screens/note';
import DrawScreen from './screens/draw';
import ProfileScreen from './screens/profile';
import { enableScreens } from 'react-native-screens';
import TempScreen from './components/noteeditor';
import { NotesProvider } from './components/NotesContext';
import SharedNotesScreen from './screens/sharednotes';
enableScreens();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// const MainTabs = () => {
//   return(
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={HomeScreen}/>
//       <Tab.Screen name="Profile" component={ProfileScreen}/>
//     </Tab.Navigator>
//   )
//}

function RootStack() {
  const [note, setNote] = useState('');
  return (
    <NotesProvider>
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      {/* <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Note" component={NoteScreen} />
      <Stack.Screen name="Draw" component={DrawScreen} />
      <Stack.Screen name="SharedNotes" component={SharedNotesScreen} />
    </Stack.Navigator>
    </NotesProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}