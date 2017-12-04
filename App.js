import React, { Component } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native';
import Weather from './Weather';

export default class App extends Component {
  state = {
    isLoaded: false,
    error:null
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          isLoaded: true
          });
        console.log(position)
        },
        error => {
          this.state({
            error:error
          })
        }
      );
    }
  render() {
    const { isLoaded, error } = this.state;
    return <View style={styles.container}>
        <StatusBar hidden={true} />
        {isLoaded ? <Weather /> : <View style={styles.loading}>
            <ActivityIndicator size='large' color='red' />
            {error ? <Text style={ styles.errorText }>{ error }</Text> : null}
          </View>}
      </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  errorText:{
    color: 'red',
    backgroundColor: 'transparent'
  },
  loading: {
    flex: 1,
    backgroundColor: "#FDF6AA",
    justifyContent: "center",
    alignItems: "center",
  }
});
