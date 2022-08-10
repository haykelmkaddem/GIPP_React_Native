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
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import AwesomeAlert from "react-native-awesome-alerts";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../components/Carousel/CarouselCardItem";
import * as Progress from "react-native-progress";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const ACTUALITE_URL = adresseIp + "actualite/showall";

const Actualites = ({ navigation }) => {
  const [actualiteList, setActualiteList] = useState([]);
  const [playOnce, setPlayOnce] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchActualiteList();
    }
  }, [actualiteList]);

  function fetchActualiteList() {
    axios
      .get(ACTUALITE_URL)
      .then((response) => {
        setActualiteList(response.data.slice().reverse());
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
        <Text style={styles.headerText}>Actualités</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.newsConatainer}>
        <View style={styles.SectionTitle}>
          <Text style={styles.SectionTitleText}>Actualités</Text>
        </View>
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
          style={{ height: windowHeight - 150 }}
        >
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
            <>
              {actualiteList.map((actualite, index) => (
                <View style={styles.newsCard} key={index}>
                  <View style={styles.newsCardImageContainer}>
                    <Image
                      source={{
                        uri: `http://10.0.2.2:8000/uploads/${actualite.image}`,
                      }}
                      style={styles.newsCardImage}
                    />
                  </View>
                  <View style={styles.newsCardText}>
                    <Text
                      style={styles.newsCardTextTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {actualite.titre}
                    </Text>
                    <Text
                      style={styles.newsCardTextDescription}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {actualite.description}
                    </Text>
                    <Text style={styles.newsCardTextDate}>12/12/2019</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("ActualiteDetails", {
                          id: actualite.id,
                        })
                      }
                    >
                      <Text style={styles.newsCardTextMoreText}>Voir plus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Actualites;

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
  SectionTitle: {
    width: windowWidth,
    height: 50,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  SectionTitleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  newsConatainer: {
    width: windowWidth,
    backgroundColor: "white",
  },
  newsCard: {
    width: windowWidth - 20,
    height: 120,
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
    width: 120,
    height: 120,
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
  newsCardText: {
    flex: 1,
    padding: 10,
  },
  newsCardTextTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  newsCardTextDescription: {
    fontSize: 14,
    marginBottom: 5,
  },
  newsCardTextDate: {
    fontSize: 12,
    color: COLORS.primary,
  },
  newsCardTextMoreText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: "right",
    marginTop: 5,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 220,
    backgroundColor: "white",
  },
});
