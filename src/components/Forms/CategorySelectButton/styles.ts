
import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";

import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled(RectButton).attrs({
    activeOpacity: 0.7
})`
    width: 100%;
    background-color:  ${({ theme }) => theme.colors.shape}; 

    flex-direction: row;
    align-items: center; 
    justify-content: space-between; 

    border-radius: 5px;

    padding: 18px 16px;

`;
export const Category = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
    color:  ${({ theme }) => theme.colors.text_dark};
    
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px; 
    color:  ${({ theme }) => theme.colors.text};
`;
