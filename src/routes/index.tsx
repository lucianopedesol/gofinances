import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { useAuth } from '../hooks/auth';


const { Navigator, Screen } = createStackNavigator();

export default function Routes() {
    const { user } = useAuth();
 
    return (
        <NavigationContainer>
            {user?.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    );
}