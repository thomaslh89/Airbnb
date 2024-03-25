import { Image, StyleSheet } from "react-native";
const Header = () => {
  return <Image source={require("../assets/logo.png")} style={styles.logo} />;
};

export default Header;

const styles = StyleSheet.create({
  logo: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
});
