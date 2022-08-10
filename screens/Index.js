import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

import Categories from "../components/Home/Categories";
import FilterModal from "../components/Home/FilterModal";
import ReastaurentItem from "../components/Home/ReastaurentItems";
import HorizontalProductsCard from "../components/HorizontalProductsCard";
import SectionTitle from "../components/SectionTitle";
import VerticalProductsCard from "../components/VerticalProductsCard";
import { adresseIp } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { COLORS } from "../config/colors";
const PRODUCT_URL = adresseIp + "produit/showall";
import * as Progress from "react-native-progress";
const CATEGORY_URL = adresseIp + "categorie/showall";

const Index = ({ navigation, searchText, childToParentcateg }) => {
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [isLoadingSaleTops, setLoadingSaleTops] = React.useState(false);
  const [productsFromDB, setProductsFromDB] = React.useState([]);
  const [saleTopsFromDB, setSaleTopsFromDB] = React.useState([]);
  const [searched, setSearched] = React.useState([]);
  const [typedText, setTypedText] = React.useState(searchText);
  const [category, setCategory] = React.useState("");
  let width = Dimensions.get("window").width;

  const [productList, setProductList] = React.useState([]);
  const [productListPromo, setProductListPromo] = React.useState([]);
  const [productListNoPromo, setProductListNoPromo] = React.useState([]);
  const [isLoadingP, setIsLoadingP] = React.useState(true);
  const [playOnce, setPlayOnce] = React.useState(false);

  const [categorieList, setCategorieList] = React.useState([]);
  const [isLoadingCat, setIsLoadingCat] = React.useState(true);

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

  React.useEffect(() => {
    if (!playOnce) {
      setPlayOnce(true);
      fetchProduis();
      fetchCategories();
      if (!isLoadingCat) {
        childToParentcateg(response.data);
      }
    }
  }, [productList, categorieList, isLoadingCat]);

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

  function fetchProduis() {
    axios
      .get(PRODUCT_URL)
      .then((response) => {
        let prod = [];
        response.data
          .slice()
          .reverse()
          .map((item) => {
            if (item.visibilite == true) {
              prod.push(item);
            }
          });
        setProductList(prod);
        let max = 0;
        let min = 0;
        if (response.data[0].discount == null) {
          max = response.data[0].prix;
          min = response.data[0].prix;
        } else {
          max = response.data[0].discount;
          min = response.data[0].discount;
        }
        console.log("max : " + max, "min : " + min);
        let k = 0;
        for (let index = 0; index < response.data.length - 1; index++) {
          k = k + 1;
          console.log("index : " + index);
          if (max < response.data[index + 1].prix) {
            max = response.data[index + 1].prix;
          }
          if (min > response.data[index + 1].prix) {
            min = response.data[index + 1].prix;
          }
        }
        console.log("max : " + max, "min : " + min);
        console.log("k : " + k);
        setPriceMax(max);
        setPriceMin(min);
        setValue([min, max]);

        let categories = [];
        response.data.map((product) => {
          if (categories.includes(product.categorie.nom) === false) {
            categories.push(product.categorie.nom);
          }
        });
        setCheckList(categories);

        let promo = [];
        let noPromo = [];
        response.data.map((product) => {
          if (product.discount != null && product.visibilite == true) {
            promo.push(product);
          }
          if (product.discount == null && product.visibilite == true) {
            noPromo.push(product);
          }
        });
        setProductListPromo(promo);
        setProductListNoPromo(noPromo);
      })
      .finally(() => {
        setIsLoadingP(false);
      });
  }

  const childToParent = (childdata) => {
    setCategory(childdata);
    console.log(childdata);
  };
  return (
    <View>
      {!isLoadingCat && searchText == "" && (
        <Categories
          categorieList={categorieList}
          childToParent={childToParent}
        />
      )}

      {searchText == "" && category == "" && (
        <View>
          <SectionTitle
            title="Nos Promos"
            link="ListPromo"
            productList={productListPromo}
          />
          {isLoadingP ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {/* <ActivityIndicator size="large" color={COLORS.logo} /> */}
              <Progress.CircleSnail
                color={[COLORS.primary, COLORS.logo]}
                size={80}
              />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {productListPromo.map((item, index) => (
                <VerticalProductsCard
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
          )}

          <SectionTitle
            title="Nos Produits"
            link="ListNoPromo"
            productList={productListNoPromo}
          />
          {isLoadingP ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {/* <ActivityIndicator size="large" color={COLORS.logo} /> */}
              <Progress.CircleSnail
                color={[COLORS.primary, COLORS.logo]}
                size={80}
              />
            </View>
          ) : (
            <ScrollView
              vertical
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 5 }}
            >
              {productListNoPromo.map((item, index) => (
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
          )}
        </View>
      )}

      {searchText != "" && category == "" && (
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
        >
          {productList
            .filter((item) => {
              return (
                item.nom.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              );
            })
            .map((item, index) => (
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
      )}
      {category != "" && searchText == "" && (
        <ScrollView
          vertical
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 5 }}
        >
          {productListNoPromo.filter((item) => {
            return item.categorie.nom
              .toLowerCase()
              .includes(category.toLowerCase());
          }).length == 0 && (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Pas de produits pour la catégorie {category}
            </Text>
          )}
          {productListNoPromo
            .filter((item) => {
              return item.categorie.nom
                .toLowerCase()
                .includes(category.toLowerCase());
            })
            .map((item, index) => (
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
      )}
    </View>
  );
};

export default Index;
