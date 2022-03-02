import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SignIn } from '../screens/SignIn';
import { useTheme } from 'styled-components';

const { Navigator, Screen } = createStackNavigator();

export default function AuthRoutes() { 
    return (
        <Navigator
            screenOptions={{
                headerShown: false 
            }}
        >
            <Screen
                name='SingIn'
                component={SignIn}
            />
        </ Navigator>
    );
}

 