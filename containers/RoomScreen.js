import { useRoute } from "@react-navigation/core";
import { Entypo } from "@expo/vector-icons";

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";

export default function RoomScreen({ route }) {
  const { id } = route.params;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const url = `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${id}`;
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayStars = (rate) => {
    const tab = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        tab.push(<Entypo name="star" size={24} color="gold" key={i} />);
      } else {
        tab.push(<Entypo name="star" size={24} color="grey" key={i} />);
      }
    }

    return tab;
  };

  const handleShowMore = () => {
    setShowMore(true);
    setNumberOfLines(null);
  };
  const handleShowLess = () => {
    setShowMore(false);
    setNumberOfLines(3);
  };
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <ImageBackground
            style={styles.imgBgc}
            source={{ uri: data.photos[0].url }}
          >
            <Text style={styles.price}>{data.price} €</Text>
          </ImageBackground>
          <View style={[styles.flexRow, styles.secondPart]}>
            <View>
              <Text>{data.title}</Text>
              <View style={styles.flexRow}>
                {displayStars(data.ratingValue)}
              </View>
            </View>

            <Image
              style={styles.avatar}
              source={{ uri: data.user.account.photo.url }}
            />
          </View>
          <Text numberOfLines={numberOfLines}>{data.description}</Text>

          <TouchableOpacity onPress={handleShowMore}>
            <Text>Show More</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShowLess}>
            <Text>Show Less</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  secondPart: {
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  imgBgc: {
    height: 250,
    justifyContent: "flex-end",
  },
  price: {
    color: "white",
    backgroundColor: "black",
    width: 70,
    paddingVertical: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  description: {},
});
