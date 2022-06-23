import React from "react";
import {TouchableOpacityProps} from 'react-native'
import {Button, ButtonTitle, LoadingIndicator,} from "./styles";
import {useMyTheme} from "../../hooks/Theme.hooks";


interface DefaultButton extends TouchableOpacityProps{
    title: string;
    loading?: boolean;
    isDangerButton?: boolean;
}
export const DefaultButton: React.FC<DefaultButton> = ({
                                                           title,
                                                           loading=false, 
                                                           isDangerButton=false,
                                                           ...props
                                                       }) => {
    const { theme } = useMyTheme()
    return (
        <Button isDangerButton={isDangerButton} {...props as any}>
            {loading&&(<LoadingIndicator color={theme.colors.background} size={'small'}/>)}
            <ButtonTitle isDangerButton={isDangerButton} >
                {title}
            </ButtonTitle>
        </Button>
    )
}
