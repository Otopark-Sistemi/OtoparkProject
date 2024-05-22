import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import blocks from "../../constants/DataSet";

import { ThemedView } from "@/components/ThemedView";
import colors from "../../assets/colors/color";

const { width, height } = Dimensions.get("window");

const w = width / 10;
const h = height / 10;

export default function HomeScreen() {
  const [plaka, setPlaka] = useState("");
  const [blocksData, setBlocksData] = useState([]);
  const [searchResult, setSearchResult] = useState<string | null>(null); // setSearchResult'u null veya string olarak tanımla

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await fetch("http://192.168.1.78:8082/area/getAll"); // Backend API URL'sini buraya ekleyin
        const data = await response.json();
        setBlocksData(data);
      } catch (error) {
        console.error("Error fetching parking blocks:", error);
      }
    };

    fetchBlocks();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://192.168.1.78:8082/search/${plaka}`); // Plaka için backend API endpointini buraya ekleyin
      const data = await response.json();

      if (data && data.blockName && data.plaka && data.parkNumber) {
        setSearchResult(
          `Blok: ${data.blockName}, Plaka: ${data.plaka}, Park Numarası: ${data.parkNumber}`
        );
      } else {
        setSearchResult("Bu plakada araç bulunamadı");
      }
    } catch (error) {
      console.error("Error searching vehicle:", error);
      setSearchResult("Arama sırasında bir hata oluştu");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ThemedView
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: h * 2,
            margin: "auto",
            width: w * 9,
            position: "relative",
            backgroundColor: colors().color1,
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
          <TouchableOpacity
            style={{
              backgroundColor: colors().color2,
              width: w * 6,
              height: h * 0.7,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 10,
            }}
            onPress={handleSearch}
          >
            <Text style={{ color: "white", fontSize: 20 }}>ARA</Text>
          </TouchableOpacity>
        </ThemedView>
      </View>
      {searchResult !== null ? (
        <View style={{ flex: 3 }}>
          <ThemedView
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: h * 2,
              margin: "auto",
              width: w * 9,
              position: "relative",
              backgroundColor: colors().color1,
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
                marginTop: 20,
              }}
            >
              ARAÇ BULUNDU
            </Text>
            <View
              style={{
                backgroundColor: colors().color2,
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ color: "white", fontSize: 18 }}>
                {searchResult}
              </Text>
            </View>
          </ThemedView>
        </View>
      ) : (
        <ScrollView style={{ margin: 10, flex: 3 }}>
          {blocksData.map((block, index) => (
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
                  shadowColor: colors().color3,
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
      )}
    </View>
  );
}
