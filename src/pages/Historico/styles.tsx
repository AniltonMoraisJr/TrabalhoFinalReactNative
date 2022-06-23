import styled, { css } from "styled-components/native";
import { FontAwesome } from "@expo/vector-icons";
import color from "color";

interface TitleProps {
  maxWidth?: number;
  align?: string;
  noFlex?: boolean;
}

interface BoxProps {
  marginBottom?: number;
}

interface ItemContainerProps {
  par?: boolean;
  borderTop?: boolean;
}

export const Container = styled.View`
  flex: 1;
  padding: 20px 20px 40px 20px;
`;

export const ContainerList = styled.View`
  flex: 1;
  position: relative;
`;

export const Box = styled.View<BoxProps>`
  padding: 10px;
  background-color: ${(props) =>
    color(props.theme.colors.background).darken(0.3).hex()};
  align-self: stretch;
  margin: 5px 0;
  margin-bottom: ${(props) => (props.marginBottom ? props.marginBottom : 5)}px;
  border-radius: ${(props) => props.theme.measures.radius}px;
  flex-direction: row;
`;

export const Title = styled.Text<TitleProps>`
  color: ${(props) => props.theme.colors.primary};
  font-size: 16px;
  ${(props) =>
    !props.noFlex &&
    css`
      flex: 1;
    `};
  ${(props) =>
    props.maxWidth &&
    css`
      max-width: ${props.maxWidth}px;
    `};
  text-align: ${(props) => (props.align ? props.align : "left")};
`;

export const ItemContainer = styled.View<ItemContainerProps>`
  margin: 1px 0;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 5px 10px;
  ${(props) =>
    props.par &&
    css`
      background-color: rgba(0, 0, 0, 0.08);
    `};

  ${(props) =>
    props.borderTop &&
    css`
      border-top-width: 3px;
      padding: 6px 0;
      justify-content: flex-end;
      align-items: center;
      border-top-color: ${(props) =>
        color(props.theme.colors.background).darken(0.3).hex()};
    `};
`;
interface TextProps {
  maxWidth?: number;
  align?: string;
  noFlex?: boolean;
  marginLeft?: number;
}
export const Text = styled.Text<TextProps>`
  font-size: 16px;
  color: ${(props) => props.theme.colors.secondary};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : 0)}px;
  ${(props) =>
    !props.noFlex &&
    css`
      flex: 1;
    `};
  ${(props) =>
    props.maxWidth &&
    css`
      max-width: ${props.maxWidth}px;
    `};
  text-align: ${(props) => (props.align ? props.align : "left")};
`;
