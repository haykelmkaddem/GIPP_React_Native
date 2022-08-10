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
  TouchableWithoutFeedback,
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
const COMMANDE_URL = adresseIp + "commande/showusercommande";

// my orders
const OrderList = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [commande, setCommande] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);
  const [userId, setUserId] = React.useState(0);
  const [showAlert, setShowAlert] = useState(false);

  React.useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("id");
      if (value != null) {
        setUserId(value);
      }
      console.log("userId: ", value);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!playOnce && userId != 0) {
      fetchCommande();
      setPlayOnce(true);
    }
  }, [commande, userId]);

  function fetchCommande() {
    axios
      .post(COMMANDE_URL, {
        userId: userId,
      })
      .then((response) => {
        setCommande(response.data.slice().reverse());
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
        <Text style={styles.headerText}>Mes Commandes</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>

      {/* Page Body */}
      <View style={styles.body}>
        {/* order list container */}
        <View style={styles.orderListContainer}>
          {/* order list header */}
          <View style={styles.orderListHeader}>
            <Text style={styles.orderListHeaderText}>Mes Commandes</Text>
          </View>
          {/* order list */}
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
            <ScrollView style={styles.orderList}>
              {commande.length === 0 ? (
                <View style={styles.noOrderContainer}>
                  <Text style={styles.noOrderText}>
                    Vous n'avez pas de commande
                  </Text>
                </View>
              ) : (
                <>
                  {commande.map((comm, index) => (
                    <TouchableWithoutFeedback
                      key={index}
                      onPress={() =>
                        navigation.navigate("OrderDetails", {
                          id: comm.id,
                        })
                      }
                    >
                      <View style={styles.orderListItem}>
                        {comm.statut_commande == "Livrée" && (
                          <View style={styles.orderListItemStateIconContainer}>
                            <Icon
                              name="check"
                              style={styles.orderListItemStateIcon}
                            />
                          </View>
                        )}
                        {comm.statut_commande == "En Cours" && (
                          <View
                            style={[
                              styles.orderListItemStateIconContainer,
                              { backgroundColor: "orange" },
                            ]}
                          >
                            <Icon
                              name="hourglass-bottom"
                              style={styles.orderListItemStateIcon}
                            />
                          </View>
                        )}
                        {comm.statut_commande == "Annulée" && (
                          <View
                            style={[
                              styles.orderListItemStateIconContainer,
                              { backgroundColor: "red" },
                            ]}
                          >
                            <Icon
                              name="close"
                              style={styles.orderListItemStateIcon}
                            />
                          </View>
                        )}
                        <View style={styles.orderListItemInfoContainer}>
                          {/* order ref */}
                          <Text
                            style={styles.orderListItemInfoTitle}
                            numberOfLines={2}
                          >
                            Commande #{comm.reference}
                          </Text>

                          <Text style={styles.orderListItemInfoTotalProducts}>
                            {comm.produitVendus.length} produits
                          </Text>
                        </View>
                        <View style={styles.orderListItemPriceContainer}>
                          <Text style={styles.orderListItemPriceText}>
                            {comm.totale}TND
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderList;

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
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderListContainer: {
    width: windowWidth,
    backgroundColor: "white",
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  orderListHeader: {
    width: windowWidth,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  orderListHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  orderList: {
    width: windowWidth,
    height: windowHeight - 166,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: 10,
  },
  orderListItem: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  orderListItemStateIconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 25,
  },
  orderListItemStateIcon: {
    color: "white",
    fontSize: 30,
  },
  orderListItemInfoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  orderListItemInfoTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  orderListItemInfoTotalProducts: {
    fontSize: 12,
    color: "black",
  },
  orderListItemPriceContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 25,
  },
  orderListItemPriceText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "black",
  },
  horizontal: {
    height: windowHeight - 166,
    flexDirection: "row",
    paddingTop: -250,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
