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

const Profile = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [userId, setUserId] = React.useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      const nom = await AsyncStorage.getItem("nom");
      const prenom = await AsyncStorage.getItem("prenom");
      if (email != null && nom != null && prenom != null) {
        setEmail(JSON.parse(email));
        setNom(JSON.parse(nom));
        setPrenom(JSON.parse(prenom));
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const removeData = async () => {
    try {
      await AsyncStorage.removeItem("nom");
      await AsyncStorage.removeItem("prenom");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("id");
    } catch (e) {
      console.log(e);
    }
  };

  function logout() {
    removeData();
    navigation.navigate("Login");
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
        <Text style={styles.headerText}>Mon Profile</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
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
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{prenom + " " + nom}</Text>
            <Text style={styles.profileEmail}>{email}</Text>
          </View>
          <View style={styles.profileMenu}>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.profileMenuItem}>
                <View style={styles.profileMenuItemIconContainer}>
                  <FontAwesome5
                    name="edit"
                    style={styles.profileMenuItemIcon}
                  />
                </View>
                <View style={styles.profileMenuItemTextContainer}>
                  <Text style={styles.profileMenuItemText}>
                    Modifier mes informations
                  </Text>
                </View>
                <View style={styles.profileMenuItemIconContainer2}>
                  <IconEntypo
                    name="chevron-thin-right"
                    style={styles.profileMenuItemIcon2}
                  />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("EditPassword")}
            >
              <View style={styles.profileMenuItem}>
                <View style={styles.profileMenuItemIconContainer}>
                  <FontAwesome5
                    name="lock"
                    style={styles.profileMenuItemIcon}
                  />
                </View>
                <View style={styles.profileMenuItemTextContainer}>
                  <Text style={styles.profileMenuItemText}>
                    Modifier mon mot de passe
                  </Text>
                </View>
                <View style={styles.profileMenuItemIconContainer2}>
                  <IconEntypo
                    name="chevron-thin-right"
                    style={styles.profileMenuItemIcon2}
                  />
                </View>
              </View>
            </TouchableOpacity>
            {/* Mes commandes */}
            <TouchableOpacity onPress={() => navigation.navigate("OrderList")}>
              <View style={styles.profileMenuItem}>
                <View style={styles.profileMenuItemIconContainer}>
                  <FontAwesome5
                    name="list"
                    style={styles.profileMenuItemIcon}
                  />
                </View>
                <View style={styles.profileMenuItemTextContainer}>
                  <Text style={styles.profileMenuItemText}>Mes commandes</Text>
                </View>
                <View style={styles.profileMenuItemIconContainer2}>
                  <IconEntypo
                    name="chevron-thin-right"
                    style={styles.profileMenuItemIcon2}
                  />
                </View>
              </View>
            </TouchableOpacity>
            {/* Mon panier */}
            <TouchableOpacity onPress={() => navigation.navigate("MyCart")}>
              <View style={styles.profileMenuItem}>
                <View style={styles.profileMenuItemIconContainer}>
                  <FontAwesome5 name="shopping-cart" />
                </View>
                <View style={styles.profileMenuItemTextContainer}>
                  <Text style={styles.profileMenuItemText}>Mon panier</Text>
                </View>
                <View style={styles.profileMenuItemIconContainer2}>
                  <IconEntypo
                    name="chevron-thin-right"
                    style={styles.profileMenuItemIcon2}
                  />
                </View>
              </View>
            </TouchableOpacity>
            {/* mes salons */}
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => navigation.navigate("MesSalons")}
            >
              <View style={styles.profileMenuItemIconContainer}>
                <FontAwesome5 name="store" />
              </View>
              <View style={styles.profileMenuItemTextContainer}>
                <Text style={styles.profileMenuItemText}>Mes Salons</Text>
              </View>
              <View style={styles.profileMenuItemIconContainer2}>
                <IconEntypo
                  name="chevron-thin-right"
                  style={styles.profileMenuItemIcon2}
                />
              </View>
            </TouchableOpacity>
            {/* logout */}
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={() => logout()}
            >
              <View style={styles.profileMenuItemIconContainer}>
                <FontAwesome5 name="sign-out-alt" color={"red"} />
              </View>
              <View style={styles.profileMenuItemTextContainer}>
                <Text style={[styles.profileMenuItemText, { color: "red" }]}>
                  Se déconnecter
                </Text>
              </View>
              <View style={styles.profileMenuItemIconContainer2}>
                <IconEntypo
                  name="chevron-thin-right"
                  style={styles.profileMenuItemIcon2}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;

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
    height: windowHeight - 60,
    backgroundColor: "white",
  },
  profileInfo: {
    width: windowWidth - 20,
    height: 100,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginHorizontal: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 15,
    color: COLORS.transparentBlack2,
  },
  profileMenu: {
    width: windowWidth,
    height: windowHeight - 200,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileMenuItem: {
    height: 50,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginHorizontal: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileMenuItemIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  profileMenuItemIcon: {
    color: COLORS.primary,
    fontSize: 15,
  },
  profileMenuItemIconContainer2: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.transparentBlack1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  profileMenuItemIcon2: {
    color: COLORS.primary,
    fontSize: 15,
  },
  profileMenuItemTextContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  profileMenuItemText: {
    // fontWeight:"bold",
    color: COLORS.primary,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 250,
  },
});
