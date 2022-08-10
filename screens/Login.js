import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  StyledFormArea,
  TextInput,
  TouchableOpacity,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
} from "react-native";
import axios from "axios";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../config/colors";
import { Dimensions } from "react-native";
import { adresseIp } from "../config/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const LOGIN_URL = "http://10.0.2.2:8000/loginUser";

const Login = ({ route, navigation }) => {
  const [pwd, setPwd] = React.useState("");
  const [hidePassword, sethidePassword] = React.useState(true);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [userdata, setUserdata] = React.useState("");
  const [roleuser, setRoleuser] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [runuseeffect, setRunuseeffect] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  const [isBiometricsSupported, setIsBiometricsSupported] =
    React.useState(false);
  // React.useEffect(() => {
  //   if (message == "ok") {
  //     distributionData();
  //     if (email != "" && password != "") {
  //       saveDataOnFirstLogin(email, password);
  //     }
  //     setEmail("");
  //     setPassword("");
  //     setMessage("");
  //   }
  // }, [message]);

  React.useEffect(() => {
    if (!isLoading) {
      messageResult();
    }
    if (message == "ok") {
      console.log("message -> " + message);
      console.log("role -> " + roleuser);
      console.log("isAdmin -> " + isAdmin);

      AsyncStorage.setItem("email", JSON.stringify(email));
      AsyncStorage.setItem("nom", JSON.stringify(response.user.nom));
      AsyncStorage.setItem("prenom", JSON.stringify(response.user.prenom));
      AsyncStorage.setItem("id", JSON.stringify(response.user.id));
      AsyncStorage.setItem("selected_language", "Français");

      // if (isAdmin) {
      //   navigate("/adminavislist");
      // } else {
      //   navigate("/");
      // }
      distributionData();
      if (email != "" && password != "") {
        saveDataOnFirstLogin(email, password);
      }
      setEmail("");
      setPassword("");
      setMessage("");

      navigation.navigate("Home");
    }
  }, [email, password, isLoading, runuseeffect, message]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setEmail("");
  //     setPassword("");
  //     alert("Hi from profile");
  //   }, [])
  // );

  function fetchUser(email, password) {
    axios
      .post(LOGIN_URL, {
        email: email,
        password: password,
      })
      .then((response) => {
        setResponse(response.data);
      })
      .finally(() => {
        setIsLoading(false);
        setRunuseeffect(!runuseeffect);
      })
      .catch((error) => console.log(error));
  }
  function messageResult() {
    setMessage(response.message);
  }

  function distributionData() {
    setUserdata(response.user);
    setRoleuser(response.user.roles);
    for (let i = 0; i < response.user.roles.length; i++) {
      if (response.user.roles[i] == "ROLE_ADMIN") {
        setIsAdmin(true);
      }
    }
    setIsLoading(true);
  }
  /**
   * Biometrics
   */
  const handleBiometrics = async () => {
    const isbiometricAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isbiometricAvailable) {
      console.log("authentication is not available");
    }

    let supportedBiometrics;
    if (isbiometricAvailable) {
      supportedBiometrics =
        LocalAuthentication.supportedAuthenticationTypesAsync();
    }
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

    if (!savedBiometrics) {
      console.log("authentication is not available saved");
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Confirmer votre empreinte pour continuer",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (biometricAuth.success) {
      console.log("authentication success");
      console.log(biometricAuth);
      getValueFor("login", "pwd");
    } else {
      console.log("authentication not success");
    }
  };
  async function getValueFor(login, password) {
    let storedLogin = await SecureStore.getItemAsync(login);
    let storedPwd = await SecureStore.getItemAsync(password);
    if (storedLogin && storedPwd) {
      try {
        axios
          .post(LOGIN_URL, {
            email: storedLogin,
            password: storedPwd,
          })
          .then((response) => {
            setResponse(response.data);
          })
          .finally(() => {
            setIsLoading(false);
            setRunuseeffect(!runuseeffect);
          })
          .catch((error) => console.log(error));

        console.log("local authentication" + storedLogin + storedPwd);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("🔐 s'enregistrer d'abord!");
    }
  }

  async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }
  function saveDataOnFirstLogin(login, password) {
    console.log("saved for bio" + login);
    console.log("saved for bio" + password);
    save("login", login);
    save("pwd", password);
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={styles.topLogin}> */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/images/logo.png")}
          ></Image>
          <Text style={styles.logotext}>GIPP</Text>
        </View>
        {/* </View> */}
        {message != "ok" && message != "" && (
          <View
            style={{
              backgroundColor: "red",
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                padding: 3,
                textAlign: "center",
              }}
            >
              {message}
            </Text>
          </View>
        )}
        <View style={styles.searchContainer}>
          <Octicons
            style={{
              marginLeft: 20,
            }}
            name="mail"
            size={23}
          />

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            // onChangeText={(newEmail) => setEmail(newEmail)}
            // defaultValue={email}
            defaultValue={email}
            onChangeText={(e) => setEmail(e)}
            style={styles.textInput}
          />
          {/* <Text style={{ fontSize: 35 }}>{email}</Text> */}
        </View>
        <View style={styles.searchContainer}>
          <Octicons
            style={{
              marginLeft: 20,
            }}
            name="lock"
            size={23}
          />

          <TextInput
            placeholder="Mot De Passe"
            secureTextEntry={hidePassword}
            // onChangeText={(newPwd) => setPwd(newPwd)}
            // defaultValue={pwd}
            defaultValue={password}
            onChangeText={(e) => setPassword(e)}
            style={styles.textInput}
          />
          <TouchableOpacity onPress={() => sethidePassword(!hidePassword)}>
            <Ionicons
              style={{
                marginRight: 20,
              }}
              name={hidePassword ? "md-eye-off" : "md-eye"}
              size={23}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text
            style={{
              paddingLeft: 10,
              marginTop: 5,
              marginBottom: 20,
              color: "white",
            }}
          >
            Mot de Passe Oublié ?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => fetchUser(email, password)}
        >
          <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
        </TouchableOpacity>
        <View style={styles.line} />
        <TouchableOpacity style={styles.regBtn}>
          <Text
            onPress={() => navigation.navigate("Signup")}
            style={{ color: "white", textAlign: "center" }}
          >
            Inscription
          </Text>
        </TouchableOpacity>
        {/* button go home */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Consultez nos produits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
          onPress={() => handleBiometrics()}
        >
          {/* <Image
            style={styles.scan}
            source={require("../assets/images/logo.png")}
          ></Image> */}
          <MaterialCommunityIcons
            style={{
              color: COLORS.logo,
              fontSize: 80,
            }}
            name={"fingerprint"}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loginBtn: {
    backgroundColor: COLORS.logo,
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 10,
  },
  regBtn: {
    backgroundColor: "#4A4A4A",
    height: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  topLogin: {
    height: 150,
    backgroundColor: COLORS.primary,
    borderBottomEndRadius: 180,
    borderBottomStartRadius: 180,
    marginTop: 20,
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: "contain",
  },
  logotext: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 60,
    flex: 1,
    paddingBottom: 40,
  },
  searchContainer: {
    height: 50,
    backgroundColor: COLORS.secondary,
    borderRadius: 15,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    width: windowWidth - 30,
  },
  textInput: {
    fontSize: 18,
    flex: 1,
    marginLeft: 20,
    textAlign: "left",
  },
  line: {
    height: 1,
    width: "95%",
    backgroundColor: "black",
    opacity: 0.3,
    marginVertical: 10,
    alignSelf: "center",
  },
  scan: {
    width: 150,
    height: windowHeight / 6,
    resizeMode: "contain",
    marginTop: 30,
    alignSelf: "center",
  },
});
