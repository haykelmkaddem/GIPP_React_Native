import {
  createDrawerNavigator,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import {
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";

import { COLORS } from "../config/colors";
import AntIcons from "@expo/vector-icons/AntDesign";

import Home from "../screens/Home";
import Animated from "react-native-reanimated";
import Header from "../components/Home/Header";
import SearchBar from "../components/Home/SearchBar";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Drawer = createDrawerNavigator();

const CustomDrawerItem = ({ label, icon }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        height: 40,
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "flex-end",
        borderRadius: 5,
        marginLeft: 15,
      }}
    >
      <Text
        style={{
          textAlign: "center",
          marginLeft: 15,
          fontWeight: "bold",
          fontSize: 15,
          color: "white",
        }}
      >
        {label}
      </Text>
      <AntIcons name={icon} color={"white"} size={20} />
    </View>
  );
};

const CustomDrawerContent = ({ navigation }) => {
  const [userName, setUserName] = React.useState("");
  const [userId, setUserId] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState(true);
  const isFocused = useIsFocused();

  const getData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const nom = await AsyncStorage.getItem("nom");
      const prenom = await AsyncStorage.getItem("prenom");
      if (id !== null) {
        setUserName(JSON.parse(prenom) + " " + JSON.parse(nom));
        setUserId(id);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const removeData = async () => {
    try {
      await AsyncStorage.removeItem("nom");
      await AsyncStorage.removeItem("prenom");
      await AsyncStorage.removeItem("email");
      await AsyncStorage.removeItem("id");
    } catch (e) {
      console.log(e);
    }
  };

  function logout() {
    removeData();
    navigation.navigate("Login");
  }
  React.useEffect(() => {
    getData();
  }, [isFocused]);
  return (
    <DrawerContentScrollView
      scrollEnabled={true}
      contentContainerStyle={{
        flex: 1,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}
      >
        {/*close */}
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.closeDrawer();
            }}
          >
            <AntIcons name="close" color={"white"} size={35} />
          </TouchableOpacity>
        </View>
        {/*Profile */}

        <TouchableOpacity
          style={{
            flexDirection: "row",
            marginTop: 35,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.navigate("Profile")}
        >
          {userId != 0 && (
            <View>
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {userName}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Mon Profile
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            marginTop: 10,
          }}
        >
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            style={{
              marginBottom: 30,
            }}
          >
            <TouchableOpacity onPress={() => navigation.closeDrawer()}>
              <CustomDrawerItem label="Accueil" icon="home" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
              <CustomDrawerItem label="Catégories" icon="tago" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Produits")}>
              <CustomDrawerItem label="Produits" icon="inbox" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Salons")}>
              <CustomDrawerItem label="Salons" icon="calendar" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Actualites")}>
              <CustomDrawerItem label="Actualités" icon="filetext1" />
            </TouchableOpacity>

            <View
              style={{
                height: 1,
                marginLeft: 15,
                marginVertical: 15,
                backgroundColor: "#ddd",
              }}
            />
            {userId != 0 && (
              <>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Profile")}
                >
                  <CustomDrawerItem label="Paramétre" icon="setting" />
                </TouchableOpacity>
                <>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("MyCart")}
                  >
                    <CustomDrawerItem label="Panier" icon="shoppingcart" />
                  </TouchableOpacity>
                </>
                <TouchableOpacity
                  onPress={() => navigation.navigate("OrderList")}
                >
                  <CustomDrawerItem label="Mes Commandes" icon="profile" />
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => navigation.navigate("AboutUs")}>
              <CustomDrawerItem label="A Propos" icon="infocirlceo" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ContactUs")}>
              <CustomDrawerItem label="Contact" icon="infocirlceo" />
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              userId != 0 ? logout() : navigation.navigate("Login")
            }
          >
            {userId != 0 ? (
              <CustomDrawerItem label="Logout" icon="logout" />
            ) : (
              <CustomDrawerItem label="LogIn" icon="login" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const CustomDrawer = () => {
  const [progress, setProgress] = React.useState(new Animated.Value(0));
  let screenwidth = Dimensions.get("window").width;
  let screenheight = Dimensions.get("window").height;
  const scale = Animated.interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 0.8],
  });

  const borderRadius = Animated.interpolateNode(progress, {
    inputRange: [0, 0.5],
    outputRange: [0, 26],
  });
  const animatedStyle = { borderRadius, transform: [{ scale }] };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          Platform.OS === "android" ? COLORS.primary : COLORS.primary,
      }}
    >
      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        screenOptions={{
          drawerStyle: {
            flex: 1,
            width: "65%",
            paddingRight: 20,
            backgroundColor: COLORS.primary,
          },
          sceneContainerStyle: {
            backgroundColor: "transparent",
          },
          overlayColor: "transparent",
          headerShown: false,
        }}
        initialRouteName="Home"
        drawerContent={(props) => {
          setTimeout(() => {
            setProgress(props.progress);
          }, 0);

          return <CustomDrawerContent navigation={props.navigation} />;
        }}
      >
        <Drawer.Screen name="Home1">
          {(props) => (
            <Home
              {...props}
              opened={false}
              drawerAnimationStyle={{
                height: screenheight - 100,
                width: screenwidth,
                marginTop: 80,
                marginLeft: Platform.OS === "android" ? 260 : 0,
              }}
              navigation={props.navigation}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </View>
  );
};

export default CustomDrawer;
