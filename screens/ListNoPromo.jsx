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
  ActivityIndicator,
} from "react-native";
import * as Progress from "react-native-progress";
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
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const PRODUCT_URL = adresseIp + "produit/showall";

const ListNoPromo = ({ navigation, route }) => {
  const { productList } = route.params;
  const [value, setValue] = React.useState([]);
  const [checked, setChecked] = React.useState([]);
  const [checked1, setChecked1] = React.useState([]);
  const [checkedPromotion, setCheckedPromotion] = React.useState(false);
  const [checkedcat, setCheckedcateg] = React.useState(false);
  const [checkedDispo, setCheckedDispo] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [priceMin, setPriceMin] = React.useState(0);
  const [priceMax, setPriceMax] = React.useState(0);
  const [checkList, setCheckList] = React.useState([]);
  const [checkList1, setCheckList1] = React.useState(["oui", "non"]);
  const [priceChanged, setPriceChanged] = React.useState(false);
  const [filteredList, setFilteredList] = React.useState([]);
  const [filteredListLoading, setFilteredListLoading] = React.useState(true);
  const [filterStateMarketplace, setFilterStateMarketplace] =
    React.useState(true);
  const [var1, setVar1] = React.useState(false);
  const [var2, setVar2] = React.useState(false);
  const [var3, setVar3] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={28}
          onPress={() => navigation.goBack()}
          style={{ flex: 0.2 }}
        />
        <Text style={styles.headerText}>Produits</Text>
        <View style={{ flex: 0.2 }}></View>
      </View>
      <View style={styles.productListContainer}>
        <View style={styles.productList}>
          <ScrollView vertical showsVerticalScrollIndicator={false}>
            {productList.map((item, index) => (
              <HorizontalProductsCard
                key={index}
                title={item.nom}
                description={item.description}
                img={item.image[0].imageURL}
                price={item.prix}
                id={item.id}
                model={"trfyg"}
                weight={50}
                qt={item.stock}
                discount={item.discount}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListNoPromo;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
  },
  header: {
    width: windowWidth,
    height: 60,
    flexDirection: "row",
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: "white",
    alignContent: "space-between",
    marginBottom: 8,
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
  productListContainer: {
    width: windowWidth,
    height: windowHeight - 100,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});
