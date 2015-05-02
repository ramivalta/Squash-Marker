/* jslint esnext:true */

(function() {
  'use strict';

  var _ = require('lodash-node');
  var moment = require('moment');

  var React = require('react-native');
  var {
      AppRegistry,
      StyleSheet,
      TextInput,
      Text,
      View,
      ScrollView,
      Navigator,
      TouchableHighlight,
      LayoutAnimation,
      PixelRatio,
      AsyncStorage,
      Image
  } = React;

  var DeviceHeight = require('Dimensions').get('window').height;
  var DeviceWidth = require('Dimensions').get('window').width;
  var NavigationBar = require('react-native-navbar');
  var Icon = require('react-native-icons');
  var RNS = require('react-native-store');
  var BlurView = require('react-native-blur').BlurView;

  var MatchView = require('./matchView');
  var LayoutAnimationConfigs = require('./LayoutAnimations');


  var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    content: {
        flex: 1,
        height: DeviceHeight - 48,
        backgroundColor: '#eeeeee',
    },
    textBox: {
        height: 48,
        borderWidth: 0,
        flex: 1,
        padding: 6,
        backgroundColor: '#fefefe',
        textAlign: 'center',
        justifyContent: 'center',
        width: DeviceWidth
    },
    textBoxError: {
        borderColor: 'red'
    },
    textBoxContainer: {
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#cccccc',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#cccccc'
    },
    textBoxContainerError: {
        borderTopWidth: 3 / PixelRatio.get(),
        borderTopColor: 'red',
        borderBottomWidth: 3 / PixelRatio.get(),
        borderBottomColor: 'red'
    },
    toggleActive: {
        backgroundColor: '#0078ff',
        width: 74,
        height: 32,
        alignItems: 'center'
    },
    toggleInactive: {
        backgroundColor: '#ffffff',
        width: 74,
        height: 32,
        alignItems: 'center'
    },
    whiteText: {
        color: 'white',
        marginTop: 6,
        fontWeight: '700'
    },
    blackText: {
        color: '#0076ff', // LOL ACCULLY NOT BLACK
        marginTop: 6,
        fontWeight: '700'
    },
  });



  var MatchSetupView = React.createClass({
      getInitialState: function() {
          return {
              bestOf5: true,
              playerOne: null,
              playerTwo: null,
          };
      },

      componentDidMount: function() {
          console.log("MATCHSETUP PROPS", this.props);
      },

      componentDidUpdate: function() {
          var config = LayoutAnimationConfigs[1];
          LayoutAnimation.configureNext(config);
      },

      startMatch: function() {
          var self = this;

          if (!this.state.playerOne || !this.state.playerTwo) {
              this.setState({
                  showErrors: true
              });
              return;
          }

          var id = "";
          var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

          for (var i=0; i < 8; i++)
              id += possible.charAt(Math.floor(Math.random() * possible.length));

          var match = {
              playerOne: this.state.playerOne,
              playerTwo: this.state.playerTwo,
              bestOf: this.state.bestOf5 ? 5 : 3,
              scores: [{
              }],
              id: id,
              matchOver: false,
              startTime: moment.utc().toISOString()
          };

          RNS.table('matches').then(function(matches) {
              var item_id = matches.add(match);
              console.log("ADDED TO RNS", item_id);
              match._rnsId = item_id;
              console.log("MATCH SETUP DATA", match);

              var _matchView = {
                  _id: 'matchView',
                  component: MatchView,
                  passProps: {
                      match:  match,
                      renderScene: self.props.renderScene,
                  },
              };
              //console.log("MATCHVIEW", MatchView);


              console.log(self.props);
              console.log(_matchView);

              self.props.renderScene(_matchView);

              console.log("NAVIGATOR IN MATCHSETUP", self.props.navigator);

              self.props.navigator.push(_matchView);
          });
      },

      render: function() {
          return (
              <ScrollView style={styles.container} centerContent={true}>
                  <View style={styles.container}>
                      <View style={[styles.textBoxContainer, this.state.showErrors && !this.state.playerOne && styles.textBoxContainerError]}>
                          <TextInput onChangeText={(text) => this.setState({playerOne: text})} style={[styles.textBox, !this.state.playerOne && styles.textBoxError]} clearButtonMode={'while-editing'} autoCapitalize={'words'} enablesReturnKeyAutomatically={true} placeholder={'Player #1'} />
                      </View>
                  </View>
                  <View style={{margin: 6}}>
                      <Text style={{textAlign: 'center', fontSize: 12, color: '#777777'}}>
                          versus
                      </Text>
                  </View>
                  <View style={styles.container}>
                      <View style={[styles.textBoxContainer, this.state.showErrors && !this.state.playerTwo && styles.textBoxContainerError]}>
                          <TextInput onChangeText={(text) => this.setState({playerTwo: text})} style={[styles.textBox, !this.state.playerTwo && styles.textBoxError]} clearButtonMode={'while-editing'} placeholder={'Player #2'} autoCapitalize={'words'} />
                      </View>
                  </View>

                  <View style={{marginTop: 24, marginBottom: 2}}>
                      <Text style={{textAlign: 'center', fontSize: 12, color: '#777777'}}>
                          Best Of
                      </Text>
                  </View>

                  <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', marginBottom: 24}}>
                      <View style={{borderRadius: 4, borderWidth: 1, borderColor: '#0076ff', width: 148, height: 32, flexDirection: 'row', overflow: 'hidden'}}>
                          <TouchableHighlight style={[styles.toggleInactive, !this.state.bestOf5 && styles.toggleActive]} onPress={() => this.setState({bestOf5: false})} underlayColor={'#0076ff'}>
                              <Text style={[styles.blackText, !this.state.bestOf5 && styles.whiteText]}>
                                  3
                              </Text>
                          </TouchableHighlight>
                          <TouchableHighlight style={[styles.toggleInactive, this.state.bestOf5 && styles.toggleActive]}  onPress={() => this.setState({bestOf5: true})} underlayColor={'#0076ff'}>
                              <Text style={[styles.blackText, this.state.bestOf5 && styles.whiteText]}>
                                  5
                              </Text>
                          </TouchableHighlight>
                      </View>
                  </View>

                  <TouchableHighlight onPress={this.startMatch}>
                      <View style={{backgroundColor: '#0076ff', flex: 1, height: 48, borderTopWidth: 1 / PixelRatio.get(), borderTopColor: '#666666', borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#666666' }}>
                          <Text style={{color: '#ffffff', textAlign: 'center', marginTop: 14}}>
                              Start Match
                          </Text>
                      </View>
                  </TouchableHighlight>
              </ScrollView>
          );
      }
  });

  module.exports = MatchSetupView;

})();
