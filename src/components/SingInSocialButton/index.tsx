import React from "react";
import { TouchableOpacityProps } from "react-native";
import { RectButtonProps } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import {
    Button,
    ImageContainer,
    Text,
} from "./styles";



export interface IProps extends TouchableOpacityProps {
    title: string;
    svg: React.FC<SvgProps>;

}
export function SingInSocialButton({
    title,
    svg: Svg,
    ...rest
}: IProps) {


    return (
        <Button {...rest}>
            <ImageContainer>
                <Svg />
            </ImageContainer>
            <Text>
                {title}
            </Text>

        </Button>
    );
}

