import React from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  StatusBar,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import { useIsFocused } from "@react-navigation/native";
import { RadioButton } from "react-native-paper";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import { BackAndroid } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
function Thank({ route, navigation }) {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: windowHeight }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}> </Text>
          <View style={{ flex: 0.2 }}></View>
        </View>
        <View
          style={{
            height: 50,
            backgroundColor: COLORS.primary,
            borderBottomRightRadius: 100,
            borderBottomLeftRadius: 100,
          }}
        ></View>
        <View
          style={{
            height: 300,
            width: windowWidth - 50,
            marginHorizontal: 25,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            marginTop: -80,
            marginBottom: 5,
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,

            elevation: 9,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "column-reverse",
              justifyContent: "center",
              paddingHorizontal: 30,
            }}
          >
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 25, textAlign: "center" }}>
                Merci Pour Votre Commande
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: "100%",
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 15,
              }}
            >
              <FontAwesome5
                name="check-circle"
                color={COLORS.primary}
                size={80}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buyBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Ionicons
            style={{
              marginRight: 1,
              marginRight: 18,
            }}
            name="home"
            size={32}
            color={COLORS.primary}
          />
          <Text
            style={{
              color: "black",
              fontSize: 22,
            }}
          >
            Accueil
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
export default Thank;
const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  header: {
    flex: 1,
    width: windowWidth,
    height: windowHeight / 6,
    flexDirection: "row",
    paddingTop: 15 + StatusBar.currentHeight,
    paddingHorizontal: 15,
    backgroundColor: COLORS.primary,
    alignContent: "space-between",
  },
  headerText: {
    flex: 0.6,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  buyBtn: {
    height: 60,
    borderRadius: 15,
    flexDirection: "row",
    marginTop: 30,
    width: windowWidth - 50,
    marginHorizontal: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    marginBottom: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});
