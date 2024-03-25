import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
export default function Profile({ setToken, userId, userToken, setId }) {
  const styles = useStyles();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedPicture, setSelectedPicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`, // Ajoutez le jeton d'authentification dans l'en-tête
          },
        });
        console.log(userId);
        console.log(response.data);
        setEmail(response.data.email);
        setName(response.data.username);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPermissionAndGetPicture = async () => {
    //Demander le droit d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      //Ouvrir la galerie photo
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (result.canceled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      //Ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();

      if (result.canceled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.assets[0].uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const sendPicture = async () => {
    setIsLoading(true);

    const tab = selectedPicture.split(".");
    try {
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab[tab.length - 1]}`,
        type: `image/${tab[tab.length - 1]}`,
      });

      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          //Si vous avez des headers à transmettre c'est par ici !
          //headers: { Authorization: "Bearer " + userToken },
          //transformRequest: (formData) => formData,
        }
      );

      if (response.data) {
        setIsLoading(false);
        alert("Photo Envoyée !");
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.page}>
        <View style={styles.avatar}>
          {selectedPicture ? (
            <Image style={styles.heroImage} source={{ uri: selectedPicture }} />
          ) : (
            <Ionicons
              style={styles.heroImage}
              name="person-outline"
              size={160}
              color="grey"
            />
          )}
          <View style={styles.iconContainer}>
            <TouchableOpacity>
              <Entypo
                name="image"
                size={24}
                color="black"
                onPress={getPermissionAndGetPicture}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Entypo
                name="camera"
                size={24}
                color="black"
                onPress={getPermissionAndTakePicture}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.form}>
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
            value={name}
            placeholder="name"
            onChangeText={(text) => {
              setName(text);
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
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              border: "red",
            }}
          />

          <TouchableOpacity
            style={styles.buttonSign}
            onPress={() => {
              setToken(null);
            }}
          >
            <Text style={styles.sign}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonSign}
            onPress={() => {
              setToken(null);
              setId(null);
            }}
          >
            <Text style={styles.sign}>Log Out</Text>
          </TouchableOpacity>
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
    heroImage: {
      height: 200,
      width: 200,
      borderWidth: 2,
      borderColor: "red",
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    avatar: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
      marginTop: 30,
      marginBottom: 30,
      justifyContent: "center",
    },
  });
  return styles;
};
