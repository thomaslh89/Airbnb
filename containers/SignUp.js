import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUp({ setToken }) {
  const styles = useStyles();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const handleSubmit = async () => {
    if (password !== confirmpassword) {
      setPasswordError("Passwords must be the same");
    }
    if (!email.trim()) {
      alert("Please enter an Email");
    }
    if (!username.trim()) {
      alert("Please enter a username");
    }
    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up/",
        {
          email: email,
          password: password,
          username: username,
          description: description,
        }
      );
      console.log(response.data);
      if (response.data.token) {
        async () => {
          const userToken = response.data.token;
          setToken(userToken);
          // console.log("signupusertoken>>>", userToken);
        };
        alert("Your account has been created !");
      }
      console.log(response.data);
      // setIsLoading(false)
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage("This email already has an account with us!");
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.page}>
        <View style={styles.form}>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            textContentType="emailAddress"
            value={email}
            placeholder="email"
            onChangeText={(text) => {
              setEmail(text);
            }}
          ></TextInput>
          <TextInput
            style={styles.input}
            textContentType="name"
            value={username}
            placeholder="username"
            onChangeText={(text) => {
              setUserName(text);
            }}
          ></TextInput>
          <TextInput
            style={styles.inputdescription}
            multiline
            value={description}
            placeholder="Describe yourself in a few words..."
            onChangeText={(text) => {
              setDescription(text);
            }}
          ></TextInput>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            textContentType="password"
            value={password}
            placeholder="password"
            onChangeText={(text) => {
              setPassword(text);
            }}
          ></TextInput>
          <TextInput
            style={styles.input}
            secureTextEntry={true}
            textContentType="password"
            value={confirmpassword}
            placeholder="confirm password"
            onChangeText={(text) => {
              setConfirmpassword(text);
            }}
          ></TextInput>
          <Text style={styles.accountError}>{errorMessage}</Text>
          <Text style={styles.passwordError}>{passwordError}</Text>
          <TouchableOpacity style={styles.buttonSign} onPress={handleSubmit}>
            <Text style={styles.sign}>Sign Up</Text>
          </TouchableOpacity>
          <Text onPress={() => navigation.navigate("SignIn")}>
            Already have an account ? Sign in
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
  });
  return styles;
};
