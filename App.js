import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { StyleSheet, Text, View, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Home from "./screens/Home";
import CustomDrawer from "./navigation/CustomDrawer";
import Details from "./screens/Details";
import MyCart from "./screens/MyCart";
import Thank from "./screens/Thank";
import Categories from "./screens/Categories";
import Produits from "./screens/Produits";
import Salons from "./screens/Salons";
import Actualites from "./screens/Actualites";
import ActualiteDetails from "./screens/ActualiteDetails";
import SalonDetails from "./screens/SalonDetails";
import Profile from "./screens/Profile";
import EditProfile from "./screens/EditProfile";
import EditPassword from "./screens/EditPassword";
import OrderList from "./screens/OrderList";
import OrderDetails from "./screens/OrderDetails";
import ProduitsParCategorie from "./screens/ProduitsParCategorie";
import MesSalons from "./screens/MesSalons";
import ListPromo from "./screens/ListPromo";
import ListNoPromo from "./screens/ListNoPromo";
import FiltredProducts from "./screens/FiltredProducts";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} component={CustomDrawer} />
        <Stack.Screen name="Produits" component={Produits} />
        <Stack.Screen name="Thank" component={Thank} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MyCart" component={MyCart} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Salons" component={Salons} />
        <Stack.Screen name="Actualites" component={Actualites} />
        <Stack.Screen name="ActualiteDetails" component={ActualiteDetails} />
        <Stack.Screen name="SalonDetails" component={SalonDetails} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="EditPassword" component={EditPassword} />
        <Stack.Screen name="OrderList" component={OrderList} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="MesSalons" component={MesSalons} />
        <Stack.Screen name="ListPromo" component={ListPromo} />
        <Stack.Screen name="ListNoPromo" component={ListNoPromo} />
        <Stack.Screen name="FiltredProducts" component={FiltredProducts} />
        <Stack.Screen
          name="ProduitsParCategorie"
          component={ProduitsParCategorie}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
