import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from "styled-components/native";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme';
import AppLoading from 'expo-app-loading';

import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/hooks/auth';
import Routes from './src/routes';



export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userSorageLoading } = useAuth();

  if (!fontsLoaded || userSorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={'light-content'} />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
