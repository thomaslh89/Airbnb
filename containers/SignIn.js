import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useId, useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SignIn({ setToken, setId }) {
  const styles = useStyles();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage("Please enter an Email");
    }
    if (!password.trim()) {
      setErrorMessage("Please enter a valid password");
    }

    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
        {
          email: email,
          password: password,
        }
      );
      console.log(response.data.token);
      if (response.data.token && response.data.id) {
        const userToken = response.data.token;
        const userId = response.data.id;

        await setToken(userToken); // Pass both token and userId
        await setId(userId); // Pass both token and userId

        console.log(">>>>>>usertoken", userToken);
        console.log(">>>>>>userId", userId);
      }
      alert("You are connected !");
    } catch (error) {
      console.log(error.message);
      if (error.response.status === 400) {
        alert("Please verify your username or your password");
      }
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.page}>
        <View style={styles.form}>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            textContentType="emailAddress"
            value={email}
            placeholder="email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          ></TextInput>
          <View style={styles.container}>
            <TextInput
              style={styles.textinput}
              secureTextEntry={!showPassword}
              textContentType="password"
              value={password}
              placeholder="password"
              onChangeText={(text) => {
                setPassword(text);
              }}
            ></TextInput>
            <MaterialCommunityIcons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={toggleShowPassword}
            />
          </View>

          <Text style={styles.accountError}>{errorMessage}</Text>
          <TouchableOpacity style={styles.buttonSign} onPress={handleSubmit}>
            <Text style={styles.sign}>Sign In</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate("SignUp")}>
            No account ? Register
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const useStyles = () => {
  const { height, width } = useWindowDimensions();

  const styles = StyleSheet.create({
    page: {
      justifyContent: "center",
      alignContent: "center",
      //   height: height,
      //   width: width,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
      // backgroundColor: "#f3f3f3",
      borderBottomColor: "red",
      borderBottomWidth: 0.5,
      width: "70%",
      height: 30,
      marginBottom: 40,
      justifyContent: "space-between",
    },
    textinput: {
      flex: 1,
    },
    logo: {
      height: 200,
      width: 200,
      objectFit: "contain",
    },
    input: {
      borderBottomColor: "red",
      borderBottomWidth: 0.5,
      width: "70%",
      height: 30,
      marginBottom: 40,
    },
    inputdescription: {
      borderColor: "red",
      borderWidth: 0.5,
      width: "70%",
      height: 80,
      marginBottom: 40,
    },
    form: {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 30,
      marginBottom: 30,
      color: "grey",
    },
    sign: {
      borderColor: "red",
      borderWidth: 3,
      fontSize: 30,
      padding: 20,
      width: 300,
      justifyContent: "center",
      borderRadius: 40,
      color: "grey",
      textAlign: "center",
      marginBottom: 4,
    },
    accountError: {
      color: "red",
    },
    passwordError: {
      color: "red",
    },
    heroImage: {
      flexDirection: "row",
    },
  });
  return styles;
};
