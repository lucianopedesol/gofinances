import React from "react";
import { RectButton, RectButtonProps } from "react-native-gesture-handler"; 
import {
    Container,
    Title,
    Icon,
    Button,
} from "./styles";

interface IProps extends RectButtonProps {
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
        >
            <Button  {...rest}>
                <Icon name={icon[type]} type={type} />
                <Title>
                    {title}
                </Title>
            </Button>

        </Container>
    );
}

