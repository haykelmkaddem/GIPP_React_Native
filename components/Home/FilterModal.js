import React from "react";
import {
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

import { Animated } from "react-native";
import { COLORS } from "../../config/colors";
import TextButton from "../inputs/TextButton";
import TwoPointSlider from "../inputs/TwoPointSlider";
import AntIcons from "@expo/vector-icons/AntDesign";
import { adresseIp } from "../../config/constants";
import { useNavigation } from "@react-navigation/native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const CATEGORY_URL = adresseIp + "categorie/showall";

const manufacturers = [
  {
    id: 0,
    image: require("../../assets/images/logo.png"),
    text: "Printers",
  },
  {
    id: 1,
    image: require("../../assets/images/logo.png"),
    text: "Phones and Tablets",
  },
  {
    id: 2,
    image: require("../../assets/images/logo.png"),
    text: "Computers",
  },
  {
    id: 3,
    image: require("../../assets/images/logo.png"),
    text: "Printers and inc",
  },
  {
    id: 4,
    image: require("../../assets/images/logo.png"),
    text: "Consoles",
  },
  {
    id: 5,
    image: require("../../assets/images/logo.png"),
    text: "Printers",
  },
  {
    id: 6,
    image: require("../../assets/images/logo.png"),
    text: "Computers",
  },
];

const discounts = [
  {
    id: 0,
    text: " 10% أو أكثر",
  },
  {
    id: 1,
    text: "20% أو أكثر",
  },
  {
    id: 2,
    text: "30% أو أكثر",
  },
  {
    id: 3,
    text: "40% أو أكثر",
  },
  {
    id: 4,
    text: "50% أو أكثر",
  },
];

const Section = ({ containerStyle, title, children }) => {
  return (
    <View
      style={{
        marginTop: 15,

        ...containerStyle,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 22,
          paddingBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
};

function FilterModal({ isVisible, onClose, listCateg }) {
  const navigation = useNavigation();
  let screenwidth = Dimensions.get("window").width;
  let screenheight = Dimensions.get("window").height;
  const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;

  const [showFilterModal, setShowFilterModal] = React.useState(isVisible);
  const [manufacturer, setManufacturer] = React.useState("");
  const [availability, setAvailability] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [discount, setDiscount] = React.useState(-1);
  const [minPrice, setMinPrice] = React.useState(0);
  const [maxPrice, setMaxPrice] = React.useState(10000);
  const [isLoading, setLoading] = React.useState(true);
  const [dispoList, setDispoList] = React.useState([]);
  const [promotionList, setPromotionList] = React.useState([]);
  const [catfilterList, setCatfilterList] = React.useState([]);
  const [playOnce, setPlayOnce] = React.useState(false);

  const [categorieList, setCategorieList] = React.useState([]);
  const [isLoadingCat, setIsLoadingCat] = React.useState(true);

  function handlePromotionList(item) {
    let dispo = false;
    promotionList.map((i) => {
      if (i === item) {
        dispo = true;
      }
    });
    if (!dispo) {
      setPromotionList([...promotionList, item]);
    } else {
      setPromotionList(promotionList.filter((i) => i !== item));
    }
  }
  function handleDispoList(item) {
    let dispo = false;
    dispoList.map((i) => {
      if (i === item) {
        dispo = true;
      }
    });
    if (!dispo) {
      setDispoList([...dispoList, item]);
    } else {
      setDispoList(dispoList.filter((i) => i !== item));
    }
  }
  function handlecatfilterList(item) {
    let catfilter = false;
    catfilterList.map((i) => {
      if (i === item) {
        catfilter = true;
      }
    });
    if (!catfilter) {
      setCatfilterList([...catfilterList, item]);
    } else {
      setCatfilterList(catfilterList.filter((i) => i !== item));
    }
  }

  React.useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchCategories();
    }
  }, [categorieList]);

  function fetchCategories() {
    axios
      .post(CATEGORY_URL)
      .then((response) => {
        setCategorieList(response.data.slice().reverse());
      })
      .finally(() => {
        setIsLoadingCat(false);
      });
  }

  React.useEffect(() => {
    if (showFilterModal) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        onClose();
      });
    }
  }, [showFilterModal]);

  const modalY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenheight, screenheight - 610],
  });
  function renderPrice() {
    return (
      <Section title="Prix">
        <View
          style={{
            alignItems: "center",
            width: windowWidth - 50,
          }}
        >
          <TwoPointSlider
            values={[0, 100]}
            min={0}
            max={100}
            postFix=" TND    "
            onValueChange={(values) => {
              setMinPrice(values[0]);
              setMaxPrice(values[1]);
            }}
          />
        </View>
      </Section>
    );
  }

  function renderManufacturer() {
    return (
      <Section
        title="Catégories"
        containerStyle={{
          marginTop: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {categorieList.map((item, index) => {
            return (
              <TextButton
                key={index}
                label={item.nom}
                withImage={false}
                labelStyle={{
                  color:
                    catfilterList.indexOf(item) > -1
                      ? COLORS.white
                      : COLORS.black,
                }}
                buttonContainerStyle={{
                  paddingHorizontal: 10,
                  width: "45%",
                  height: 50,
                  margin: 5,
                  alignItems: "center",
                  borderRadius: 10,
                  backgroundColor:
                    catfilterList.indexOf(item) > -1
                      ? COLORS.primary
                      : COLORS.secondary,
                }}
                onPress={() => handlecatfilterList(item)}
              />
            );
          })}
          {/* {catfilterList.map((item, index) => {
            return (
              <Text key={index}>
                {item.nom} length {catfilterList.length}
              </Text>
            );
          })} */}
        </View>
      </Section>
    );
  }

  function renderPromotion() {
    return (
      <Section
        title="Promotion"
        containerStyle={{
          marginTop: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <TextButton
            label={"oui"}
            withImage={false}
            labelStyle={{
              color:
                promotionList.indexOf("oui") > -1 ? COLORS.white : COLORS.black,
            }}
            buttonContainerStyle={{
              paddingHorizontal: 10,
              width: "95%",
              height: 50,
              margin: 5,
              alignItems: "center",
              borderRadius: 10,
              backgroundColor:
                promotionList.indexOf("oui") > -1
                  ? COLORS.primary
                  : COLORS.secondary,
            }}
            onPress={() => handlePromotionList("oui")}
          />
          <TextButton
            label={"non"}
            withImage={false}
            labelStyle={{
              color:
                promotionList.indexOf("non") > -1 ? COLORS.white : COLORS.black,
            }}
            buttonContainerStyle={{
              paddingHorizontal: 10,
              width: "95%",
              height: 50,
              margin: 5,
              alignItems: "center",
              borderRadius: 10,
              backgroundColor:
                promotionList.indexOf("non") > -1
                  ? COLORS.primary
                  : COLORS.secondary,
            }}
            onPress={() => handlePromotionList("non")}
          />
        </View>
      </Section>
    );
  }

  function renderAvailability() {
    return (
      <Section
        title="cas En Stock"
        containerStyle={{
          marginTop: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          <TextButton
            label={"En Stock"}
            withImage={false}
            labelStyle={{
              color:
                dispoList.indexOf("En Stock") > -1
                  ? COLORS.white
                  : COLORS.black,
            }}
            buttonContainerStyle={{
              paddingHorizontal: 10,
              width: "95%",
              height: 50,
              margin: 5,
              alignItems: "center",
              borderRadius: 10,
              backgroundColor:
                dispoList.indexOf("En Stock") > -1
                  ? COLORS.primary
                  : COLORS.secondary,
            }}
            onPress={() => handleDispoList("En Stock")}
          />
          <TextButton
            label={"Hors Stock"}
            withImage={false}
            labelStyle={{
              color:
                dispoList.indexOf("Hors Stock") > -1
                  ? COLORS.white
                  : COLORS.black,
            }}
            buttonContainerStyle={{
              paddingHorizontal: 10,
              width: "95%",
              height: 50,
              margin: 5,
              alignItems: "center",
              borderRadius: 10,
              backgroundColor:
                dispoList.indexOf("Hors Stock") > -1
                  ? COLORS.primary
                  : COLORS.secondary,
            }}
            onPress={() => handleDispoList("Hors Stock")}
          />
        </View>
      </Section>
    );
  }

  function renderRating() {
    return (
      <Section
        title="Rating"
        containerStyle={{
          marginTop: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {ratings.map((item, index) => {
            return (
              <TextButton
                key={index}
                label={item.text}
                withImage={false}
                labelStyle={{
                  color: item.id == rating ? COLORS.white : COLORS.black,
                }}
                buttonContainerStyle={{
                  paddingHorizontal: 10,
                  width: "30%",
                  height: 50,
                  margin: 5,
                  alignItems: "center",
                  borderRadius: 10,
                  backgroundColor:
                    item.id == rating ? COLORS.primary : COLORS.secondary,
                }}
                onPress={() => setRating(item.id)}
              />
            );
          })}
        </View>
      </Section>
    );
  }

  function renderDiscount() {
    return (
      <Section
        title="Promo"
        containerStyle={{
          marginTop: 35,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {discounts.map((item, index) => {
            return (
              <TextButton
                key={index}
                label={item.text}
                withImage={false}
                labelStyle={{
                  color: item.id == discount ? COLORS.white : COLORS.black,
                }}
                buttonContainerStyle={{
                  paddingHorizontal: 10,
                  width: "95%",
                  height: 50,
                  margin: 5,
                  alignItems: "center",
                  borderRadius: 10,
                  backgroundColor:
                    item.id == discount ? COLORS.primary : COLORS.secondary,
                }}
                onPress={() => setDiscount(item.id)}
              />
            );
          })}
        </View>
      </Section>
    );
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      style={{ backgroundColor: COLORS.primary }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.transparentBlack2,
        }}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 50,
              right: 0,
              bottom: 0,
            }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: "absolute",
            left: 0,
            top: modalY,
            width: "100%",
            height: "100%",
            paddingHorizontal: 25,
            paddingTop: 25,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: COLORS.white,
          }}
        >
          {/*header*/}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: COLORS.transparentBlack3,
              borderBottomWidth: 0.5,
              paddingBottom: 25,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 25,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Filter
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 250,
            }}
          >
            {renderPrice()}
            {renderManufacturer()}
            {renderPromotion()}
            {/* {renderAvailability()} */}
            <View
              style={{
                paddingVertical: 50,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  backgroundColor: COLORS.primary,
                  paddingVertical: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 10,
                }}
                onPress={() =>
                  navigation.navigate("FiltredProducts", {
                    minprice: minPrice,
                    maxprice: maxPrice,
                    promotion: promotionList,
                    // stock: dispoList,
                    catfilterList: catfilterList,
                  })
                }
              >
                <Text
                  style={{
                    fontSize: 23,
                    textAlign: "center",
                    color: COLORS.white,
                    fontWeight: "bold",
                  }}
                >
                  Confirmer
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default FilterModal;
