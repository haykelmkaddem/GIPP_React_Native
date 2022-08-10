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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import IconEntypo from "react-native-vector-icons/Entypo";
import { borderColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import { SwipeListView } from "react-native-swipe-list-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import AwesomeAlert from "react-native-awesome-alerts";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../components/Carousel/CarouselCardItem";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const SALON_URL = adresseIp + "salon/showall";

const Salons = ({ navigation }) => {
  const [salonList, setSalonList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);
  const [value, setValue] = React.useState(0);
  const [lieu, setLieu] = React.useState([]);
  const [searchLieu, setSearchLieu] = React.useState("");
  const [searchDate, setSearchDate] = React.useState("");
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchSalons();
    }
  }, [salonList]);

  function fetchSalons() {
    axios
      .get(SALON_URL)
      .then((response) => {
        setSalonList(response.data.slice().reverse());
        let l = [];
        for (let index = 0; index < response.data.length; index++) {
          l.push(response.data[index].lieu);
        }
        let lieuList = [];
        for (let index = 0; index < l.length; index++) {
          if (!lieuList.includes(l[index])) {
            lieuList.push(l[index]);
          }
        }
        setLieu(lieuList);
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
        <Text style={styles.headerText}>Salons</Text>
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
              {salonList.map((salon, index) => (
                <TouchableOpacity
                  style={styles.eventCard}
                  key={index}
                  onPress={() =>
                    navigation.navigate("SalonDetails", { id: salon.id })
                  }
                >
                  <View
                    style={{
                      backgroundColor:
                        salon.max_invitation == salon.reservation.length
                          ? "red"
                          : COLORS.primary,
                      width: windowWidth / 3.3,
                    }}
                  >
                    <Text style={styles.eventCardDay}>
                      {salon.date.substr(8, 2)}
                    </Text>
                    <Text style={styles.eventCardDate}>
                      {salon.date.substr(5, 2) + "/" + salon.date.substr(0, 4)}
                    </Text>
                    <Text style={styles.eventCardTime}>
                      {salon.temps_debut.substr(11, 5)}
                      {"-"}
                      {salon.temps_fin.substr(11, 5)}
                    </Text>
                  </View>
                  <View style={styles.eventCardInformations}>
                    <View style={styles.eventCardInformationsTitle}>
                      <Text style={styles.eventCardInformationsTitleText}>
                        {salon.titre}
                      </Text>
                    </View>

                    <View style={styles.eventCardInformationsDescription}>
                      <Text
                        style={styles.eventCardInformationsDescriptionText}
                        numberOfLines={3}
                      >
                        {salon.description}
                      </Text>
                    </View>
                    <View style={styles.eventCardInformationsPlaces}>
                      <Text style={styles.eventCardInformationsPlacesText}>
                        Places :
                      </Text>
                      <View style={styles.eventCardInformationsPlacesContainer}>
                        <View style={styles.eventCardInformationsPlacesNumber}>
                          <Text
                            style={
                              styles.eventCardInformationsPlacesNumberTitle
                            }
                          >
                            Totale
                          </Text>
                          <Text
                            style={styles.eventCardInformationsPlacesNumberText}
                          >
                            {salon.max_invitation}
                          </Text>
                        </View>
                        <View style={styles.eventCardInformationsPlacesNumber}>
                          <Text
                            style={
                              styles.eventCardInformationsPlacesNumberTitle
                            }
                          >
                            Réservées
                          </Text>
                          <Text
                            style={styles.eventCardInformationsPlacesNumberText}
                          >
                            {salon.reservation.length}
                          </Text>
                        </View>
                        <View style={styles.eventCardInformationsPlacesNumber}>
                          <Text
                            style={
                              styles.eventCardInformationsPlacesNumberTitle
                            }
                          >
                            Disponibles
                          </Text>
                          <Text
                            style={styles.eventCardInformationsPlacesNumberText}
                          >
                            {salon.max_invitation - salon.reservation.length}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Salons;

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
    marginBottom: 8,
  },
  headerText: {
    flex: 0.6,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  eventCard: {
    flex: 1,
    flexDirection: "row",
    height: 180,
    width: windowWidth - 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  eventCardDateAndTimeDisponible: {
    backgroundColor: COLORS.primary,
    width: windowWidth / 3.5,
  },
  eventCardDateAndTimeIndisponible: {
    backgroundColor: "red",
    width: windowWidth / 3.5,
  },
  eventCardDay: {
    fontSize: 30,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 30,
  },
  eventCardDate: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  eventCardTime: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  eventCardInformations: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  eventCardInformationsTitle: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventCardInformationsTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  eventCardInformationsDescription: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventCardInformationsDescriptionText: {
    fontSize: 15,
    color: "black",
  },

  eventCardInformationsPlaces: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  eventCardInformationsPlacesText: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  eventCardInformationsPlacesContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventCardInformationsPlacesNumber: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  eventCardInformationsPlacesNumberTitle: {
    fontSize: 13,
    color: COLORS.transparentBlack3,
  },
  eventCardInformationsPlacesNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.transparentBlack3,
    alignItems: "center",
  },
  eventCardDisponibilityBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 50,
    padding: 3,
    marginHorizontal: 10,
    marginVertical: 10,
    width: windowWidth / 3.5,
  },
  eventCardDisponibilityBadgeIcon: {
    backgroundColor: "white",
    color: "green",
    borderRadius: 50,
    marginRight: 5,
    marginLeft: 3,
  },
  eventCardDisponibilityBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  productListContainer: {
    width: windowWidth,
    height: windowHeight - 100,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: -50,
  },
});
