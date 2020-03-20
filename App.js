import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Linking,
  TouchableOpacity
} from "react-native";
import Weather from "./Weather";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";

const API_KEY = "4beff79b54a07b4e04033175087dcbf0";

export default class App extends Component {
  state = {
    isLoaded: false,
    error: null,
    temperature: null,
    name: null,
    lat: null,
    long: null
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
  componentDidUpdate() {
    console.log("jifjiji");
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

  render() {
    const { isLoaded, error, temperature, name, lat, long } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        {isLoaded ? (
          <>
            <Weather
              weatherName={name}
              temp={Math.ceil(temperature - 273.15)}
            />
          </>
        ) : (
          <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={styles.loading}>
              {Platform.OS === "ios" ? (
                <>
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
                </>
              ) : (
                <>
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
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </>
              )}
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
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
    color: "#ffb000",
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
  }
});
