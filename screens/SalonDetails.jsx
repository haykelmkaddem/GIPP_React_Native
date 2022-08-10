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

const SALON_DETAILS_URL = adresseIp + "salon/show";
const USER_DETAILS_URL = adresseIp + "user/show";
const ADD_RESERVATION_URL = adresseIp + "reservation/new";
const ANNULER_RESERVATION_URL = adresseIp + "reservation/annulerReservation";
const VERIF_RESERVATION_URL = adresseIp + "reservation/verifierStatut";

const SalonDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const isFocused = useIsFocused();
  const [salonDetails, setSalonDetails] = useState("");
  const [user, setUser] = useState("");
  const [verifReservation, setVerifReservation] = useState("");
  const [nbSalon, setNbSalon] = useState(0);
  const [playOnce, setPlayOnce] = useState(false);
  const [playOnceU, setPlayOnceU] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isLoadingU, setIsLoadingU] = useState(true);
  const [isLoadingV, setIsLoadingV] = useState(true);
  const [run, setRun] = useState(true);
  const [invitations, setInvitations] = useState(0);
  const [userId, setUserId] = React.useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertcancel, setShowAlertCancel] = useState(false);

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

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

  const CancelAlert = () => {
    setShowAlertCancel(true);
  };
  const ReservationAlert = () => {
    setShowAlert(true);
  };

  useEffect(() => {
    if (!isLoading && !playOnce) {
      for (
        let index = 0;
        index < salonDetails.data.reservation.length;
        index++
      ) {
        if (
          salonDetails.data.reservation[index].statut_reservation == "Acceptée"
        ) {
          setNbSalon(nbSalon + 1);
        }
      }
      setPlayOnce(true);
    }
  }, [isLoading]);
  useEffect(() => {
    if (userId != 0) {
      fetchSalonDetails();
      fetchVerifReservation();
    }
  }, [run, userId]);

  useEffect(() => {
    if (!playOnceU && userId != 0) {
      fetchUserDetails();
      setPlayOnceU(true);
    }
  }, [user, userId]);

  function fetchSalonDetails() {
    axios
      .post(SALON_DETAILS_URL, {
        salonId: id,
      })
      .then((response) => {
        setSalonDetails(response);
        let i = 0;
        for (let j = 0; j < response.data.reservation.length; j++) {
          if (response.data.reservation[j].statut_reservation == "Acceptée") {
            i = i + 1;
          }
        }
        setInvitations(i);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function print() {
    window.print();
  }

  function fetchUserDetails() {
    axios
      .post(USER_DETAILS_URL, {
        userId: userId,
      })
      .then((response) => {
        setUser(response.data);
      })
      .finally(() => {
        setIsLoadingU(false);
      });
  }

  function fetchAddReservation() {
    axios
      .post(ADD_RESERVATION_URL, {
        salonId: id,
        userId: userId,
        statut_reservation: "En Cours",
      })
      .finally(() => {
        setRun(!run);
      });
  }
  function fetchAnnulerReservation() {
    axios
      .post(ANNULER_RESERVATION_URL, {
        salonId: id,
        userId: userId,
      })
      .finally(() => {
        setRun(!run);
      });
  }
  function fetchVerifReservation() {
    axios
      .post(VERIF_RESERVATION_URL, {
        salonId: id,
        userId: userId,
      })
      .then((response) => {
        setVerifReservation(response);
      })
      .finally(() => {
        setIsLoadingV(false);
        setButtonLoading(false);
      });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        show={showAlertcancel}
        showProgress={false}
        title="Annulation de la réservation"
        message="Voulez-vous vraiment annuler votre réservation ?"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Non"
        confirmText="Oui"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlertCancel(false);
        }}
        onConfirmPressed={() => {
          setButtonLoading(true);
          fetchAnnulerReservation();
          setShowAlertCancel(false);
        }}
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Réservation"
        message="Votre demande de réservation a été envoyée avec succés"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={COLORS.logo}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={28}
          onPress={() => navigation.goBack()}
          style={{ flex: 0.2 }}
        />
        <Text style={styles.headerText}>Salon</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.salonDetailsConatainer}>
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
          <ScrollView>
            <View style={styles.salonDetailsHero}>
              <View style={styles.salonDetailsHeroContent}>
                <Text style={styles.salonDetailsHeroTitleText}>
                  {salonDetails.data.titre}
                </Text>
              </View>
              <View style={styles.salonDetailsHeroActionButtonsContainer}>
                <View style={styles.col4}>
                  <View style={styles.salonDetailsHeroActionButtonPlaces}>
                    <View style={styles.salonDetailsHeroActionButtonChairIcon}>
                      <FontAwesome5
                        name="chair"
                        size={14}
                        style={styles.actionIcon}
                        color="#000"
                      />
                    </View>
                    <Text style={styles.salonDetailsHeroActionButtonText}>
                      {salonDetails.data.max_invitation} places
                    </Text>
                  </View>
                </View>
                <View style={styles.col4}>
                  <View style={styles.salonDetailsHeroActionButtonPlaces}>
                    <View
                      style={
                        styles.salonDetailsHeroActionButtonParticipantsIcon
                      }
                    >
                      <FontAwesome5
                        name="users"
                        size={14}
                        style={styles.actionIcon}
                      />
                    </View>
                    <Text style={styles.salonDetailsHeroActionButtonText}>
                      {invitations} participants
                    </Text>
                  </View>
                </View>
                <View style={styles.col4}>
                  <View style={styles.salonDetailsHeroActionButtonPlaces}>
                    {/* <View style={styles.salonDetailsHeroActionButtonDisponibleIcon}>
                  <FontAwesome5 name="check-circle" size={14} style={styles.actionIcon}  />
                </View>
                <Text style={styles.salonDetailsHeroActionButtonText}>
                  Disponible
                </Text> */}
                    <View
                      style={
                        styles.salonDetailsHeroActionButtonIndisponibleIcon
                      }
                    >
                      <FontAwesome5
                        name="times-circle"
                        size={14}
                        style={styles.actionIcon}
                      />
                    </View>
                    <Text style={styles.salonDetailsHeroActionButtonText}>
                      {invitations == salonDetails.data.max_invitation
                        ? "Pas de places"
                        : salonDetails.data.max_invitation -
                          invitations +
                          " disponibles"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.salonDetailsInfo}>
              <View style={styles.salonDetailsInfoDescriptionCard}>
                <View style={styles.salonDetailsInfoDescriptionCardContent}>
                  <Text style={styles.salonDetailsInfoDescriptionCardTitleText}>
                    Description :
                  </Text>
                  <Text
                    style={
                      styles.salonDetailsInfoDescriptionCardDescriptionText
                    }
                  >
                    {salonDetails.data.description}
                  </Text>
                </View>
              </View>
              <View style={styles.salonDetailsInfoListContainer}>
                <ScrollView>
                  <View style={styles.salonDetailsInfoListItem}>
                    <View style={styles.salonDetailsInfoListItemIcon}>
                      <MaterialCommunityIcons
                        name="map-marker-radius"
                        size={14}
                        style={styles.infoIcon}
                      />
                      <Text style={styles.salonDetailsInfoListItemTitle}>
                        Adresse
                      </Text>
                    </View>

                    <Text style={styles.salonDetailsInfoListItemDetail}>
                      {salonDetails.data.lieu}
                    </Text>
                  </View>
                  <View style={styles.salonDetailsInfoListItem}>
                    <View style={styles.salonDetailsInfoListItemIcon}>
                      <Octicons
                        name="calendar"
                        size={14}
                        style={styles.infoIcon}
                      />
                      <Text style={styles.salonDetailsInfoListItemTitle}>
                        Date
                      </Text>
                    </View>

                    <Text style={styles.salonDetailsInfoListItemDetail}>
                      {days[new Date(salonDetails.data.date).getDay()] + ", "}
                      {new Date(salonDetails.data.date).getDate()}{" "}
                      {months[new Date(salonDetails.data.date).getMonth()]}{" "}
                      {new Date(salonDetails.data.date).getFullYear()}
                    </Text>
                  </View>
                  <View style={styles.salonDetailsInfoListItem}>
                    <View style={styles.salonDetailsInfoListItemIcon}>
                      <Ionicons
                        name="md-time"
                        size={14}
                        style={styles.infoIcon}
                      />
                      <Text style={styles.salonDetailsInfoListItemTitle}>
                        Heure de début
                      </Text>
                    </View>

                    <Text style={styles.salonDetailsInfoListItemDetail}>
                      {salonDetails.data.temps_debut.substr(11, 2)}h
                      {salonDetails.data.temps_debut.substr(14, 2)}
                    </Text>
                  </View>
                  <View style={styles.salonDetailsInfoListItem}>
                    <View style={styles.salonDetailsInfoListItemIcon}>
                      <Ionicons
                        name="md-time"
                        size={14}
                        style={styles.infoIcon}
                      />
                      <Text style={styles.salonDetailsInfoListItemTitle}>
                        Heure de fin
                      </Text>
                    </View>

                    <Text style={styles.salonDetailsInfoListItemDetail}>
                      {salonDetails.data.temps_fin.substr(11, 2)}h
                      {salonDetails.data.temps_fin.substr(14, 2)}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        )}
        <View style={styles.salonDetailsParticipate}>
          {!buttonLoading &&
            !isLoadingV &&
            verifReservation.data.message != null &&
            verifReservation.data.message != undefined &&
            verifReservation.data.message === "no" && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "green",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => {
                  setButtonLoading(true);
                  fetchAddReservation();
                  ReservationAlert();
                }}
              >
                <Text style={styles.salonDetailsParticipateButtonText}>
                  Participer
                </Text>
              </TouchableOpacity>
            )}
          {!isLoadingV &&
            verifReservation.data.message != null &&
            verifReservation.data.message != undefined &&
            verifReservation.data.message === "En Cours" && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "orange",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text style={styles.salonDetailsParticipateButtonText}>
                  En Cours
                </Text>
              </TouchableOpacity>
            )}
          {!buttonLoading &&
            !isLoadingV &&
            verifReservation.data.message != null &&
            verifReservation.data.message != undefined &&
            verifReservation.data.message === "Acceptée" && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "red",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => {
                  CancelAlert();
                }}
              >
                <Text style={styles.salonDetailsParticipateButtonText}>
                  Annuler
                </Text>
              </TouchableOpacity>
            )}
          {!isLoadingV &&
            verifReservation.data.message != null &&
            verifReservation.data.message != undefined &&
            verifReservation.data.message === "Annulée" && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "red",
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text style={styles.salonDetailsParticipateButtonText}>
                  Reservation Réfusé
                </Text>
              </TouchableOpacity>
            )}
          {buttonLoading && (
            <Progress.CircleSnail
              color={[COLORS.primary, COLORS.logo]}
              size={30}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SalonDetails;

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
  salonDetailsConatainer: {
    width: windowWidth,
    height: windowHeight - 40,
    backgroundColor: "white",
  },
  salonDetailsHero: {
    backgroundColor: COLORS.primary,
    width: windowWidth - 20,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  salonDetailsHeroContent: {
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  salonDetailsHeroTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  salonDetailsHeroDescriptionText: {
    fontSize: 15,
    color: "white",
    textAlign: "justify",
  },
  salonDetailsHeroActionButtonsContainer: {
    position: "absolute",
    bottom: -30,
    height: 60,
    width: windowWidth - 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  col4: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  salonDetailsHeroActionButtonPlaces: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  salonDetailsHeroActionButtonText: {
    fontSize: 11,
    color: COLORS.primary,
  },
  salonDetailsInfoListContainer: {
    width: windowWidth,
    height: windowHeight - 200,
    padding: 10,
    backgroundColor: "white",
    marginTop: 30,
  },
  salonDetailsInfoListItem: {
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  salonDetailsInfoListItemIcon: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  salonDetailsInfoListItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    paddingLeft: 8,
  },
  salonDetailsInfoListItemDetail: {
    fontSize: 13,
    color: COLORS.primary,
  },
  infoIcon: {
    color: COLORS.primary,
  },
  salonDetailsInfoDescriptionCard: {
    width: windowWidth - 50,
    padding: 10,
    backgroundColor: "white",
    marginTop: 50,
    marginHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
    // borderLeftWidth: 5,
    // borderLeftColor: COLORS.primary,
  },
  salonDetailsInfoDescriptionCardTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    paddingLeft: 8,

    textAlign: "center",
  },
  salonDetailsInfoDescriptionCardDetail: {
    fontSize: 13,
    color: COLORS.primary,
  },
  salonDetailsInfoDescriptionCardDescriptionText: {
    fontSize: 13,
    color: COLORS.primary,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 10,
    paddingTop: 10,
    textAlign: "center",
  },
  salonDetailsParticipate: {
    width: windowWidth - 20,
    marginHorizontal: 10,
    height: 90,
    backgroundColor: "white",
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.transparentBlack1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  salonDetailsParticipateButton: {
    flex: 1,
    backgroundColor: "green",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  salonDetailsParticipateButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: -150,
  },

  //   salonDetailsHeroContent: {
  //     width: windowWidth,
  //     height: windowHeight / 3,
  //     backgroundColor: "#83559E",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     },
  //     salonDetailsHeroTitleText: {
  //     fontSize: 30,
  //     fontWeight: "bold",
  //     color: "white",
  //     },
  //     salonDetailsHeroDescriptionText: {
  //     color: "white",
  //     },
});
