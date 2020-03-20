import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Linking,
  TouchableOpacity,
  RefreshControl,
  ScrollView
} from "react-native";
import Weather from "./Weather";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import * as IntentLauncher from "expo-intent-launcher";

const API_KEY = "4beff79b54a07b4e04033175087dcbf0";

export default class App extends React.Component {
  state = {
    isLoaded: false,
    error: null,
    temperature: null,
    name: null,
    lat: null,
    long: null,
    refreshing: false
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude);
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
      },
      error => {
        this.setState({
          error: error
        });
      }
    );
  }

  _getWeather = (lat, long) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}`
    )
      .then(response => response.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          name: json.weather[0].main,
          isLoaded: true
        });
      });
  };

  _onRefresh = () => {
    try {
      this.setState({ refreshing: true });
      navigator.geolocation.getCurrentPosition(
        position => {
          this._getWeather(position.coords.latitude, position.coords.longitude);
          this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
        },
        error => {
          this.setState({
            error: error
          });
        }
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  render() {
    const { isLoaded, temperature, name, refreshing } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {isLoaded ? (
          <Weather weatherName={name} temp={Math.ceil(temperature - 273.15)} />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this._onRefresh}
                tintColor={"#999"}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
          >
            {Platform.OS === "ios" ? (
              <View style={styles.loading}>
                <Text>
                  To enable location, tap Open Settings, then tap on Location,
                  and finally tap on While Using the App.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => Linking.openURL("app-settings:")}
                >
                  <Text>SETTINGS</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                  <Text>PULL DOWN</Text>
                </View>
                <View style={styles.icon}>
                  <Ionicons size={50} name={"ios-arrow-down"} />
                </View>
              </View>
            ) : (
              <View style={styles.loading}>
                <Text>
                  To enable location, tap Open Settings, then tap on
                  Permissions, then tap on Location, and finally tap on Allow
                  only while using the app.
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    const pkg = Constants.manifest.releaseChannel
                      ? Constants.manifest.android.package
                      : "host.exp.exponent";
                    IntentLauncher.startActivityAsync(
                      IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                      { data: "package:" + pkg }
                    ),
                      setLoading(false);
                  }}
                >
                  <Text>SETTINGS</Text>
                </TouchableOpacity>
                <View style={styles.footer}>
                  <Text>PULL DOWN</Text>
                </View>
                <View style={styles.icon}>
                  <Ionicons size={50} name={"md-arrow-down"} />
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDF6AA",
    justifyContent: "center"
  },
  errorText: {
    color: "red",
    backgroundColor: "transparent",
    marginBottom: 40
  },
  loading: {
    flex: 1,
    backgroundColor: "#FDF6AA",
    justifyContent: "center",
    alignItems: "center",
    padding: 25
  },
  loadingText: {
    textAlign: "center",
    fontSize: 38,
    marginBottom: 24,
    color: "#FDF6AA",
    fontSize: 20
  },
  button: {
    width: 100,
    height: 30,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
  },
  footer: {
    position: "absolute",
    bottom: 50
  },
  icon: {
    position: "absolute",
    bottom: 5,
    justifyContent: "center"
  }
});
