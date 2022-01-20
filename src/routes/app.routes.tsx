import * as React from 'react';

import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import styled, { useTheme } from "styled-components";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';

const { Navigator, Screen } = createBottomTabNavigator();

export default function AppRoute() {
    const theme = useTheme();
    return (
        <Navigator screenOptions={
            {
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secundary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    height: 70,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0,
                }
            }
        }>
            <Screen
                name="Listagem"
                component={Dashboard}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name="Cadastro"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
            <Screen
                name="Resumo"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) =>
                        <MaterialIcons
                            name="pie-chart"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Navigator>
    );
}