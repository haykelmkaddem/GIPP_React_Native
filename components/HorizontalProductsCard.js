import React from "react";
import { Image, TouchableOpacity, View, Text, Dimensions } from "react-native";
import { COLORS } from "../config/colors";
import { useNavigation } from "@react-navigation/native";

function HorizontalProductsCard(props) {
  const navigation = useNavigation();
  let width = Dimensions.get("window").width;
  let disponible = "";
  let qt = 5;
  if (qt > 0) {
    disponible = "En Stock";
  } else {
    disponible = "Hors Stock";
  }
  return (
    <View>
      {props.discount !== null && (
        <View
          style={{
            position: "absolute",
            top: 5,
            right: 25,
            backgroundColor: "red",
            zIndex: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              padding: 5,
            }}
          >
            -{(100 - (props.discount * 100) / props.price).toFixed(2)}%
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          borderRadius: 10,
          backgroundColor: COLORS.white,
          paddingVertical: 15,
          height: 150,
          paddingHorizontal: 0,
          marginVertical: 5,
          marginHorizontal: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          navigation.navigate("Details", {
            id: props.id,
          });
        }}
      >
        {props.qt > 0 && (
          <Text
            style={{
              backgroundColor: "green",
              borderRadius: 20,
              paddingLeft: 10,
              paddingRight: 10,
              height: 20,
              margin: 5,
              color: COLORS.white,
              position: "absolute",
              top: 5,
              left: 5,
              zIndex: 1,
            }}
          >
            En Stock
          </Text>
        )}
        {props.qt <= 0 && (
          <Text
            style={{
              backgroundColor: "red",
              borderRadius: 20,
              paddingLeft: 10,
              paddingRight: 10,
              height: 20,
              margin: 5,
              color: COLORS.white,
              position: "absolute",
              top: 5,
              left: 5,
              zIndex: 1,
            }}
          >
            Hors Stock
          </Text>
        )}
        <Image
          style={{
            width: 140,
            height: 150,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            resizeMode: "cover",
          }}
          // source={require("../assets/images/logo.png")}
          // source={props.img}
          source={{
            uri: `http://10.0.2.2:8000/uploads/${props.img}`,
          }}
        />

        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              width: "65%",
            }}
            numberOfLines={2}
          >
            {props.title}
          </Text>
          <Text
            style={{
              color: "#5B5A5F",
            }}
            numberOfLines={2}
          >
            {props.description}
          </Text>

          <View
            style={{
              flexDirection: "row-reverse",
              marginTop: 10,
            }}
          >
            {props.discount == null ? (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  backgroundColor: COLORS.logo,
                  marginRight: -15,
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  color: COLORS.white,
                }}
              >
                {props.price} TND
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  backgroundColor: COLORS.logo,
                  marginRight: -15,
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  color: COLORS.white,
                }}
              >
                {props.discount} TND
              </Text>
            )}
            {props.discount !== null && (
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  backgroundColor: COLORS.secondary,
                  textDecorationLine: "line-through",
                  padding: 0,
                  height: 20,
                  paddingHorizontal: 10,
                  marginRight: 5,
                  borderRadius: 20,
                  marginTop: 8,
                }}
              >
                {props.price} TND
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default HorizontalProductsCard;
