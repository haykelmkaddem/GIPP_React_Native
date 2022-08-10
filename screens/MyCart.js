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
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import AwesomeAlert from "react-native-awesome-alerts";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const CART_URL = adresseIp + "panier/showall";
const UPDATE_QT_URL = adresseIp + "panier/editQt";
const USER_URL = adresseIp + "user/show";
const DELETE_CART_URL = adresseIp + "panier/delete";
const COMMANDE_URL = adresseIp + "commande/new";

function MyCart({ navigation }) {
  const [productList, setProductList] = useState([]);
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadinguser, setIsLoadinguser] = useState(true);
  const [palyOnce, setPalyOnce] = useState(false);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const isFocused = useIsFocused();

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

  const createTwoButtonAlert = (id) =>
    Alert.alert(
      "Supprimer du panier",
      "Voulez-vous vraiment supprimer ce produit du panier ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        { text: "Supprimer", onPress: () => fetchDeleteCart(id) },
      ],
      { cancelable: false }
    );

  useEffect(() => {
    if (!palyOnce && userId != 0) {
      fetchCart();
      fetchUser();
      setPalyOnce(true);
    }
  }, [productList, userId]);

  useEffect(() => {
    if (!isLoading) {
      let newTotal = 0;
      productList.map((cl) => {
        if (cl.produit.discount !== null) {
          newTotal = newTotal + cl.produit.discount * cl.quantite;
        } else {
          newTotal = newTotal + cl.produit.prix * cl.quantite;
        }
      });
      setTotal(newTotal);
    }
  }, [isLoading]);

  function updateQt(newQt, id) {
    let newProductList = [];
    productList.map((cl) => {
      if (cl.id == id) {
        if (newQt >= cl.produit.min && newQt <= cl.produit.max) {
          cl.quantite = newQt;
          console.log(newQt);
          fetchUpdateQt(id, newQt);
        }
      }
      newProductList.push(cl);
    });
    setProductList(newProductList);
    let newTotal = 0;
    productList.map((cl) => {
      if (cl.produit.discount !== null) {
        newTotal = newTotal + cl.produit.discount * cl.quantite;
      } else {
        newTotal = newTotal + cl.produit.prix * cl.quantite;
      }
    });
    setTotal(newTotal);
  }

  function fetchCart() {
    axios
      .post(CART_URL, {
        userId: userId,
      })
      .then((response) => {
        setProductList(response.data);
        console.log(response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  function fetchCommande() {
    axios
      .post(COMMANDE_URL, {
        userId: userId,
        statutCommande: "En Cours",
        totale: total,
        commentaire: "",
        methodeDePaiement: "cash on delivery",
      })
      .finally(() => {
        setIsLoading(false);
        fetchCart();
      });
  }

  const AlertCommande = () => {
    fetchCommande();
    setShowAlert(true);
  };

  function fetchDeleteCart(id) {
    setIsLoading(true);
    axios
      .post(DELETE_CART_URL, {
        panierId: id,
      })
      .finally(() => {
        fetchCart();
      });
  }

  function fetchUser() {
    axios
      .post(USER_URL, {
        userId: userId,
      })
      .then((response) => {
        setUser(response.data);
      })
      .finally(() => {
        setIsLoadinguser(false);
      });
  }

  function fetchUpdateQt(panierId, qt) {
    axios.post(UPDATE_QT_URL, {
      panierId: panierId,
      quantite: qt,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Succés!"
        message="Vérifier Votre Mail Pour Consulter La Facture :)"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor={COLORS.logo}
        onConfirmPressed={() => {
          // setShowAlert(false);
          // navigation.navigate("Home");
          navigation.navigate("Thank");
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: windowHeight }}
      >
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
            style={{ flex: 0.2 }}
          />
          <Text style={styles.headerText}>Panier</Text>
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
        {!isLoading && productList.length == 0 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              height: windowHeight - 90,
            }}
          >
            <MaterialCommunityIcons name="cart-remove" size={150} />
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              Votre panier est vide
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                width: windowWidth - 150,
                backgroundColor: COLORS.secondary,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
                marginTop: 20,
              }}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Continuer vos achats
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!isLoading && productList.length > 0 && (
          <>
            {productList.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: "white",
                  borderRadius: 20,
                  marginBottom: 8,
                  marginHorizontal: 3,
                }}
              >
                <View
                  style={{
                    height: 160,
                    width: windowWidth,
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <Image
                    style={{
                      height: 160,
                      resizeMode: "cover",
                      flex: 0.5,
                      borderTopLeftRadius: 20,
                      borderBottomLeftRadius: 20,
                    }}
                    source={{
                      uri: `http://10.0.2.2:8000/uploads/${item.produit.image[0].imageURL}`,
                    }}
                  />

                  <View
                    style={{
                      height: 160,
                      flex: 0.6,
                      paddingVertical: 8,
                      paddingRight: 15,
                      paddingLeft: 20,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "#5B5A5F",
                          fontSize: 20,
                          width: "80%",
                        }}
                        numberOfLines={2}
                      >
                        {item.produit.nom}
                      </Text>
                      <TouchableOpacity
                        style={{
                          padding: 10,
                        }}
                        onPress={() => createTwoButtonAlert(item.id)}
                      >
                        <IconEntypo name="cross" size={25} color={"#5B5A5F"} />
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 8,
                      }}
                    >
                      {item.produit.discount == null ? (
                        <>{item.produit.prix} TND </>
                      ) : (
                        <>{item.produit.discount} TND </>
                      )}

                      {item.produit.discount != null && (
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            marginTop: 8,
                            textAlign: "center",
                            flexDirection: "row-reverse",
                            textDecorationLine: "line-through",
                            fontWeight: "normal",
                            fontSize: 14,
                          }}
                        >
                          {item.produit.prix} TND
                        </Text>
                      )}
                    </Text>

                    <View
                      style={{
                        flexDirection: "row-reverse",
                        marginVertical: 20,
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          width: 30,
                          height: 30,
                          borderWidth: 1,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COLORS.primary,
                          borderColor: "white",
                        }}
                        onPress={() => updateQt(item.quantite + 1, item.id)}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          +
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{
                          marginHorizontal: 10,
                        }}
                      >
                        {item.quantite}
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 30,
                          height: 30,
                          borderWidth: 1,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COLORS.primary,
                          borderColor: "white",
                        }}
                        onPress={() => updateQt(item.quantite - 1, item.id)}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
        {!isLoading && productList.length > 0 && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 7,
                marginBottom: 15,
                marginHorizontal: 15,
                paddingHorizontal: 15,
                paddingVertical: 25,
                backgroundColor: "white",
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                Total
              </Text>
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                {" "}
                {/* {total.toFixed(2)} ريال */}
                {total} TND
              </Text>
            </View>

            <TouchableOpacity
              style={{
                height: 60,
                width: windowWidth - 50,
                backgroundColor: COLORS.primary,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={() => {
                AlertCommande();
              }}
            >
              <Text
                style={{
                  fontSize: 25,
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Commander
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default MyCart;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  header: {
    flex: 1,
    width: windowWidth,
    height: 60,
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignContent: "space-between",
    marginBottom: 8,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 200,
  },
  headerText: {
    flex: 0.6,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  line: {
    height: 1,
    width: "95%",
    backgroundColor: "black",
    opacity: 0.3,
    marginVertical: 10,
    alignSelf: "center",
  },
  delUpd: {
    flexDirection: "row",
  },
});
