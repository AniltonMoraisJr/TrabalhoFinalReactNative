import {
  ActionColumn,
  Box,
  Container,
  ContainerList,
  ItemContainer,
  Text,
  Title,
  Trash,
} from "./styles";
import { DefaultButton } from "../../components/DefaultButton";
import React, { useMemo, useState } from "react";
import { Header } from "../../components/Header";
import { ScrollView } from "react-native";
import { Background } from "../../components/Background";
import { ItemCarrinho, useCarrinhoStore } from "../../store/Carrinho";
import { AlertDialog, Button, useToast } from "native-base";
import { api } from "../../api";
import { useAuth } from "../../hooks/Auth.hooks";
import { ToastLayout } from "../../components/ToastLayout";
import { useNavigation } from "@react-navigation/native";
import { CartScreenTabNavigationProps } from "../../Routes/TabsNavigation";
import { useHistoricoStore } from "../../store/Historico";

export const Carrinho: React.FC = () => {
  const removeItemStorte = useCarrinhoStore((state) => state.removeItem);
  const carrinho = useCarrinhoStore((state) => state.carrinho);
  const clear = useCarrinhoStore((state) => state.clear);
  const [itemWillDeleted, setItemWillDeleted] = useState<
    ItemCarrinho | undefined
  >(undefined);

  const onClose = () => setItemWillDeleted(undefined);

  const cancelRef = React.useRef(null);

  const [load, setload] = useState<boolean>(false);
  const { user } = useAuth();
  const toast = useToast();
  const navigation = useNavigation<CartScreenTabNavigationProps>();
  const loadData = useHistoricoStore((state) => state.loadData);

  const sendToBuy = async () => {
    setload(true);
    try {
      if (user) {
        const response = await api.post("pedidos", {
          userId: user.id,
          userEmail: user.email,
          items: carrinho,
        });
        setload(false);
        clear();
        await loadData(user.id, user.email);
        navigation.navigate("Home");
        toast.show({
          placement: "top-right",
          render: ({ id }) => {
            return ToastLayout.success({
              id,
              description: "Compras realizada com sucesso",
              close: toast.close,
            });
          },
        });
      } else {
        setload(false);
        toast.show({
          placement: "top-right",
          render: ({ id }) => {
            return ToastLayout.error({
              id,
              description:
                "N??o foi possivel realizar seu pedido, por favor relogue no sistema",
              close: toast.close,
            });
          },
        });
      }
    } catch (e: any) {
      setload(false);
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

  const removeItem = (item: ItemCarrinho) => () => setItemWillDeleted(item);
  const confirmRemoveItem = () => {
    if (itemWillDeleted) {
      removeItemStorte(itemWillDeleted.jogoId);
    }
    setItemWillDeleted(undefined);
  };

  const total = useMemo(
    () =>
      [0, ...carrinho.map((item) => item.valor)].reduce(
        (primeiro, segundo) => primeiro + segundo
      ),
    [carrinho]
  );

  return (
    <Background>
      <Header title={"Meu Carrinho"} backFalse />
      <ContainerList>
        <Box marginBottom={10}>
          <Title maxWidth={60}>A????O</Title>
          <Title>TITULO</Title>
          <Title maxWidth={80} align={"right"}>
            VALOR
          </Title>
        </Box>
        <ScrollView>
          {carrinho.map((item) => (
            <ItemContainer key={`item-${item.jogoId}`}>
              <ActionColumn maxWidth={71}>
                <Trash
                  name="trash"
                  size={24}
                  color="black"
                  onPress={removeItem(item)}
                />
              </ActionColumn>
              <Text>{item.titulo}</Text>
              <Text maxWidth={80} align={"right"}>
                R${item.valor.toFixed(2).toString().replace(".", ",")}
              </Text>
            </ItemContainer>
          ))}
        </ScrollView>
        <ItemContainer borderTop>
          <Title noFlex>TOTAL</Title>
          <Text marginLeft={10} noFlex>
            R${total.toFixed(2).toString().replace(".", ",")}
          </Text>
        </ItemContainer>
      </ContainerList>
      {total > 0 && (
        <Container>
          <DefaultButton
            isDangerButton
            title={"LIMPAR CARRINHO"}
            loading={load}
            onPress={clear}
          />
        </Container>
      )}
      {total > 0 && (
        <Container>
          <DefaultButton
            title={"FINALIZAR COMPRA"}
            loading={load}
            onPress={sendToBuy}
          />
        </Container>
      )}
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={!!itemWillDeleted}
        onClose={onClose}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete</AlertDialog.Header>
          <AlertDialog.Body>
            Deseja Remover o Item: {itemWillDeleted?.titulo}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}
              >
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={confirmRemoveItem}>
                Remover
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Background>
  );
};
