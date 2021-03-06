import { Box, Container, Image, Text, Title } from "./styles";
import { DefaultButton } from "../../components/DefaultButton";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Header } from "../../components/Header";
import { ScrollView } from "react-native";
import { Background } from "../../components/Background";
import { api } from "../../api";
import { ToastLayout } from "../../components/ToastLayout";
import { useToast, View } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  DetalhesScreenRouteProp,
  TabNavScreenNavigationProp,
} from "../../Routes/PrivateNavigation";
import { useCarrinhoStore } from "../../store/Carrinho";
import { HomeScreenTabNavigationProps } from "../../Routes/TabsNavigation";
import { useHistoricoStore } from "../../store/Historico";

interface ItensProps {
  id: number;
  img: string;
  name: string;
  description: string;
  value: number;
  stars: number;
  type: string;
}

export const Detalhes: React.FC = () => {
  const [data, setData] = useState<ItensProps | undefined>();
  const toast = useToast();
  const route = useRoute<DetalhesScreenRouteProp>();
  const navigation = useNavigation<
    TabNavScreenNavigationProp & HomeScreenTabNavigationProps
  >();

  const addItem = useCarrinhoStore((state) => state.addItem);
  const historico = useHistoricoStore((store) => store.historico);
  const isMyne = useMemo(
    () => (data ? historico.map((it) => it.jogoId).includes(data.id) : false),
    [data]
  );
  const addCart = () => {
    if (data) {
      addItem({
        jogoId: data.id,
        titulo: data.name,
        valor: data.value,
      });
    }
  };

  const addAndGoToCart = () => {
    addCart();
    navigation.goBack();
    navigation.navigate("Cart");
  };

  const getData = async () => {
    try {
      const response = await api.get<ItensProps>(`games/${route.params.id}`);
      if (!!response.data) setData(response.data);
    } catch (e) {
      toast.show({
        placement: "top-right",
        render: ({ id }) => {
          return ToastLayout.error({
            id,
            description: e.message,
            close: toast.close,
          });
        },
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const stars = useMemo(() => {
    if (data) {
      let starsArray = [];
      for (let i = 1; i <= data.stars; i++) {
        starsArray.push(
          <FontAwesome5
            key={i}
            name="star"
            solid
            size={16}
            color="yellow"
            backgroundColor="yellow"
            style={{ margin: 5 }}
          />
        );
      }
      return starsArray;
    } else {
      return null;
    }
  }, [data]);

  return (
    <Background>
      <Header title={data?.name} />
      <ScrollView>
        {data?.img && <Image source={{ uri: data?.img }} />}
        <Container>
          <Box>
            <Title>TIPO</Title>
            <Text>{data?.type}</Text>
          </Box>
          <Box>
            <Title>DESCRI????O</Title>
            <Text>{data?.description}</Text>
          </Box>
          <Box>
            <Title>AVALIA????O</Title>
            <View style={{ flex: 1, flexDirection: "row" }}>{stars}</View>
          </Box>
          <Box marginBottom={20}>
            <Title>VALOR</Title>
            <Text>
              R$ {data?.value.toFixed(2).toString().replace(".", ",")}
            </Text>
          </Box>
          {data && !isMyne && (
            <>
              <DefaultButton
                title={"ADICIONAR AO CARRINHO"}
                onPress={addCart}
              />
              <DefaultButton title={"COMPRAR"} onPress={addAndGoToCart} />
            </>
          )}
        </Container>
      </ScrollView>
    </Background>
  );
};
