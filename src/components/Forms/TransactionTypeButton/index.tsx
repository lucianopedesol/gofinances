import React from "react";
import { TouchableOpacityProps } from 'react-native'
import {
    Container,
    Title,
    Icon,
} from "./styles";

interface IProps extends TouchableOpacityProps {
    title: string
    type: 'up' | 'down'
    isActive: boolean
}

export function TransactionTypeButton({ title, type, isActive, ...rest }: IProps) {
    const icon = {
        up: "arrow-up-circle",
        down: "arrow-down-circle",
    }
    return (
        <Container
            isActive={isActive}
            type={type}
            {...rest}
        >
            <Icon name={icon[type]} type={type} />
            <Title>
                {title}
            </Title>
        </Container>
    );
}

