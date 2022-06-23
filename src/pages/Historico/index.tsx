import {
  Box,
  Container,
  ContainerList,
  ItemContainer,
  Text,
  Title,
} from "./styles";
import React, { useMemo } from "react";
import { Header } from "../../components/Header";
import { ScrollView } from "react-native";
import { Background } from "../../components/Background";
import { useHistoricoStore } from "../../store/Historico";

export const Historico: React.FC = () => {
  const historico = useHistoricoStore((state) => state.historico);
  const total = useMemo(() => {
    return (
      historico
        .map((item) => item.valor)
        .reduce((prev, curr) => prev + curr, 0) || 0
    );
  }, []);
  return (
    <Background>
      <Header title={"Historico de Compras"} />
      <Container>
        <Box marginBottom={10}>
          <Title>TITULO</Title>
          <Title maxWidth={80} align={"right"}>
            VALOR
          </Title>
        </Box>
        <ContainerList>
          <ScrollView>
            {historico.map((item, index) => (
              <ItemContainer
                key={`item-${item.jogoId}`}
                par={(index + 1) % 2 === 0}
              >
                <Text>{item.titulo}</Text>
                <Text maxWidth={80} align={"right"}>
                  R$ {item.valor.toFixed(2).toString().replace(".", ",")}
                </Text>
              </ItemContainer>
            ))}
          </ScrollView>
        </ContainerList>
        <ItemContainer borderTop>
          <Title noFlex>TOTAL</Title>
          <Text marginLeft={10} noFlex>
            R$ {total.toFixed(2).toString().replace(".", ",")}
          </Text>
        </ItemContainer>
      </Container>
    </Background>
  );
};
