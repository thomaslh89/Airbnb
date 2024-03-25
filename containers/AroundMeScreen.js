import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AroundMeScreen = () => {
  const [userCoords, setUserCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    const askPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        // console.log(status);

        if (status === "granted") {
          const { coords } = await Location.getCurrentPositionAsync();

          // console.log(coords);

          setUserCoords({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });

          const { data } = await axios.get(
            `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
          );
          // console.log(data);
          setRoomsList(data);
        } else {
          const { data } = await axios.get(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
          );

          //   console.log(data);

          setRoomsList(data);
        }
      } catch (error) {
        console.log("catch >>>", error.response);
      }
      setIsLoading(false);
    };
    askPermission();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
    >
      {roomsList.map((room) => {
        console.log(JSON.stringify(room.location, null, 2));
        return (
          <Marker
            key={room._id}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
            onPress={() => {
              navigation.navigate("RoomScreen", { id: room._id });
            }}
          />
        );
      })}
    </MapView>
  );
};

export default AroundMeScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
