import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Linking,
  Button
} from 'react-native';


const authorizationUrl = 
  (url, appId, callback, scope, responseType = 'token') =>
    `${url}?scope=${encodeURIComponent(scope)}&
      redirect_uri=${encodeURIComponent(callback)}&
      response_type=${responseType}&
      client_id=${appId}`.replace(/\s+/g, '');

const AUTH = 'https://yourauth/o/oauth2/v1/auth'
const TOKEN= 'https://yourtoken/o/oauth2/v1/token'
const LOGOUT = 'https://yourlogoutendpoint/logout?returnTo=' 
const clientId = 'yourid'
const callback = 'yourcallback';
const SCOPE = 'email profile';

export default class oauth2_test2 extends Component {
  state = {
    loggedIn: false
  }

  componentDidMount() {
    this.login()
  }

  login() {
    const handleUrl = (event) => {
      console.log('got event: ', event)
      const authCode = event.url.substring(event.url.indexOf('=') + 1, event.url.length)
      console.log('auth code: ', authCode)
      const tokenRequest = {code: authCode, client_id: clientId, redirect_uri: callback, grant_type: 'authorization_code'}
      var s = []

      for (var key in tokenRequest) {
        if (tokenRequest.hasOwnProperty(key)) {
          s.push(encodeURIComponent(key) + '=' + encodeURIComponent(tokenRequest[key]))
        }
      }
      const targetUrl = s.join('&')
      console.log('targetUrl: ', targetUrl)
      fetch(TOKEN, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: s.join('&')
      }).then((response) => {
        console.log('got response: ', response)
        this.setState({loggedIn: true})
      }).catch(error => {
        console.log('error: ', error)
      })

      Linking.removeEventListener('url', handleUrl)
    }
    Linking.addEventListener('url', handleUrl)
    Linking.openURL(authorizationUrl(AUTH, clientId, callback,SCOPE, 'code'))
  }

  logout() {
    const handleUrl = (event) => {
      console.log('got logout event: ', event)
      Linking.removeEventListener('url', handleUrl)

      this.login()
    }
    Linking.addEventListener('url', handleUrl)
    Linking.openURL(LOGOUT+ callback)
      .then(response => {
        console.log('logout response: ', response)
        this.setState({loggedIn: false})
        // this.login()
      }).catch(error => {
        console.log('logout error: ', error)
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text>Logged In: {this.state.loggedIn ? 'true' : 'false'}</Text>
        {this.state.loggedIn &&
            <Button
              onPress={this.logout.bind(this)}
              title="Logout"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            /> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('oauth2_test2', () => oauth2_test2);
