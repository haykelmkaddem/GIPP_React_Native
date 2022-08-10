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
  ActivityIndicator,
} from "react-native";
import * as Progress from "react-native-progress";
import Categories from "../components/Home/Categories";
import FilterModal from "../components/Home/FilterModal";
import ReastaurentItem from "../components/Home/ReastaurentItems";
import HorizontalProductsCard from "../components/HorizontalProductsCard";
import SectionTitle from "../components/SectionTitle";
import VerticalProductsCard from "../components/VerticalProductsCard";
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
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import AwesomeAlert from "react-native-awesome-alerts";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../components/Carousel/CarouselCardItem";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const Produits_URL = adresseIp + "categorie/show";

const Produits = ({ navigation, route }) => {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const [produitList, setProduitList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);

  React.useEffect(() => {
    if (!playOnce) {
      fetchCategories();
      setPlayOnce(true);
    }
  }, [produitList]);

  function fetchCategories() {
    axios
      .post(Produits_URL, {
        categorieId: id,
      })
      .then((response) => {
        setProduitList(response.data.Produit);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={28}
          onPress={() => navigation.goBack()}
          style={{ flex: 0.2 }}
        />
        <Text style={styles.headerText}>Produits</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      {isLoading && (
        <View style={[styles.container, styles.horizontal]}>
          {/* <ActivityIndicator size="large" color={COLORS.logo} /> */}
          <Progress.CircleSnail
            color={[COLORS.primary, COLORS.logo]}
            size={80}
          />
        </View>
      )}

      {!isLoading && (
        <View style={styles.productListContainer}>
          <View style={styles.productList}>
            <ScrollView vertical showsVerticalScrollIndicator={false}>
              {produitList.map((item, index) => (
                <HorizontalProductsCard
                  key={index}
                  title={item.nom}
                  description={item.description}
                  img={item.image[0].imageURL}
                  price={item.prix}
                  id={item.id}
                  model={"trfyg"}
                  weight={50}
                  qt={item.stock}
                  discount={item.discount}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Produits;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  header: {
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
  productListContainer: {
    width: windowWidth,
    height: windowHeight - 100,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
