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
const ACTUALITE_DETAILS_URL = adresseIp + "actualite/show";

var days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
var months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const ActualiteDetails = ({ navigation, route }) => {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const [actualiteDetails, setActualiteDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);

  useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchActualiteDetails();
    }
  }, [actualiteDetails]);

  function fetchActualiteDetails() {
    axios
      .post(ACTUALITE_DETAILS_URL, {
        actualiteId: id,
      })
      .then((response) => {
        setActualiteDetails(response.data);
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
        <Text style={styles.headerText}>Actualité</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.newsConatainer}>
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
          <ScrollView style={{ height: windowHeight - 60 }}>
            <View style={styles.newsCard}>
              <View style={styles.newsCardImageContainer}>
                <Image
                  source={{
                    uri: `http://10.0.2.2:8000/uploads/${actualiteDetails.image}`,
                  }}
                  style={styles.newsCardImage}
                />
              </View>
            </View>
            <Text
              style={{ marginLeft: 15, fontSize: 13, color: COLORS.primary }}
            >
              <Text style={{ fontWeight: "bold" }}>Publier le : </Text>
              {days[new Date(actualiteDetails.createdAt).getDay()]}
              {", "}
              {months[new Date(actualiteDetails.createdAt).getMonth()]}{" "}
              {new Date(actualiteDetails.createdAt).getDate()}{" "}
              {new Date(actualiteDetails.createdAt).getFullYear()}
            </Text>

            <View style={styles.newsTitle}>
              <Text style={styles.newsTitleText}>{actualiteDetails.titre}</Text>
            </View>
            <View style={styles.newsContent}>
              <Text style={styles.newsContentText}>
                {actualiteDetails.description}
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ActualiteDetails;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  header: {
    width: windowWidth,
    height: 60,
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignContent: "space-between",
  },
  headerText: {
    flex: 0.6,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  newsConatainer: {
    width: windowWidth,
    backgroundColor: "white",
  },
  newsCard: {
    width: windowWidth - 20,
    height: 180,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newsCardImageContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  newsCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  newsTitle: {
    width: windowWidth - 20,
    marginTop: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 2,
  },
  newsTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  newsContent: {
    width: windowWidth - 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  newsContentText: {
    color: COLORS.transparentBlack2,
    textAlign: "justify",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 250,
  },
});
