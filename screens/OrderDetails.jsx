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
const COMMANDE_URL = adresseIp + "commande/show";

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

// order Detail
const OrderDetails = ({ navigation, route }) => {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const [commandeDetails, setCommandeDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);

  useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchCommandeDetails();
    }
  }, [commandeDetails]);

  function fetchCommandeDetails() {
    axios
      .post(COMMANDE_URL, {
        commandeId: id,
      })
      .then((response) => {
        setCommandeDetails(response.data);
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
        {!isLoading && (
          <Text style={styles.headerText}>
            Ref #{commandeDetails.reference}
          </Text>
        )}

        <View style={{ flex: 0.2 }}></View>
      </View>
      {/* Page Body */}
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
        <View style={styles.body}>
          <ScrollView>
            <View style={styles.orderDetailsHeader}>
              <View style={styles.orderDetailsHeaderLeft}>
                {commandeDetails.statut_commande == "Livrée" && (
                  <View style={styles.orderListItemStateIconContainer}>
                    <Icon
                      name="check-circle"
                      style={{ fontSize: 70, color: "green" }}
                    />
                  </View>
                )}
                {commandeDetails.statut_commande == "En Cours" && (
                  <View
                    style={[
                      {
                        backgroundColor: "orange",
                        width: 80,
                        height: 80,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                      },
                    ]}
                  >
                    <Icon
                      name="hourglass-bottom"
                      style={{ fontSize: 60, color: "white" }}
                    />
                  </View>
                )}
                {commandeDetails.statut_commande == "Annulée" && (
                  <View
                    style={[
                      styles.orderListItemStateIconContainer,
                      { backgroundColor: "red" },
                    ]}
                  >
                    <Icon
                      name="close"
                      style={{ fontSize: 70, color: "white" }}
                    />
                  </View>
                )}
                <Text style={styles.orderDetailsHeaderText}>
                  Commande passée le{" "}
                  <Text style={styles.orderDetailsHeaderTextDate}>
                    {days[new Date(commandeDetails.created_at).getDay()] + ", "}
                    {new Date(commandeDetails.created_at).getDate() + " "}
                    {months[new Date(commandeDetails.created_at).getMonth()] +
                      " "}

                    {new Date(commandeDetails.created_at).getFullYear()}
                  </Text>
                </Text>
              </View>
              <View>
                <View style={styles.orderDetailsHeaderRightTop}>
                  {/* total produits */}
                  <Text style={styles.orderDetailsHeaderRightTopTitre}>
                    Total
                  </Text>
                  <Text style={styles.orderDetailsHeaderRightTopValeur}>
                    {commandeDetails.totale} TND
                  </Text>
                </View>
                <View style={styles.orderDetailsHeaderRightBottom}>
                  <Text style={styles.orderDetailsHeaderRightTopTitre}>
                    {commandeDetails.produitVendus.length}
                  </Text>
                  <Text style={styles.orderDetailsHeaderRightTopValeur}>
                    Produits
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.orderDetailsBody}>
              <View style={styles.orderDetailsBodySectionTitleCard}>
                <View style={styles.orderDetailsBodySectionTitle}>
                  <Text style={styles.orderDetailsBodySectionTitleText}>
                    Methode de paiement
                  </Text>
                </View>
                <View style={styles.orderDetailsBodySection}>
                  <Text style={styles.orderDetailsBodySectionText}>
                    Paiement à la livraison
                  </Text>
                </View>
              </View>
              {/* section title */}
              <View style={styles.orderDetailsBodySectionTitleCard}>
                <View style={styles.orderDetailsBodySectionTitle}>
                  <Text style={styles.orderDetailsBodySectionTitleText}>
                    Adresse de livraison
                  </Text>
                </View>
                <View style={styles.orderDetailsBodySection}>
                  <Text style={styles.orderDetailsBodySectionText}>
                    {commandeDetails.user.entreprise.adresse}{" "}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetailsBodySectionTitle}>
                <Text style={styles.orderDetailsBodySectionTitleText}>
                  Liste des produits
                </Text>
              </View>
              <View style={styles.orderDetailsProductListContainer}>
                {commandeDetails.produitVendus.map((produit, index) => (
                  <View style={styles.orderDetailsProductListItem} key={index}>
                    <View style={styles.orderDetailsProductListItemLeft}>
                      <Text style={styles.orderDetailsProductListItemLeftText}>
                        {produit.quantite}x
                      </Text>
                      <Text style={styles.orderDetailsProductListItemLeftText}>
                        {produit.nom}
                      </Text>
                      <Text style={styles.orderDetailsProductListItemRightText}>
                        {produit.prix} TND
                      </Text>
                    </View>
                  </View>
                ))}
                <View style={styles.orderDetailsProductListItem}>
                  <View style={styles.orderDetailsProductListItemLeft}>
                    <Text style={styles.orderDetailsProductListItemLeftText}>
                      648x
                    </Text>
                    <Text style={styles.orderDetailsProductListItemLeftText}>
                      rftyuh
                    </Text>
                    <Text style={styles.orderDetailsProductListItemRightText}>
                      TND
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderDetails;

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
  body: {
    width: windowWidth,
    height: windowHeight - 50,
    backgroundColor: "white",
  },
  orderDetailsHeader: {
    width: windowWidth,
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderDetailsHeaderLeft: {
    width: windowWidth / 2 - 10,
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderDetailsHeaderRightTop: {
    width: windowWidth / 2 - 20,
    marginLeft: 10,
    marginBottom: 5,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderDetailsHeaderRightBottom: {
    width: windowWidth / 2 - 20,
    marginLeft: 10,
    marginTop: 5,
    height: 100,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orderDetailsHeaderText: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderDetailsHeaderTextDate: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
  },
  orderListItemStateIcon: {
    fontSize: 70,
    color: "green",
  },
  orderListItemStateIconContainer: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  orderDetailsHeaderRightTopTitre: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
  },
  orderDetailsHeaderRightTopValeur: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: COLORS.primary,
  },
  orderDetailsBody: {
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
  orderDetailsBodyTitle: {
    height: 50,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  orderDetailsBodyTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderDetailsBodySectionTitleCard: {
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderDetailsBodySectionTitle: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
  },
  orderDetailsBodySectionTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderDetailsBodySection: {
    height: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  orderDetailsBodySectionText: {
    fontSize: 15,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  orderDetailsProductListContainer: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    justifyContent: "center",
  },
  orderDetailsProductListItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
  orderDetailsProductListItemLeft: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderDetailsProductListItemLeftText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  orderDetailsProductListItemRightText: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  horizontal: {
    height: windowHeight,
    width: windowWidth,
    flexDirection: "row",
    paddingTop: -250,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
