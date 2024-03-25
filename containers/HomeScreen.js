import {
  Button,
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms`;
        const response = await axios.get(url);
        // console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (rating) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating - filledStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(<Entypo key={i} name="star" size={24} color="gold" />);
    }
    if (halfStar) {
      stars.push(
        <Entypo key={stars.length} name="star-half" size={24} color="gold" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Entypo key={stars.length} name="star" size={24} color="gray" />
      );
    }
    return stars;
  };

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item._id)}
          renderItem={({ item }) => (
            <View style={styles.wrapper}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("RoomScreen", { id: item._id });
                }}
              >
                <Image
                  style={styles.img}
                  source={{ uri: item.photos[0].url }}
                />
              </TouchableOpacity>
              <View style={styles.descriptioncontainer}>
                <View style={styles.titleContainer}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {renderStars(item.ratingValue)}
                    <Text style={styles.review}>{item.reviews} reviews</Text>
                  </View>
                </View>
                <Image
                  style={styles.imguser}
                  source={{ uri: item.user.account.photo.url }}
                />
              </View>
              <Text style={styles.price}>{item.price} €</Text>
            </View>
          )}
        />
      )}
      {/* 
      <Button
        title="Aller au profil"
        onPress={() => {
          navigation.navigate("Profil", { userId: 123 });
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignContent: "center",
    objectFit: "contain",
  },
  img: {
    width: "90%",
    height: 265,
    alignItems: "center",
    marginLeft: 15,
    position: "relative",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  imguser: { height: 100, width: 100, borderRadius: 60 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  descriptioncontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    gap: 10,

    marginBottom: 10,
  },
  review: { color: "lightgrey", marginLeft: 5 },
  titleContainer: { flex: 1, gap: 15 },
  price: {
    position: "absolute",
    marginLeft: 15,
    marginTop: 170,
    borderWidth: 2,
    padding: 15,
    color: "white",
    backgroundColor: "black",
    fontSize: 30,
  },
});
