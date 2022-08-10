import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  StatusBar,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Categories from "../components/Home/Categories";
import Header from "../components/Home/Header";
import ReastaurentItems, {
  localRestaurents,
} from "../components/Home/ReastaurentItems";
import SearchBar from "../components/Home/SearchBar";

import { COLORS } from "../config/colors";
import { screens, icons } from "../config/constants";
import IonIcons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";
import Index from "./Index";
import FilterModal from "../components/Home/FilterModal";
import { useDrawerStatus } from "@react-navigation/drawer";
import { useIsFocused } from "@react-navigation/native";

const Home = ({ drawerAnimationStyle, navigation, opened }) => {
  const isFocused = useIsFocused();
  const isDrawerOpen = useDrawerStatus() === "open";

  const [selectedTab, setSelectedTab] = React.useState(screens.home);
  const [showFilterModal, setShowFilterModal] = React.useState(false);
  let screenwidth = Dimensions.get("window").width;
  let screenheight = Dimensions.get("window").height;
  const [searchText, setSearchText] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [listCateg, setListCateg] = React.useState([]);
  const [userId, setUserId] = React.useState(0);
  React.useEffect(() => {
    getData();
    navigation.closeDrawer();
  }, [isFocused]);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("id");
      if (value != 0) {
        setUserId(value);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const childToParent = (childdata) => {
    setSearchText(childdata);
    console.log(childdata);
  };
  const showModal = () => {
    setShowFilterModal(!showFilterModal);
  };
  const onChangeStyle = StyleSheet.create({
    innerStyle: {
      backgroundColor: COLORS.primary,
    },
  });

  const childToParentcateg = (childdata) => {
    setListCateg(childdata);
    console.log(childdata);
  };

  const TabButton = ({
    label,
    icon,
    isFocused,
    onPress,
    innerStyle,
    bgStyle,
    flexStyle,
  }) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View
          style={[
            {
              flex: flexStyle,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <Animated.View
            style={[
              {
                flexDirection: "row-reverse",
                width: "80%",
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 25,
                backgroundColor: bgStyle,
              },
            ]}
          >
            {isFocused && (
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: 10,
                  color: isFocused ? COLORS.white : COLORS.black,
                }}
              >
                {label}
              </Text>
            )}
            <IonIcons
              name={icon}
              size={20}
              color={isFocused ? COLORS.white : COLORS.black}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  if (!isDrawerOpen) {
    drawerAnimationStyle = {};
  }
  return (
    <Animated.View
      style={{
        backgroundColor: COLORS.secondary,

        borderRadius: 25,
        height: "100%",
        ...drawerAnimationStyle,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: isDrawerOpen ? 25 : 0,
          padding: 15,
          paddingTop: StatusBar.currentHeight,
        }}
      >
        <Header navigation={navigation} userId={userId} />
        <SearchBar showModal={showModal} childToParent={childToParent} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {showFilterModal && (
          <FilterModal
            listCateg={listCateg}
            isVisible={showFilterModal}
            onClose={() => setShowFilterModal(false)}
          />
        )}
        <Index
          searchText={searchText}
          childToParentcateg={childToParentcateg}
        />
      </ScrollView>
      {/* Footer */}
      <View
        style={{
          height: 80,
          justifyContent: "flex-end",
        }}
      >
        {/* Tabs */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingHorizontal: 12,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: COLORS.white,
            borderRadius: isDrawerOpen ? 25 : 0,
          }}
        >
          <TabButton
            label="Accueil"
            icon={icons.home}
            isFocused={selectedTab == screens.home}
            flexStyle={selectedTab == screens.home ? 4 : 1}
            bgStyle={
              selectedTab == screens.home ? COLORS.primary : COLORS.white
            }
            onPress={() => setSelectedTab(screens.home)}
          />
          <TabButton
            label={screens.notification}
            icon={icons.notification}
            isFocused={selectedTab == screens.notification}
            flexStyle={selectedTab == screens.notification ? 4 : 1}
            bgStyle={
              selectedTab == screens.notification
                ? COLORS.primary
                : COLORS.white
            }
            onPress={() => navigation.navigate("Categories")}
          />
          <TabButton
            label={screens.search}
            icon={icons.search}
            isFocused={selectedTab == screens.search}
            flexStyle={selectedTab == screens.search ? 4 : 1}
            bgStyle={
              selectedTab == screens.search ? COLORS.primary : COLORS.white
            }
            onPress={() =>
              userId != 0
                ? navigation.navigate("Profile")
                : navigation.navigate("Login")
            }
          />
          <TabButton
            label={screens.cart}
            icon={icons.cart}
            isFocused={selectedTab == screens.cart}
            flexStyle={selectedTab == screens.cart ? 4 : 1}
            bgStyle={
              selectedTab == screens.cart ? COLORS.primary : COLORS.white
            }
            onPress={() =>
              userId != 0
                ? navigation.navigate("MyCart")
                : navigation.navigate("login")
            }
          />
        </View>
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginTop: StatusBar.currentHeight,
  },
});
export default Home;
