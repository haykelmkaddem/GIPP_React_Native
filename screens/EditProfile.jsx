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
const USER_URL = adresseIp + "user/show";
const UPDATE_USER_URL = adresseIp + "user/edit";

const EditProfile = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [user, setUser] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState(0);
  const [codePostale, setCodePostale] = useState(0);
  const [mail, setMail] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [adresse, setAdresse] = useState("");
  const [pays, setPays] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [playOnce, setPlayOnce] = useState(false);
  const options = ["Tunisie", "Italie", "France", "Espagne"];
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
  const updateData = async () => {
    try {
      await AsyncStorage.removeItem("nom");
      await AsyncStorage.removeItem("prenom");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.setItem("nom", JSON.stringify(nom));
      await AsyncStorage.setItem("prenom", JSON.stringify(prenom));
      await AsyncStorage.setItem("email", JSON.stringify(mail));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!playOnce && userId != 0) {
      fetchUser();
      setPlayOnce(true);
    }
  }, [user, userId]);

  function fetchUser() {
    axios
      .post(USER_URL, {
        userId: userId,
      })
      .then((response) => {
        setUser(response.data);
        setNom(response.data.nom);
        setPrenom(response.data.prenom);
        setTel(response.data.telephone);
        setMail(response.data.email);
        setEntreprise(response.data.entreprise.nom);
        setAdresse(response.data.entreprise.adresse);
        setPays(response.data.entreprise.pays);
        setCodePostale(response.data.entreprise.code_postal);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function fetchUpdateUser() {
    axios
      .post(UPDATE_USER_URL, {
        userId: userId,
        nom: nom,
        prenom: prenom,
        telephone: parseInt(tel),
        nomentreprise: entreprise,
        adresse: adresse,
        pays: pays,
        code_postal: codePostale,
      })
      .then((response) => {
        updateData();
      })
      .finally(() => {
        setIsLoadingUpdate(false);
        setShowAlert(true);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      {isLoadingUpdate && (
        <View
          style={{
            position: "absolute",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Progress.CircleSnail color={["white"]} size={80} />
        </View>
      )}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Modification effectuée"
        message="Vos informations ont été mises à jour"
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
        <Text style={styles.headerText}>Editer mes informations</Text>
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
        <ScrollView>
          <View style={styles.body}>
            <View style={styles.title}>
              <Text style={styles.titleText}>Informations personnelles</Text>
            </View>
            <View style={styles.formContainer}>
              {/* first name */}
              <View style={styles.formItem}>
                <FontAwesome5 name="user" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Nom</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Nom"
                    defaultValue={nom}
                    onChangeText={(newNom) => setNom(newNom)}
                  />
                </View>
              </View>
              {/* last name */}
              <View style={styles.formItem}>
                <FontAwesome5 name="user" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Prénom</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Prénom"
                    defaultValue={prenom}
                    onChangeText={(newPrenom) => setPrenom(newPrenom)}
                  />
                </View>
              </View>
              {/* email */}
              <View style={styles.formItem}>
                <FontAwesome5 name="envelope" style={styles.formItemIcon} />

                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Email</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Email"
                    defaultValue={mail}
                    onChangeText={(newMail) => setMail(newMail)}
                  />
                </View>
              </View>
              {/* phone */}
              <View style={styles.formItem}>
                <Icon name="phone" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Téléphone</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Téléphone"
                    defaultValue={String(tel)}
                    value={tel}
                    onChangeText={(newTel) => setTel(newTel)}
                  />
                </View>
              </View>
              {/* entreprise */}
              <View style={styles.formItem}>
                <FontAwesome name="building-o" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Entreprise</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Entreprise"
                    defaultValue={entreprise}
                    onChangeText={(newEntreprise) =>
                      setEntreprise(newEntreprise)
                    }
                  />
                </View>
              </View>
              {/* Adresse */}
              <View style={styles.formItem}>
                <Entypo name="location" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Adresse</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Adresse"
                    defaultValue={adresse}
                    onChangeText={(newAdresse) => setAdresse(newAdresse)}
                  />
                </View>
              </View>
              {/* Pays */}
              {/* <View style={styles.formItem}>
                <FontAwesome name="flag-o" style={styles.formItemIcon} />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Pays</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Pays"
                    defaultValue={pays}
                    onChangeText={(newPays) => setPays(newPays)}
                  />
                </View>
              </View> */}
              {/* Code Postal */}
              <View style={styles.formItem}>
                <MaterialCommunityIcons
                  name="post-outline"
                  style={styles.formItemIcon}
                />
                <View style={styles.formItemInputContainer}>
                  <Text style={styles.formItemLabel}>Code Postal</Text>
                  <TextInput
                    style={styles.formItemInput}
                    placeholder="Code Postal"
                    defaultValue={codePostale}
                    onChangeText={(newcodePostale) =>
                      setCodePostale(newcodePostale)
                    }
                  />
                </View>
              </View>
              {/* Save button */}
              <View style={styles.formSubmit}>
                <TouchableOpacity
                  style={styles.formButton}
                  onPress={() => {
                    setIsLoadingUpdate(true);
                    fetchUpdateUser();
                  }}
                >
                  <Text style={styles.formButtonText}>Enregistrer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditProfile;

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
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 250,
  },
});
