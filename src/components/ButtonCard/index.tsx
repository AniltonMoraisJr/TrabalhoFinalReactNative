import {
  Container,
  ContainerButton,
  ContainerCard,
  ImageCard,
  Label,
  ItemTitle,
  ItemTitleBold,
} from "./styles";
import { DefaultButton } from "../DefaultButton";
import {
  Alert,
  LayoutAnimation,
  NativeModules,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { memo, useMemo } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useHistoricoStore } from "../../store/Historico";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface ItensProps {
  id: number;
  img: string;
  name: string;
  description: string;
  value: number;
  stars: number;
  type: string;
}
interface ButtonCardProps {
  item: ItensProps;
  addCart: (item: ItensProps) => void;
  goDetail: (id: number) => void;
  setActive: (id?: number) => void;
  activeId?: number;
}

export const ButtonCard: React.FC<ButtonCardProps> = memo<ButtonCardProps>(
  ({ item, goDetail, addCart, activeId, setActive }) => {
    const changeActive = () => {
      LayoutAnimation.linear();
      if (activeId === item.id) setActive();
      else setActive(item.id);
    };
    const historico = useHistoricoStore((store) => store.historico);
    const isMyne = historico.map((it) => it.jogoId).includes(item.id);

    const stars = useMemo(() => {
      if (item) {
        let starsArray = [];
        for (let i = 1; i <= item.stars; i++) {
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
    }, [item]);

    return (
      <Container>
        <ContainerButton onPress={changeActive}>
          <ImageCard source={{ uri: item.img }}>
            {isMyne && <Label>ADQUERIDO</Label>}
            {activeId === item.id && (
              <TouchableWithoutFeedback onPress={changeActive}>
                <ContainerCard>
                  <ItemTitle ellipsizeMode={"clip"} numberOfLines={2}>
                    {item.name}
                  </ItemTitle>

                  <ItemTitleBold>
                    R$ {item.value.toFixed(2).toString().replace(".", ",")}
                  </ItemTitleBold>
                  <DefaultButton
                    title={"DETALHES"}
                    onPress={() => goDetail(item.id)}
                  />
                  {!isMyne && (
                    <DefaultButton
                      title={"ADD CART"}
                      onPress={() => addCart(item as any)}
                    />
                  )}
                </ContainerCard>
              </TouchableWithoutFeedback>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                position: "absolute",
                top: "85%",
                backgroundColor: "rgba(0,0,0,0.5)",
                alignItems: "center",
              }}
            >
              {stars}
            </View>
          </ImageCard>
        </ContainerButton>
      </Container>
    );
  }
);
