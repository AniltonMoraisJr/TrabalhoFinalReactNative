import style, { Container, Title, TitleBold, Box, Label } from "./styles";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "../../components/Header";

import { ButtonCard } from "../../components/ButtonCard";
import { ActivityIndicator, FlatList, View } from "react-native";
import { Background } from "../../components/Background";
import { useNavigation } from "@react-navigation/native";
import { api } from "../../api";
import { CheckIcon, Select, useToast } from "native-base";
import { ToastLayout } from "../../components/ToastLayout";
import { TabNavScreenNavigationProp } from "../../Routes/PrivateNavigation";
import { useCarrinhoStore } from "../../store/Carrinho";
import { useMyTheme } from "../../hooks/Theme.hooks";
import { BUTTON_CARD_HEIGHT } from "../../components/ButtonCard/styles";
import { useHistoricoStore } from "../../store/Historico";
import { useAuth } from "../../hooks/Auth.hooks";
import { Input } from "../../components/Input";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";

interface ItensProps {
  id: number;
  img: string;
  name: string;
  description: string;
  value: number;
  stars: number;
  type: string;
}

export const Listagem: React.FC = () => {
  const [active, setActive] = useState<number>();
  const [sort, setSort] = useState<string | null>(null);
  const [pesquisaAtiva, setPesquisaAtiva] = useState<boolean>(false);

  const [page, setPage] = useState<number>(1);
  const [buscar, setBuscar] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [list, setList] = useState<ItensProps[]>([]);
  const [last, setLast] = useState<boolean>(false);
  const toast = useToast();
  const { theme } = useMyTheme();
  const getData = async (
    pageNumber = 1,
    sort: string | null = null,
    order: string | null = null
  ) => {
    setPage(pageNumber + 1);
    if (!last || pageNumber === 1) {
      try {
        //await (new Promise(resolve => setTimeout(resolve,1000)))
        const extraParams =
          sort != null
            ? {
                params: {
                  _page: pageNumber,
                  _limit: 2,
                  _sort: sort,
                  _order: order,
                },
              }
            : {
                params: {
                  _page: pageNumber,
                  _limit: 2,
                },
              };
        const response = await api.get("games", extraParams);
        if (pageNumber === 1) {
          setList(response.data);
        } else {
          setList((atual) => [...atual, ...response.data]);
        }

        if (response.data.length === 0) setLast(true);
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
    }
  };

  const updateData = async () => {
    if (!last) {
      if (sort != null) {
        await getData(
          page,
          sort === "MAIS_AVALIADOS" || sort === "MENOS_AVALIADOS"
            ? "stars"
            : "value",
          sort === "MAIS_AVALIADOS" || sort === "MAIS_CAROS" ? "DESC" : "ASC"
        );
      } else {
        await getData(page);
      }
    }
  };

  const reset = async () => {
    setRefreshing(true);
    setLast(false);
    await getData(1);
    setRefreshing(false);
  };

  const changeSort = async (itemValue: string) => {
    setRefreshing(true);
    setLast(false);
    setSort(itemValue);
    await getData(
      1,
      itemValue === "MAIS_AVALIADOS" || itemValue === "MENOS_AVALIADOS"
        ? "stars"
        : "value",
      itemValue === "MAIS_AVALIADOS" || itemValue === "MAIS_CAROS"
        ? "DESC"
        : "ASC"
    );
    setRefreshing(false);
  };

  const navigation = useNavigation<TabNavScreenNavigationProp>();
  const addItem = useCarrinhoStore((state) => state.addItem);
  const loadData = useHistoricoStore((state) => state.loadData);
  const { user } = useAuth();

  const addCart = useCallback(
    (item: ItensProps) => () => {
      addItem({
        jogoId: item.id,
        titulo: item.name,
        valor: item.value,
      });
    },
    [addItem]
  );

  useEffect(() => {
    if (user) {
      getData(1);
      loadData(user.id, user.email);
    }
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <ButtonCard
        item={item}
        activeId={active}
        setActive={setActive}
        addCart={addCart(item)}
        goDetail={(id) => {
          navigation.navigate("Detalhes", { id });
        }}
      />
    ),
    [active, addCart, setActive]
  );

  const filter = useMemo(
    () =>
      !!buscar
        ? list.filter((item) =>
            item.name.toUpperCase().includes(buscar.toUpperCase())
          )
        : list,
    [list, buscar]
  );
  return (
    <Background>
      <Header
        letf={() => (
          <FontAwesome5
            name={`search`}
            size={26}
            color={theme.colors.primary}
            onPress={() => setPesquisaAtiva(true)}
          />
        )}
        extra={() => (
          <>
            {pesquisaAtiva && (
              <Box>
                <Input
                  placeholder="BUSCAR"
                  onChangeText={setBuscar}
                  value={buscar}
                  color={"#FFFFFF"}
                  right={() => (
                    <FontAwesome
                      name={`close`}
                      size={26}
                      color={theme.colors.danger}
                      style={{ marginRight: -5, marginLeft: 10 }}
                      onPress={() => {
                        setPesquisaAtiva(false);
                        setBuscar("");
                      }}
                    />
                  )}
                  left={() => (
                    <FontAwesome5
                      name={`search`}
                      size={26}
                      color={theme.colors.primary}
                      style={{ marginRight: 10, marginLeft: -5 }}
                    />
                  )}
                />
              </Box>
            )}
          </>
        )}
        backFalse
      >
        <Title>
          <TitleBold>My</TitleBold>Collection
        </Title>
      </Header>
      <Container>
        <View
          style={{
            height: 40,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Label>Ordernar: </Label>
          <Select
            selectedValue={sort || undefined}
            minWidth={200}
            accessibilityLabel="Ordernar por"
            placeholder="Ordernar por"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />,
            }}
            onValueChange={changeSort}
          >
            <Select.Item label="Mais avaliados" value="MAIS_AVALIADOS" />
            <Select.Item label="Menos avaliados" value="MENOS_AVALIADOS" />
            <Select.Item label="Mais caros" value="MAIS_CAROS" />
            <Select.Item label="Menos caros" value="MENOS_CAROS" />
          </Select>
        </View>
        <FlatList<ItensProps>
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          style={style.flatList}
          onRefresh={reset}
          refreshing={refreshing}
          onEndReached={updateData}
          onEndReachedThreshold={0.01}
          ListFooterComponent={() => {
            if (!last) {
              return (
                <View
                  style={{
                    height: 60,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator
                    size={"large"}
                    color={theme.colors.primary}
                  />
                </View>
              );
            }
            return null;
          }}
          getItemLayout={(data, index) => ({
            length: BUTTON_CARD_HEIGHT,
            offset: BUTTON_CARD_HEIGHT * index,
            index,
          })}
          numColumns={2}
          data={filter}
        />
      </Container>
    </Background>
  );
};
