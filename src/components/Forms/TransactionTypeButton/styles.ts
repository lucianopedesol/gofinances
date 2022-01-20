
import styled, { css } from "styled-components/native";

import { RectButton } from "react-native-gesture-handler";

import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize';

interface IIconsProps {
    type: 'up' | 'down',
}
interface IContainerProps {
    isActive: boolean,
    type: 'up' | 'down',
}
export const Container = styled.View <IContainerProps>`
    width: 48%;
    background-color:  ${({ theme }) => theme.colors.background}; 

   

    border-width:  ${({ isActive }) => isActive ? 0 : 1.5}px;
    border-style: solid;
    border-color:  ${({ theme }) => theme.colors.text};
    border-radius: 5px;


    ${({ isActive, type }) => isActive && type === 'down' && css`
        background-color:  ${({ theme }) => theme.colors.attention_light}; 
    `}; 
    ${({ isActive, type }) => isActive && type === 'up' && css`
        background-color:  ${({ theme }) => theme.colors.success_light}; 
    `}; 

`;

export const Button = styled(RectButton)`
    flex-direction: row;
    align-items: center; 
    justify-content: center;

    padding: 16px;
`;

export const Icon = styled(Feather) <IIconsProps>`
    font-size: ${RFValue(24)}px; 
    margin-right: 12px;
    color:  ${({ theme, type }) => type === 'up' ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color:  ${({ theme }) => theme.colors.text_dark};
    
`;


