import React from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";

import IonIcons from "react-native-vector-icons/Ionicons";
import { COLORS } from "../../config/colors";

function Header({ navigation, isOpen, userId }) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        marginTop: 10,
      }}
    >
      {/*Logo*/}

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 55,
        }}
      >
        <Image
          style={styles.headerLogo}
          source={require("../../assets/images/logo.png")}
        />
        <Text
          style={{
            fontSize: 35,
            fontWeight: "bold",
            letterSpacing: 5,
            marginTop: 10,
          }}
        >
          GIPP
        </Text>
      </View>

      {/*Right*/}

      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 20,
          borderColor: COLORS.secondary,
          position: "absolute",
        }}
        onPress={() => {
          navigation.openDrawer();
          isOpen = !isOpen;
        }}
      >
        <IonIcons name="menu-outline" size={40} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: 60,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderRadius: 20,
          borderColor: COLORS.secondary,
        }}
        onPress={() =>
          userId != 0
            ? navigation.navigate("MyCart")
            : navigation.navigate("Login")
        }
      >
        <IonIcons name="cart" size={30} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 60,
    resizeMode: "contain",
  },
});
export default Header;
