import React from "react";
import {
  View,
  SafeAreaView,
  Image,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Share,
} from "react-native";
import axios from "axios";
import { useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../config/colors";
import { adresseIp } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import AwesomeAlert from "react-native-awesome-alerts";
import { Rating, AirbnbRating } from "react-native-ratings";
import moment from "moment";
import CarouselCardItem, {
  SLIDER_WIDTH,
  ITEM_WIDTH,
} from "../components/Carousel/CarouselCardItem";
import "moment/src/locale/fr";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const PRODUCT_DETAILS_URL = adresseIp + "produit/show";
const PRODUCT_VU_URL = adresseIp + "produit/addVu";
const ADD_CART_URL = adresseIp + "panier/new";
const ADD_AVIS_URL = adresseIp + "avis/new";
const AVIS_URL = adresseIp + "avis/avisofproduct";
const SHOW_AVIS_OR_NOT_URL = adresseIp + "avis/showAvisOrNot";

function Details({ route, navigation }) {
  const { id } = route.params;
  const isFocused = useIsFocused();
  // const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState("");
  const [qt, setQt] = React.useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAvis, setIsLoadingAvis] = useState(true);
  const [isLoadingQT, setIsLoadingQT] = useState(true);
  const [isLoadingIMG, setIsLoadingIMG] = useState(true);
  const [playOnce, setPlayOnce] = useState(false);
  const [playOnceVu, setPlayOnceVu] = useState(false);
  const [value, setValue] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [moyenRating, setMoyenRating] = React.useState("");
  const [moyenCusmers, setMoyenCusmers] = React.useState("");
  const [commentList, setCommentList] = React.useState([]);
  const [indexGlobale, setIndexGlobale] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const [showAvis, setShowAvis] = React.useState("");
  const [userId, setUserId] = React.useState(0);

  const [cart, setCart] = React.useState([]);

  const [basicActive, setBasicActive] = useState("tab0");
  const isCarousel = React.useRef(null);

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

  const handleBasicClick = (value, index) => {
    if (value === basicActive) {
      return;
    }

    setBasicActive(value);
    setIndexGlobale(index);
  };

  function ratingCompleted(rating) {
    console.log("Rating is: " + rating);
    console.log("value: ", value);
    setValue(rating);
  }

  const AddAlert = () => {
    fetchAddToCart();
    setShowAlert(true);
    // Swal.fire({
    //   position: "center",
    //   icon: "success",
    //   title: "Produit ajouté au panier avec succès!",
    //   showConfirmButton: false,
    //   timer: 2500,
    // });
  };

  useEffect(() => {
    if (!playOnce) {
      fetchProductDeatils();
      fetchAvisList();
      fetchShowAvisOrNot();
      setPlayOnce(true);
    }
  }, [productDetails, playOnce, commentList, showAvis]);

  useEffect(() => {
    if (!isLoadingQT) {
      setQt(productDetails.min);
    }
  }, [isLoadingQT]);

  useEffect(() => {
    if (!playOnceVu) {
      fetchProductVu();
      setPlayOnceVu(true);
    }
  }, [playOnceVu]);

  function fetchProductDeatils() {
    axios
      .post(PRODUCT_DETAILS_URL, {
        produitId: id,
      })
      .then((response) => {
        setProductDetails(response.data);
      })
      .finally(() => {
        setIsLoading(false);
        setIsLoadingIMG(false);
        setIsLoadingQT(false);
      });
  }

  function fetchProductVu() {
    axios.post(PRODUCT_VU_URL, {
      produitId: id,
    });
  }

  function fetchShowAvisOrNot() {
    axios
      .post(SHOW_AVIS_OR_NOT_URL, {
        produitId: id,
        userId: userId,
      })
      .then((response) => {
        setShowAvis(response.data);
      })
      .finally(() => {
        // setIsLoading(false);
      });
  }

  function fetchAvisList() {
    axios
      .post(AVIS_URL, {
        produitId: id,
      })
      .then((response) => {
        setCommentList(response.data);
        let moy = 0;
        for (let index = 0; index < response.data.length; index++) {
          const element = response.data[index];
          moy = moy + element.etoile_nb;
        }
        setMoyenRating(moy / response.data.length);
        setMoyenCusmers(response.data.length);
      })
      .finally(() => {
        setIsLoadingAvis(false);
      });
  }

  function fetchAddAvis() {
    axios
      .post(ADD_AVIS_URL, {
        produitId: id,
        userId: userId,
        etoileNb: value,
        commentaire: comment,
      })
      .finally(() => {
        setIsLoading(false);
        setValue(0);
        setComment("");
        setPlayOnce(false);
      });
  }

  function fetchAddToCart() {
    axios.post(ADD_CART_URL, {
      produitId: id,
      userId: userId,
      quantite: qt,
    });
  }

  function updateQt(newQt) {
    if (newQt >= productDetails.min && newQt <= productDetails.max) {
      setQt(newQt);
      console.log(newQt);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="AwesomeAlert"
        message="I have a message for you!"
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Yes, delete it"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      /> */}
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title="Produit ajouté au panier avec succès!"
        message=""
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ height: windowHeight }}
      >
        <View style={styles.header}>
          <Icon
            name="arrow-back"
            size={28}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerText}></Text>
          <TouchableOpacity
            onPress={() =>
              userId != 0
                ? navigation.navigate("MyCart")
                : navigation.navigate("Login")
            }
          >
            <Icon name="shopping-cart" size={28} />
          </TouchableOpacity>
        </View>

        {isLoading && isLoadingIMG && isLoadingQT && productDetails == "" && (
          <View style={[styles.container, styles.horizontal]}>
            {/* <ActivityIndicator size="large" color={COLORS.logo} /> */}
            <Progress.CircleSnail
              color={[COLORS.primary, COLORS.logo]}
              size={80}
            />
          </View>
        )}
        <View>
          {!isLoading && (
            <>
              {productDetails.discount !== null && (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountText}>
                    -
                    {(
                      100 -
                      (productDetails.discount * 100) / productDetails.prix
                    ).toFixed(2)}
                    %
                  </Text>
                </View>
              )}
            </>
          )}
          <Carousel
            layout="tinder"
            layoutCardOffset={9}
            ref={isCarousel}
            data={productDetails.image}
            renderItem={CarouselCardItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
          />
        </View>

        {/* {!isLoadingIMG && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productDetails.image.map((img, index) => (
              <View style={styles.imageContainer} key={index}>
                <Image
                  source={{
                    uri: `http://10.0.2.2:8000/uploads/${img.imageURL}`,
                  }}
                  style={styles.productImage}
                />
              </View>
            ))}
          </ScrollView>
        )} */}
        {!isLoading && (
          <View style={styles.detailsContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <View style={styles.line} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 23, fontWeight: "bold" }}>
                {productDetails.nom}
              </Text>
            </View>
            <View style={{ marginTop: 10, marginRight: 10 }}>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold", flex: 2 }}>
                  Description :
                </Text>
                <TouchableOpacity style={styles.priceTag}>
                  {productDetails.discount == null ? (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                        flexDirection: "row-reverse",
                      }}
                    >
                      {productDetails.prix} TND
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                        flexDirection: "row-reverse",
                      }}
                    >
                      {productDetails.discount} TND
                    </Text>
                  )}

                  {productDetails.discount !== null && (
                    <Text
                      style={{
                        textAlign: "center",
                        color: "white",
                        flexDirection: "row-reverse",
                        textDecorationLine: "line-through",
                        fontWeight: "normal",
                        fontSize: 14,
                      }}
                    >
                      {productDetails.prix} TND
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: "grey",
                  fontSize: 16,
                  lineHeight: 22,
                  marginTop: 10,
                }}
              >
                {productDetails.description}
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 30,
                }}
              >
                <View style={{ flex: 0.015 }}></View>
                <View
                  style={{
                    flex: 0.3,
                    height: 80,
                    borderBottomEndRadius: 15,
                    borderBottomStartRadius: 15,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      height: 35,
                      backgroundColor: COLORS.primary,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                        marginTop: 5,
                      }}
                    >
                      Stock
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: COLORS.primary,
                      textAlign: "center",
                      fontSize: 18,
                      marginTop: 8,
                    }}
                  >
                    {productDetails.stock}
                  </Text>
                </View>
                <View style={{ flex: 0.04 }}></View>
                <View
                  style={{
                    flex: 0.3,
                    height: 80,
                    borderBottomEndRadius: 15,
                    borderBottomStartRadius: 15,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      height: 35,
                      backgroundColor: COLORS.primary,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                        marginTop: 5,
                      }}
                    >
                      Min
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: COLORS.primary,
                      textAlign: "center",
                      fontSize: 18,
                      marginTop: 8,
                    }}
                  >
                    {productDetails.min}
                  </Text>
                </View>
                <View style={{ flex: 0.04 }}></View>
                <View
                  style={{
                    flex: 0.3,
                    height: 80,
                    borderBottomEndRadius: 15,
                    borderBottomStartRadius: 15,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                  }}
                >
                  <View
                    style={{
                      height: 35,
                      backgroundColor: COLORS.primary,
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                        marginTop: 5,
                      }}
                    >
                      Max
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: COLORS.primary,
                      textAlign: "center",
                      fontSize: 18,
                      marginTop: 8,
                    }}
                  >
                    {productDetails.max}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1,
                  marginBottom: 15,
                }}
              >
                <View
                  style={{
                    flexDirection: "row-reverse",

                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {productDetails.stock > 0 && (
                    <>
                      <TouchableOpacity
                        style={{
                          width: 40,
                          height: 41,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COLORS.primary,
                          borderColor: "white",
                        }}
                        onPress={() => updateQt(qt + 1)}
                      >
                        <Text
                          style={{
                            fontSize: 30,
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
                          fontSize: 25,
                        }}
                      >
                        {qt}
                      </Text>
                      <TouchableOpacity
                        style={{
                          width: 40,
                          height: 41,
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: COLORS.primary,
                          borderColor: "white",
                        }}
                        onPress={() => updateQt(qt - 1)}
                      >
                        <Text
                          style={{
                            fontSize: 30,
                            fontWeight: "bold",
                            color: "white",
                          }}
                        >
                          -
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {productDetails.stock > 0 ? (
                  <TouchableOpacity
                    style={styles.buyBtn}
                    onPress={() =>
                      userId != 0 ? AddAlert() : navigation.navigate("Login")
                    }
                  >
                    <Ionicons
                      style={{
                        marginLeft: 1,
                        marginRight: 5,
                      }}
                      name="cart-outline"
                      size={23}
                      color={"white"}
                    />
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      Ajouter au panier
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.disabledBtn}>
                    <Text
                      style={{
                        color: "red",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Hors Stock
                    </Text>
                  </TouchableOpacity>
                )}
                {/* <TouchableOpacity
                  style={{
                    height: 50,
                    width: 37,
                    paddingRight: 5,
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15,
                  }}
                  onPress={() => onShare()}
                >
                  <Ionicons
                    style={{
                      marginRight: 1,
                      marginLeft: 5,
                    }}
                    name="share-social-sharp"
                    size={23}
                    color={"white"}
                  />
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        )}
        {!isLoading && !isLoadingAvis && (
          <>
            {/* reviews overview card */}
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 40,
                marginBottom: 10,
              }}
            >
              Avis
            </Text>

            <View style={styles.reviewsOverviewCard}>
              <Text style={styles.ratingMean}>
                <Text style={styles.ratingMeanText}>
                  {Number(moyenRating).toFixed(1)}
                </Text>
                /5
              </Text>

              <Text style={styles.ratingCount}>
                Basée sur {moyenCusmers} avis
                {/* {reviews.length} */}
              </Text>
              <View style={styles.ratingStars}>
                <Rating
                  readonly={true}
                  startingValue={moyenRating}
                  tintColor="#eee"
                />
              </View>
            </View>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              Avis des utilisateurs
            </Text>
            {commentList.map((comm, index) => (
              <View style={styles.reviewsCard} key={index}>
                <View style={styles.reviewsCardHeader}>
                  <Text style={styles.reviewsCardHeaderUser}>
                    {comm.user.entreprise.nom}
                  </Text>
                  <Rating
                    readonly={true}
                    startingValue={comm.etoile_nb}
                    tintColor="#eee"
                    imageSize={25}
                  />
                </View>
                <Text style={styles.reviewsCardText}>{comm.commentaire}</Text>
                <Text style={styles.reviewsCardDate}>
                  (
                  {moment
                    .utc(new Date(comm.created_at))
                    .local(["fr", "fr"])
                    .startOf("seconds")
                    .fromNow()}
                  ){" " + days[new Date(comm.created_at).getDay()] + ", "}
                  {new Date(comm.created_at).getDate()}{" "}
                  {months[new Date(comm.created_at).getMonth()]}{" "}
                  {new Date(comm.created_at).getFullYear()}
                </Text>
              </View>
            ))}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Ajouter un avis
              </Text>
              <Ionicons
                style={{
                  marginRight: 1,
                  marginLeft: 5,
                  marginTop: 10,
                }}
                name="add-circle-outline"
                size={28}
                color={"black"}
              />
            </View>
            <View style={styles.reviewsCard}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Que pensez vous de ce produit ?
              </Text>
              <Rating
                startingValue={0}
                onFinishRating={(rating) => setValue(rating)}
                tintColor="#eee"
              />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              Que pensez vous de ce produit ?
            </Text>

            <TextInput
              style={styles.reviewsTexInput}
              placeholder="Votre avis"
              placeholderTextColor={COLORS.primary}
              onChangeText={(text) => setComment(text)}
              value={comment}
            />

            <TouchableOpacity
              style={styles.reviewsCardBtn}
              onPress={() => fetchAddAvis()}
            >
              {/* submit review btn */}
              <Text style={styles.reviewsCardBtnText}>Envoyer votre avis</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default Details;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    width: windowWidth,
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignContent: "space-between",
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 200,
  },
  imageContainer: {
    flex: 1,
    marginTop: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 270,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "white",

    paddingTop: 5,
    paddingLeft: 5,
  },
  line: {
    flex: 1,
    width: 25,
    height: 2,
    backgroundColor: COLORS.dark,
    marginBottom: 5,
    marginRight: 3,
  },
  borderBtn: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 50,
  },
  borderBtnText: { fontWeight: "bold", fontSize: 30 },
  buyBtn: {
    flex: 0.8,
    width: 150,
    height: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row",
    marginHorizontal: -10,
    marginRight: 5,
  },
  disabledBtn: {
    flex: 0.8,
    width: 150,
    height: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    flexDirection: "row-reverse",
    marginHorizontal: -10,
  },
  priceTag: {
    flex: 1,
    backgroundColor: COLORS.primary,
    width: 80,
    height: 48,
    justifyContent: "center",
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  productImage: {
    flex: 1,
    width: windowWidth,
    height: windowWidth,
    resizeMode: "cover",
  },
  discountContainer: {
    position: "absolute",
    top: 20,
    right: 25,
    zIndex: 1,
    height: 85,
    width: 85,
    backgroundColor: COLORS.logo,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "45deg" }],
    borderTopLeftRadius: 100,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  discountText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    transform: [{ rotate: "-45deg" }],
  },
  reviewsOverviewCard: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
  reviewsCard: {
    width: windowWidth - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
  ratingMean: {
    fontWeight: "bold",
    fontSize: 18,
  },
  ratingMeanText: {
    fontWeight: "bold",
    fontSize: 35,
  },
  ratingCount: {
    fontSize: 15,
  },
  ratingStars: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  reviewsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewsCardHeaderUser: {
    fontWeight: "bold",
    fontSize: 18,
  },
  reviewsCardText: {
    fontSize: 15,
    marginBottom: 10,
  },
  reviewsCardDate: {
    fontSize: 15,
    color: COLORS.transparentBlack3,
    textAlign: "right",
  },
  reviewsTexInput: {
    width: windowWidth - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 10,
    borderRadius: 10,
    height: 100,
    textAlignVertical: "top",
    fontSize: 15,
  },
  reviewsCardBtn: {
    width: windowWidth - 30,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewsCardBtnText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white",
  },
});
