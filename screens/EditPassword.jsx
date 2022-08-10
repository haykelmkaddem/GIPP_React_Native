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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
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
const UPDATE_URL = adresseIp + "user/editPassword";

const EditPassword = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
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
    if (message == "updated") {
      setShowAlert(true);
    }
  }, [message]);

  function fetchUpdatePass() {
    axios
      .post(UPDATE_URL, {
        userId: userId,
        password: password,
        newpassword: newPassword,
      })
      .then((response) => {
        setMessage(response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Modification Réussie"
        message="Votre mot de passe a été modifié avec succès"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={COLORS.logo}
        onConfirmPressed={() => {
          setShowAlert(false);
          navigation.navigate("Profile");
        }}
      />
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={28}
          onPress={() => navigation.goBack()}
          style={{ flex: 0.2 }}
        />
        <Text style={styles.headerText}>Edit Password</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.body}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Changer votre mot de passe</Text>
        </View>
        <View style={styles.formContainer}>
          {/* Ancien mot de passe */}
          <View style={styles.formItem}>
            <FontAwesome5 name="lock" style={styles.formItemIcon} />
            <View style={styles.formItemInputContainer}>
              <Text style={styles.formItemLabel}>Ancien mot de passe</Text>
              <TextInput
                style={styles.formItemInput}
                placeholder="Ancien mot de passe"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                defaultValue={password}
              />
            </View>
          </View>
          {/* Nouveau mot de passe */}
          <View style={styles.formItem}>
            <FontAwesome5 name="lock" style={styles.formItemIcon} />
            <View style={styles.formItemInputContainer}>
              <Text style={styles.formItemLabel}>Nouveau mot de passe</Text>
              <TextInput
                style={styles.formItemInput}
                placeholder="Nouveau mot de passe"
                secureTextEntry={true}
                onChangeText={(text) => setNewPassword(text)}
                defaultValue={newPassword}
              />
            </View>
          </View>
          {message != "updated" &&
            message != "pas de données" &&
            message != "" && (
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "red",
                  alignSelf: "center",
                }}
              >
                {message}
              </Text>
            )}
          {/* Save button */}
          <View style={styles.formSubmit}>
            <TouchableOpacity
              style={styles.formButton}
              onPress={() => {
                fetchUpdatePass();
              }}
            >
              <Text style={styles.formButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditPassword;

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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    width: windowWidth,
    height: 50,
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  formContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "white",
    width: windowWidth - 20,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 2,
    marginTop: 10,
  },
  formItem: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomColor: COLORS.transparentBlack1,
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingVertical: 10,
  },
  formItemIcon: {
    fontSize: 20,
    color: COLORS.primary,
    marginRight: 20,
  },
  formItemInputContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  formItemLabel: {
    fontSize: 15,
    color: COLORS.primary,
  },
  formItemInput: {
    fontSize: 15,
    color: COLORS.primary,
  },
  formSubmit: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  formButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  formButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  },
});
