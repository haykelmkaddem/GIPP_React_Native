import React from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { COLORS } from "../../config/colors";
import MaterialComunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const localRestaurents = [
  {
    name: "Restaurent 1",
    categories: ["cafe", "bar"],
    price: "15$",
    reviews: 1244,
    rating: 4,
    image: require("../../assets/images/logo.png"),
  },
  {
    name: "Restaurent 2",
    categories: ["restaurent", "bar"],
    price: "55$",
    reviews: 1244,
    rating: 4,
    image: require("../../assets/images/logo.png"),
  },
  {
    name: "Restaurent 3",
    categories: ["cafe", "bar"],
    price: "5$",
    reviews: 1244,
    rating: 3,
    image: require("../../assets/images/logo.png"),
  },
];
function ReastaurentItem(props) {
  return (
    <TouchableOpacity
      style={{
        marginBottom: 15,
      }}
    >
      {localRestaurents.map((restaurent, index) => (
        <View
          key={index}
          style={{
            marginTop: 10,
            padding: 15,
            backgroundColor: COLORS.white,
          }}
        >
          <RestaurentImage image={restaurent.image} />
          <RestaurentInfo rating={restaurent.rating} name={restaurent.name} />
        </View>
      ))}
    </TouchableOpacity>
  );
}
const RestaurentImage = (props) => (
  <>
    <Image
      source={props.image}
      style={{
        width: "100%",
        height: 180,
      }}
    />
    <TouchableOpacity
      style={{
        position: "absolute",
        right: 20,
        top: 20,
      }}
    >
      <MaterialComunityIcons name="heart-outline" size={25} color="white" />
    </TouchableOpacity>
  </>
);

const RestaurentInfo = (props) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    }}
  >
    <View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: "bold",
        }}
      >
        {props.name}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: "gray",
        }}
      >
        30 - 40 • min
      </Text>
    </View>
    <View
      style={{
        backgroundColor: COLORS.secondary,
        height: 30,
        width: 30,
        alignItems: "center",
        borderRadius: 50,
        padding: 5,
      }}
    >
      <Text> {props.rating} </Text>
    </View>
  </View>
);

export default ReastaurentItem;
