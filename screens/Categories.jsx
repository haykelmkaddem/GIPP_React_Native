import React from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { COLORS } from "../config/colors";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { SwipeListView } from "react-native-swipe-list-view";
import { adresseIp } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import AwesomeAlert from "react-native-awesome-alerts";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../components/Carousel/CarouselCardItem";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const CATEGORY_URL = adresseIp + "categorie/showall";

const Categories = ({ navigation }) => {
  const [categorieList, setCategorieList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);

  React.useEffect(() => {
    if (!playOnce) {
      fetchCategories();
      setPlayOnce(true);
    }
  }, [categorieList]);

  function fetchCategories() {
    axios
      .post(CATEGORY_URL)
      .then((response) => {
        setCategorieList(response.data.slice().reverse());
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: windowHeight }}
      >
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
            style={{ flex: 0.2 }}
          />
          <Text style={styles.headerText}>Catégories</Text>
          <View style={{ flex: 0.2 }}></View>
        </View>
        <View style={styles.categoriesListConatainer}>
          {isLoading && (
            <View style={[styles.horizontal]}>
              {/* <ActivityIndicator size="large" color={COLORS.logo} /> */}
              <Progress.CircleSnail
                color={[COLORS.primary, COLORS.logo]}
                size={80}
              />
            </View>
          )}
          {!isLoading && (
            <View style={styles.categoriesList}>
              {categorieList.map((categorie, index) => (
                <TouchableOpacity
                  style={styles.categoriesListItem}
                  key={index}
                  onPress={() =>
                    navigation.navigate("ProduitsParCategorie", {
                      id: categorie.id,
                    })
                  }
                >
                  <View style={styles.categoriesListItemText}>
                    <Text style={styles.categoriesListItemTextTitle}>
                      {categorie.nom}
                    </Text>
                  </View>
                  <View style={styles.categoriesListItemIcon}>
                    <Icon
                      name="arrow-right-alt"
                      size={28}
                      color={COLORS.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  header: {
    flex: 1,
    width: windowWidth,
    height: 60,
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignContent: "space-between",
    marginBottom: 8,
  },
  headerText: {
    flex: 0.6,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  line: {
    height: 1,
    width: "95%",
    backgroundColor: "black",
    opacity: 0.3,
    marginVertical: 10,
    alignSelf: "center",
  },
  delUpd: {
    flexDirection: "row",
  },
  categoriesListConatainer: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    // backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  categoriesListItem: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoriesListItemText: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoriesListItemTextTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  categoriesListItemIcon: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 250,
  },
});
