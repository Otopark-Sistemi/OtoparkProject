import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  RefreshControl,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import colors from "../../assets/colors/color";
import { ApıUrl } from "../../constants/ApıUrl";
const { width, height } = Dimensions.get("window");

const w = width / 10;
const h = height / 10;

export default function HomeScreen() {
  const [plaka, setPlaka] = useState("");
  const [blocksData, setBlocksData] = useState([]);
  const [searchData, setSearchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 const fetchBlocks = async () => {
   setLoading(true);
   try {
     const response = await fetch(ApıUrl.get);
     const data = await response.json();
     setBlocksData(data);
   } catch (error) {
     console.error("Error fetching parking blocks:", error);
   } finally {
     setLoading(false);
   }
 };

 const onRefresh = useCallback(async () => {
   setRefreshing(true);
   await fetchBlocks();
   setRefreshing(false);
 }, []);

 useEffect(() => {
   fetchBlocks();
 }, []);

  useEffect(() => {
    if (plaka === "") {
      setSearchData(null);
    }
  }, [plaka]);

  const handleSearch = async () => {
    if (plaka.trim() === "") {
      Keyboard.dismiss();
      setSearchData(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ApıUrl.search}/${plaka}`); // Backend API endpoint
      const data = await response.json();

      if (data && data.blockName && data.plaka && data.parkNumber) {
        setSearchData(data);
      } else {
        setSearchData("not found");
      }
    } catch (error) {
      console.error("Error searching vehicle:", error);
      setSearchData("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "black" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ marginTop: 30 }}>
        <ThemedView
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: h * 2,
            margin: "auto",
            width: w * 9,
            position: "relative",
            backgroundColor: "#222",
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 10,
            },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 15,
            padding: 20,
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
            placeholderTextColor="#aaa"
            autoCapitalize="characters"
            onChangeText={(text) => setPlaka(text)}
            value={plaka}
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: 10,
              width: w * 8,
              height: h * 0.5,
              marginTop: 10,
              color: "white",
              fontSize: 20,
              textAlign: "center",
              fontWeight: "600",
              borderWidth: 1,
              borderColor: "#444",
              paddingHorizontal: 10,
            }}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#444",
              width: w * 6,
              height: h * 0.7,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginTop: 20,
              borderWidth: 1,
              borderColor: "#555",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 5,
            }}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={{ color: "white", fontSize: 18 }}>ARA</Text>
          </TouchableOpacity>
        </ThemedView>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : searchData ? (
        <View style={{ marginTop: 40 }}>
          {searchData === "not found" ? (
            <ThemedView
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: h * 2,
                margin: "auto",
                width: w * 9,
                position: "relative",
                backgroundColor: "#222",
                borderRadius: 20,

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 15,
                padding: 20,
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
                Bu plakada araç bulunamadı
              </Text>
            </ThemedView>
          ) : searchData === "error" ? (
            <ThemedView
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: h * 2,
                margin: "auto",
                width: w * 9,
                position: "relative",
                backgroundColor: "#222",
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 15,
                padding: 20,
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
                Arama sırasında bir hata oluştu
              </Text>
            </ThemedView>
          ) : (
            <ThemedView
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: h * 4,
                margin: "auto",
                width: w * 9,
                position: "relative",
                backgroundColor: "#222",
                borderRadius: 20,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 15,
                padding: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: "400",
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                ARAÇ BULUNDU
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  padding: 10,
                  marginTop: 10,
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: w * 5,
                  height: h * 3,
                }}
              >
                <View
                  style={{
                    backgroundColor: "cyan",
                    marginBottom: h * 0.1,
                    padding: 15,
                    width: w * 5,

                    borderRadius: 10,
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontSize: 18, fontWeight: "600" }}
                  >
                    Blok: {searchData.blockName}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "cyan",
                    marginBottom: 10,
                    padding: 15,
                    width: w * 5,
                    borderRadius: 10,
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontSize: 18, fontWeight: "600" }}
                  >
                    Park Yeri Numarası : {searchData.parkNumber}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "cyan",
                    marginBottom: 10,
                    padding: 10,
                    width: w * 5,
                    borderRadius: 10,
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "black", fontSize: 18, fontWeight: "600" }}
                  >
                    Plaka: {searchData.plaka}
                  </Text>
                </View>
              </View>
            </ThemedView>
          )}
        </View>
      ) : (
        <ScrollView style={{ margin: 10, flex: 3 }}>
          {blocksData.map((block, index) => (
            <View
              key={index}
              style={{
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.2)",
                borderRadius: 5,
                padding: 10,
                paddingRight: 0,
                marginBottom: 20,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Text
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: "#444",
                  paddingBottom: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 2,
                  elevation: 3,
                  color: "white",
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
                        backgroundColor: isOccupied ? "#ff5f9f" : "#53c490",
                        borderWidth: 2,
                        borderColor: isOccupied ? "#cc0000" : "#008000",
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
                        {spotId}
                      </Text>
                    </View>
                  )
                )}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}
