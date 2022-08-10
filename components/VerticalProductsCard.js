import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../config/colors";
import { useNavigation } from "@react-navigation/native";

function VerticalProductsCard(props) {
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
    <TouchableOpacity
      style={{
        flexDirection: "column",
        borderRadius: 20,
        backgroundColor: COLORS.white,
        height: 350,
        width: 200,
        marginVertical: 10,
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
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 15,
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
      <Image
        style={{
          width: 200,
          height: 200,
          resizeMode: "cover",
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
        //source={ props.imageUri }
        source={{
          uri: `http://10.0.2.2:8000/uploads/${props.img}`,
        }}
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingVertical: 15,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
          }}
          numberOfLines={1}
        >
          {props.title}
        </Text>
        <Text
          style={{
            color: "#5B5A5F",
          }}
          numberOfLines={3}
        >
          {props.description}
        </Text>

        <Text
          style={{
            // fontSize: width / 24,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 20,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              color: "#5B5A5F",
              textDecorationLine: "line-through",
              fontWeight: "normal",
              fontSize: 14,
            }}
          >
            {props.price} TND
          </Text>{" "}
          {props.discount} TND
        </Text>
      </View>
      {props.qt > 0 && (
        <Text
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: props.qt > 0 ? "green" : "red",
            borderRadius: 20,
            paddingLeft: 10,
            paddingRight: 10,
            color: COLORS.white,
          }}
        >
          En Stock
        </Text>
      )}
      {props.qt <= 0 && (
        <Text
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            backgroundColor: props.qt > 0 ? "green" : "red",
            borderRadius: 20,
            paddingLeft: 10,
            paddingRight: 10,
            color: COLORS.white,
          }}
        >
          Hors Stock
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default VerticalProductsCard;
