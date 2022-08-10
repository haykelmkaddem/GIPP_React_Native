import React from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../config/colors";
const items = [
  {
    id: 0,
    image: require("../../assets/images/logo.png"),
    text: "Printers",
  },
  {
    id: 1,
    image: require("../../assets/images/logo.png"),
    text: "Phones and Tablets",
  },
  {
    id: 2,
    image: require("../../assets/images/logo.png"),
    text: "Category 3",
  },
  {
    id: 3,
    image: require("../../assets/images/logo.png"),
    text: "Category 4",
  },
  {
    id: 4,
    image: require("../../assets/images/logo.png"),
    text: "Category 5",
  },
  {
    id: 5,
    image: require("../../assets/images/logo.png"),
    text: "Category 6",
  },
  {
    id: 6,
    image: require("../../assets/images/logo.png"),
    text: "Category 7",
  },
];
function Categories({ categorieList, childToParent }) {
  const [selectedCat, setSelectedCat] = React.useState(-1);
  const [isLoading, setLoading] = React.useState(false);

  return (
    <View
      style={{
        marginTop: 5,
        backgroundColor: COLORS.white,
        paddingVertical: 10,
        paddingLeft: 20,
      }}
    >
      {isLoading ? (
        <Text>الرجاء الانتظار...</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categorieList.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (item.id != selectedCat) {
                  setSelectedCat(item.id);
                  childToParent(item.nom);
                } else {
                  setSelectedCat(-1);
                  childToParent("");
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  backgroundColor: COLORS.secondary,
                  padding: 5,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor:
                    item.id == selectedCat ? COLORS.primary : COLORS.secondary,
                }}
              >
                {/* <Image
                  source={require("../../assets/images/logo.png")}
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: "contain",
                  }}
                /> */}
                {/* <Ionicons name="pricetags" /> */}
                <Ionicons name="pricetags" size={20} color={COLORS.logo} />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    marginLeft: 10,
                    color: item.id == selectedCat ? COLORS.white : COLORS.black,
                  }}
                >
                  {" "}
                  {item.nom}{" "}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

export default Categories;
