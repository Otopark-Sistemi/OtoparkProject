import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import colors from "../../assets/colors/color";
import color from "../../assets/colors/color";

const { width, height } = Dimensions.get("window");

const w = width / 10;
const h = height / 10;

export default function HomeScreen() {
  const [plaka, setPlaka] = useState("");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Backend'den veri çekme fonksiyonu
    const fetchBlocks = async () => {
      try {
        const response = await fetch("http://192.168.1.81:8082/area/getAll"); // Backend API URL'sini buraya ekleyin
        const data = await response.json();
        setBlocks(data);
      } catch (error) {
        console.error("Error fetching parking blocks:", error);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ThemedView
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: h * 2,
            position: "relative",
            backgroundColor: colors().color1,
            margin: 10,
            borderRadius: 20,
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "400",
            }}
          >
            PLAKA NUMARASI
          </Text>
          <TextInput
            placeholder="34 AA 1234"
            placeholderTextColor="white"
            autoCapitalize="characters"
            onChangeText={(text) => setPlaka(text)}
            value={plaka}
            style={{
              backgroundColor: "rgba(255,255,255,0.8)",
              borderRadius: 2,
              width: w * 8,
              height: h * 0.5,
              marginTop: 10,
              color: "black",
              fontSize: 40,
              textAlign: "center",
              fontWeight: "600",
            }}
          />
        </ThemedView>
      </View>
      <ScrollView
        style={{
          margin: 10,
          flex: 3,
        }}
      >
        {blocks.map((block, index) => (
          <View
            key={index}
            style={{
              borderWidth: 2,
              borderColor: "rgba(0,0,0,0.5)",
              borderRadius: 5,
              padding: 10,
              paddingRight: 0,
              marginBottom: 20,
              backgroundColor: "rgba(155,155,255,0.2)",
            }}
          >
            <Text
              style={{
                borderBottomWidth: 2,
                borderBottomColor: colors().color1,
                paddingBottom: 5,
                shadowColor: color().color3,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 3,
                color: "black",
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              {block.blockName} Blok
            </Text>
            <ScrollView horizontal>
              {Object.entries(block.park_alan_durum).map(
                ([spotId, isOccupied], idx) => (
                  <View
                    key={idx}
                    style={{
                      padding: 5,
                      borderRadius: 5,
                      margin: 5,
                      height: h * 1.4,
                      width: w * 2,
                      justifyContent: "center",
                      alignItems: "center",

                      backgroundColor: isOccupied ? "red" : "green",
                      shadowColor: isOccupied ? "red" : "green",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.3,
                      shadowRadius: 2,
                      elevation: 3,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      {spotId} {isOccupied ? "" : ""}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  blockContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  blockName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  spotContainer: {
    textAlign: "center",

    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  occupiedSpot: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: h * 0.2,
  },
  availableSpot: {
    color: "green",
  },
});
