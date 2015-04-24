/* jslint esnext:true */

(function() {
  'use strict';

  var _ = require('lodash-node');
  var moment = require('moment');

  var React = require('react-native');
  var {
      AppRegistry,
      StyleSheet,
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
  var BlurView = require('react-native-blur').BlurView;
  var NavigationBar = require('react-native-navbar');
  var Icon = require('react-native-icons');
  var RNS = require('react-native-store');

  var LayoutAnimationConfigs = require('./LayoutAnimations');

  var serveButtonWidth = DeviceWidth / 2 - 40;

  var styles = StyleSheet.create({
    serveHighlight: {
        position: 'absolute',
        width: DeviceWidth / 2 - 40 + 12,
        height: 36,
        backgroundColor: 'red',
        borderRadius: 12,
        opacity: 0.25,
        left: -24,
        top: -10
    },
    serveHighlightInactive: {
        //backgroundColor: ''
    },

    serveSideButton: {
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        borderColor: '#cccccc',
        borderWidth: 1 / PixelRatio.get(),
        marginTop: -1 / PixelRatio.get(),
        backgroundColor: '#e0e0e0',
        position: 'absolute',
        bottom: 0,
        width: serveButtonWidth,
        overflow: 'hidden',
    },
    serveSideButtonRight: {
        right: -12,
    },
    serveSideButtonLeft: {
        left: -12,
    },
    serveSideMiddle: {
        position: 'absolute',
        left: DeviceWidth / 2 - 35,
        width: 70,
        height: 28,
        alignItems: 'center',
        marginTop: -1 / PixelRatio.get()
    },
    decisionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#999999',
        margin: 4,
        shadowColor: '#333333',
        shadowOpacity: 0.75,
        shadowRadius: 6,
        shadowOffset: {height: 1, width: 1},
        opacity: 0.85
    },
    strokeButton: {
        backgroundColor: '#FF4C45',
    },
    letButton: {
        backgroundColor: '#1EBD31'
    },
    noLetButton: {
        backgroundColor: '#FFAF20'
    },
    container: {
        flex: 1,
        backgroundColor: '#eeeeee',
    },
    content: {
        flex: 1,
        height: DeviceHeight - 48,
        backgroundColor: '#eeeeee',
    },
    evenRow: {
        flexDirection: 'row',
        flex: 1,
        height: 36,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#cccccc',
        backgroundColor: '#ffffff'
    },

    oddRow: {
        flexDirection: 'row',
        flex: 1,
        height: 36,
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#cccccc',
        backgroundColor: '#f9f9f9'
    },

    gameBall: {
        backgroundColor: '#BDDBFF',
        opacity: 1,
        flex: 1,
        flexDirection: 'row'
    },
    matchBall: {
        backgroundColor: '#FFBAB8',
        opacity: 1,
        flex: 1,
        flexDirection: 'row'
    },
    badge: {
        //borderWidth: 1 / PixelRatio.get(),
        //borderColor: '#777777',
        borderRadius: 9,
        //borderTopColor: 'transparent',
        //borderBottomColor: '#777777',
        width: 40,
        alignItems: 'center',
        backgroundColor: '#cccccc',
        opacity: 0.65,
        padding: 3,
        marginLeft: 2,
        marginRight: 2,
        height: 18,
    },
    strokeBadge: {
        width: 42,
        backgroundColor: '#fb756f',
        //opacity: 0.55,
        //padding: 2
    },
    yesLetBadge: {
        width: 40,
        backgroundColor: '#1ebd31',
        //opacity: 0.55,
        //padding: 2
    },
    noLetBadge: {
        width: 45,
        backgroundColor: '#fabe53',
        //opacity: 0.55,
        //padding: 2
    },
    notUpBadge: { // also downBadge
        width: 50,
        backgroundColor: '#0076ff',
        //padding: 2
    },
    gameMatchBallBadge: {
        width: 75,
        backgroundColor: 'orange'
    },

  });

  var MatchView = React.createClass({
      _currentServeSide: null,

      getInitialState: function() {
          return {
              scores: this.props.match.scores,
              playerOne: this.props.match.playerOne,
              playerTwo: this.props.match.playerTwo,
              bestOf: this.props.match.bestOf,
              id: this.props.match.id,
              p1GamesWon: 0,
              p2GamesWon: 0,
              showDecisionButtons: true
          };
      },

      shouldComponentUpdate: function(nextProps, nextState, nextContext) {
          if (this.props !== nextProps || this.state !== nextState) {
              console.log("MATCHVIEW COMPONENT SHOULD UPDATE");
              return true;
          }
          else return false;
      },

      componentDidMount: function() {
          console.log("MATCHVIEW MOUNTED");
      },

      isGameSet: function(last) {
          //if (this.isMatchSet(last) || this.props.matchOver) return false;
          var latest = _.clone(last);
          //var scores = _.clone(this.state.scores);
          var p1 = latest.p1score;
          var p2 = latest.p2score;

          if (p1 >= 11 || p2 >= 11) {
              if (p1 - p2 >= 2) {
                  return true;
              } else if (p2 - p1 >= 2) {
                  return true;
              }
          }
      },

      isMatchSet: function(last) {
          var latest = _.clone(last);
          var p1 = latest.p1score;
          var p2 = latest.p2score;

          var p1games = latest.p1GamesWon;
          var p2games = latest.p2GamesWon;

          var bestof = this.state.bestOf;
          var toWin;

          if (bestof === 3) toWin = 2;
          else toWin = 3;

          if (p1games === toWin || p2games === toWin) {
              console.log("MATCH SET");
              return true;
          } else {
              return false;
          }
      },

      componentWillUpdate: function(nextProps, nextState) {
          var last = _.last(nextState.scores);
          if (this.isMatchSet(last)) {
              this.handleMatchSet(last);
          } else if (this.isGameSet(last)) {
              this.handleGameSet(last);
          }
      },

      componentDidUpdate: function(prevProps, prevState) {
          var self = this;
          var id = this.props.match.id;
          console.log("MATCH ID", id);

          //var scores = this.state.scores;

          RNS.table('matches').then(function(matches) {
              var updated = matches.where({
                  id: self.props.match.id
              }).update(self.state);

              console.log("UPDATED RNS", updated);
          });

          var config = LayoutAnimationConfigs[0];
          LayoutAnimation.configureNext(config);

      },

      getTimeStamp: function() {
          console.log(moment.utc().toISOString());
          return moment.utc().toISOString();
      },

      handleStroke: function (player) {
          if (this.state.matchOver) return;
          //var scores = _.clone(this.state.scores);
          var previous = _.clone(_.last(this.state.scores));

          console.log("STROKE TO PLAYER", player);

          if (player === "1") {
              previous.p1dec = "stroke";
              previous.p1score += 1;
              previous.p2dec = null;
              previous.toServe = "1";
          } else if (player === "2") {
              previous.p2dec = "stroke";
              previous.p2score += 1;
              previous.p1dec = null;
              previous.toServe = "2";
          }

          this.updateScore(previous);
      },

      handleDown: function(player) {
          if (this.state.matchOver) return;
          //var scores = _.clone(this.state.scores);
          var previous = _.clone(_.last(this.state.scores));

          if (player === "1") {
              previous.p1dec = "down";
              previous.p2score += 1;
              previous.p2dec = null;
              previous.toServe = "2";
          } else if (player === "2") {
              previous.p2dec = "down";
              previous.p1score += 1;
              previous.p1dec = null;
              previous.toServe = "1";
          }

          this.updateScore(previous);
      },

      handleNotUp: function(player) {
          if (this.state.matchOver) return;
          //var scores = _.clone(this.state.scores);
          var previous = _.clone(_.last(this.state.scores));

          if (player === "1") {
              previous.p1dec = "notup";
              previous.p2score += 1;
              previous.p2dec = null;
              previous.toServe = "2";
          } else if (player === "2") {
              previous.p2dec = "notup";
              previous.p1score += 1;
              previous.p1dec = null;
              previous.toServe = "1";
          }

          this.updateScore(previous);
      },

      handleYesLet: function (player) {
          if (this.state.matchOver) return;
          //var scores = _.clone(this.state.scores);
          var previous = _.clone(_.last(this.state.scores));

          if (player === "1") {
              previous.p1dec = "yeslet";
              previous.p2dec = null;
          } else if (player === "2") {
              previous.p2dec = "yeslet";
              previous.p1dec = null;
          }

          this.updateScore(previous);
      },

      handleNoLet: function (player) {
          if (this.state.matchOver) return;
          //var scores = _.clone(this.state.scores);
          var previous = _.clone(_.last(this.state.scores));

          if (player === "1") {
              previous.p1dec = "nolet";
              previous.p2dec = null;
              previous.p2score += 1;
              previous.toServe = "2";
          } else if (player === "2") {
              previous.p2dec = "nolet";
              previous.p1dec = null;
              previous.p1score += 1;
              previous.toServe = "1";
          }

          this.updateScore(previous);
      },

      updateScore: function(newest) {
          var self = this;
          var scores = _.clone(this.state.scores);
          newest.timeStamp = this.getTimeStamp();
          var p1 = newest.p1score;
          var p2 = newest.p2score;

          newest.p2matchBall = false;
          newest.p1matchBall = false;
          newest.p1gameBall  = false;
          newest.p2gameBall  = false;
          newest.handOut = false;

          if (this.isMatchBall(newest)) {
              if (p1 < p2) {
                  newest.p2matchBall = true;
              } else if (p1 > p2) {
                  newest.p1matchBall = true;
              }
          } else if (this.isGameBall(newest)) {
              if (p1 < p2) {
                  newest.p2gameBall = true;
              } else if (p1 > p2) {
                  newest.p1gameBall = true;
              }
          }

          if (newest.p1dec === 'yeslet' || newest.p2dec === 'yeslet') {
              // skip if let
          }

          else if (this.isHandOut(newest)) {
              console.log("HANDOUT TRUE");
              newest.handOut = true;
              //newest.serveSide = null;
              this.handleServeSide(null, newest.toServe, newest);
          } else {
              if (newest.toServe === _.last(scores).toServe) {
                  if (this._currentServeSide === 'right') {
                      newest.serveSide = 'right';
                      //this.handleServeSide(null, newest.toServe, newest);
                      setTimeout(function() {
                          self.handleServeSideToggle('toggle', newest.toServe, newest);
                      }, 450);

                  } else if (this._currentServeSide === 'left') {
                      newest.serveSide = 'left';
                      //this.handleServeSide(null, newest.toServe, newest);
                      setTimeout(function() {
                          self.handleServeSideToggle('toggle', newest.toServe, newest);
                      }, 450);

                  /*} else if (this.state.currentServeSide) {
                      newest.serve = this.state.currentServeSide;*/
                  } else {
                      setTimeout(function() {
                          self.handleServeSideToggle(null, newest.toServe, newest);
                      }, 450);
                      //this.handleServeSide(null, newest.toServe, newest);
                  }
              }
          }
          scores.push(newest);

          this.setState({
              scores: scores
          });
      },

      isHandOut: function(last) {
          var previous = _.last(this.state.scores);

          if (previous.toServe !== last.toServe) {
              return true;
          }
      },

      handleToss: function(player) {
          var self = this;
          this.setState({
              tossDecided: true,
              scores: [{
                  p1score : 0,
                  p2score: 0,
                  p1dec : null,
                  p2dec: null,
                  toServe: player,
                  serveSide: null,
                  p1GamesWon: 0,
                  p2GamesWon: 0
              }],
          });
          this._currentServeSide = null;

          setTimeout(function() {
              //self.handleServeSide('right');
              setTimeout(function() {
                  self.handleServeSide(null, player, _.last(self.state.scores));
              }, 50);
          }, 500);

          /*this.handleServeSide('left');
          this.handleServeSide('right');*/


      },

      handleServeSide: function(side, player, latest, fromUser) {
          var scores = _.clone(this.state.scores);
          var hl = this.refs.serveSideHighlight;

          //var srow = this.refs.serveSideRow;

          var last = latest || _.last(this.state.scores);

          console.log(last);
          if (last.toServe !== player && fromUser) return;

          console.log(side);

          if (side === 'toggle') {
              if (this._currentServeSide === 'left')
                  side = 'right';
              else if (this._currentServeSide === 'right')
                  side = 'left';
              else side = 'right';
          } else if (!side)
              side = null;

          var toServe = player;

          console.log(side);
          console.log(toServe);

          var w = (DeviceWidth - (DeviceWidth * 0.125)) / 2 - 36;

          console.log(w);

          var props;

          var p1left = {
              left: 0,
              right: null,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'white'
          };
          var p1right = {
              left: w - 29,
              right: null,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'white'
          };
          var p2left = {
              right: w - 29,
              left: null,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'white'
          };
          var p2right = {
              right: 1,
              left: null,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'white'
          };
          var uw = w - 16 - 18;
          var p1unknown = {
              width: 28,
              //left: (w - 16) / 2 - 30.5,
              left: (w / 2 - 14),
              right: null,
              height: 28,
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.65)'
          };

          var p2unknown = {
              width: 28,
              left: null,
              //right: (w - 16) / 2 - 30.5,
              right: (w / 2) - 14,
              borderRadius: 14,
              height: 28,
              backgroundColor: 'rgba(255, 255, 255, 0.65)'
          };

          if (toServe === '1' && side === 'left')
              props = p1left;
          else if (toServe === '1' && side === 'right')
              props = p1right;
          else if (toServe === '2' && side === 'left')
              props = p2left;
          else if (toServe === '2' && side === 'right')
              props = p2right;
          else if (toServe === '1' && !side)
              props = p1unknown;
          else if (toServe === '2' && !side)
              props = p2unknown;
          else {
              console.log(toServe, side);
          }

          console.log(props);

          hl.setNativeProps(props);

          this._currentServeSide = side;

          var config = LayoutAnimationConfigs[0];
          LayoutAnimation.configureNext(config);

          this.setState({
              currentServeSide: this._currentServeSide
          });

      },

      isGameBall: function (latest) {
          var p1 = latest.p1score;
          var p2 = latest.p2score;

          var isgameball = false;

          if ((p1 === 10 && p2 < 10) || (p2 === 10 && p1 < 10)) {
              var x = Math.abs(p1 - p2);
              if (x >= 1) {
                  isgameball = true;
              } else isgameball = false;
          } else if (p1 >= 10 && p2 >= 10) {
              var y = Math.abs(p1 - p2);
              if (y >= 1) {
                  isgameball = true;
              } else isgameball = false;
          }

          return isgameball;
      },

      isMatchBall: function(latest) {
          var p1 = latest.p1score;
          var p2 = latest.p2score;

          var ismatchball = false;
          var isgameball = this.isGameBall(latest);

          var p1won = latest.p1GamesWon;
          var p2won = latest.p2GamesWon;

          var bestof = this.state.bestOf;

          var toWin;
          if (bestof === 3) toWin = 2;
          else toWin = 3;

          if(p1won + 1 !== toWin && p2won + 1 !== toWin) {
              ismatchball = false;
          }

          if (isgameball === true && ((p1 === 10 && p2 < 10 && p1won == toWin -1) || (p2 === 10 && p1 < 10 && p2won == toWin -1))) {
              ismatchball = true;
          } else if (p1 >= 10 && p2 >= 10 && isgameball) {
              var y = Math.abs(p1 - p2);
              if (Math.abs(p1 -p2) >= 1 && ((p1won == toWin - 1 && p1 > p2) || (p2won == toWin -1 && p2 > p1)) ) {
                  ismatchball = true;
              }
          }
          return ismatchball;
      },

      handleGameSet: function (latest) {
          if (this.state.matchOver) return;
          if (this.isMatchSet(latest)) return;

          var p = _.clone(latest);
          var scores = _.clone(this.state.scores);

          if (latest.p1score > latest.p2score) {
              latest.p1GamesWon += 1;
          } else {
              latest.p2GamesWon += 1;
          }

          latest.timeStamp = this.getTimeStamp();
          latest.p1score = 0;
          latest.p2score = 0;
          latest.p1dec = null;
          latest.p2dec = null;
          latest.p1gameBall = false;
          latest.p1matchBall = false;
          latest.p2gameBall = false;
          latest.p2matchBall = false;

          scores.push(p);
          scores.push(latest);

          this.setState({
              scores: scores,
          });
      },

      handleMatchSet: function (latest) {
          if (this.state.matchOver) return;
          var scores = _.clone(this.state.scores);

          //latest.timeStamp = this.getTimeStamp();
          console.log(latest);

          var last = _.last(scores);

          if (last.p1GamesWon > last.p2GamesWon) {
              last.matchWonBy = this.props.match.playerOne;
          } else {
              last.matchWonBy = this.props.match.playerTwo;
          }

          scores[scores.length -1] = last;

          console.log("match over");
          this.setState({
              matchOver: true,
              scores: scores
              //scores: scores
          });
      },

      handleServeSideToggle: function(side, player, latest, fromUser) {
          var self = this;
          if (side === 'toggle' && !player) {
              player = _.last(this.state.scores).toServe;
              console.log("PLAYER", player);
              if (_.last(this.state.scores).serveSide === 'left') {
                  //side = 'right';
              } else {
                  //side = 'left';
              }
              //return;
          } else if (player !== _.last(this.state.scores).toServe || !side) return;
          //this.handleServeSide(null, player, latest, fromUser);
          var hl = this.refs.serveSideHighlight;

          var w = (DeviceWidth - (DeviceWidth * 0.125)) / 2;

          var prop = {
              width: 72,
              left: w / 2 - 36 - 18
              //height: 30
          };

          console.log(prop);
          hl.setNativeProps(prop);

          var config = LayoutAnimationConfigs[0];
          LayoutAnimation.configureNext(config);

          setTimeout(function() {
              self.handleServeSide(side, player, latest, fromUser);
          }, 250);
      },

      handleUndo: function() {
          if (this.state.scores.length <= 1) return;
          var scores = _.clone(this.state.scores);

          console.log(_.last(scores));

          if (scores.length > 2) {
              if ((scores[scores.length -3].p1gameBall || scores[scores.length -3].p2gameBall) && _.last(scores).p1score === 0 && _.last(scores).p2score === 0)  {
                  scores.pop();
                  //scores.pop();
              }
          }

          scores.pop();

          var current = _.last(scores);

          console.log("CURRENT", current);
          console.log("CURRENT SERVESIDE", current.serveSide);

          if (current.serveSide === 'left') { // serveside switcharoo
            this.handleServeSide('right', current.toServe, current, true);
          } else if (current.serveSide === 'right') {
            this.handleServeSide('left', current.toServe, current, true);
          } else {
            this.handleServeSide(null, current.toServe, current, true);
          }

          this.setState({
              scores: scores
          });
      },

      handleQuit: function() {
          //this.props.navigator.pop();
          //this.props.renderScene('popToMain');
          var self = this;

          console.log(this.props);

          var routes = this.props.navigator.getCurrentRoutes();
          var main = routes[0];


          RNS.table('matches').then(function(matches) {

              var ms = matches.find();
              console.log("MATCHES IN RNS", ms);
              var m = ms.filter(function(i) {
                  return !i.markedForDeletion;
              });

              var sorted = _.sortBy(m, function(i) {
                  return i.startTime;
              }).reverse();

              main.passProps.matches = sorted;
              main.passProps.updated = true;

              self.props.navigator.replaceAtIndex(main, 0);
              self.props.navigator.popToRoute(main);
          });

      },

      toggleDecisionButtons: function() {
          this.setState({
              showDecisionButtons: !this.state.showDecisionButtons
          });
      },

      render: function() {
          var self = this;

          if (!this.state.tossDecided) {
            return (
                    <Image source={require('image!background_mock')} style={{width: DeviceWidth, height: DeviceHeight, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} ref={'bg'}>
                        <BlurView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: DeviceWidth, height: DeviceHeight, backgroundColor: 'transparent'}} ref={'blur'} blurType='dark'>
                            <CoinModal handleToss={this.handleToss} tossDecided={this.state.tossDecided} match={this.props.match} />
                        </BlurView>
                    </Image>
            );
          } else
              return (
                  <View style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}>

                      <View style={{flex: 1, top: 0, height: 64, backgroundColor: 'white'}}>
                          <View style={{height: 24}}></View>
                          <View style={{flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#777777'}} >
                              <View style={{flexDirection: 'row',  marginRight: 8, height: 40, marginLeft: 8}}>
                                  <TouchableHighlight onPress={this.handleQuit} underlayColor={'transparent'} activeOpacity={0.25} style={{}}>
                                      <View style={{backgroundColor: 'transparent', borderRadius: 17, borderColor: '#0076ff', borderWidth: 1, width: 34, height: 34, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
                                          <Icon
                                              name='ion|ios-close-empty'
                                              color='#0076ff'
                                              size={28}
                                              style={{width: 28, height: 28}}
                                          />
                                      </View>
                                  </TouchableHighlight>
                              </View>

                              <View style={{flexDirection: 'row',  marginRight: 8, height: 40, marginLeft: 8}}>
                                  <TouchableHighlight onPress={this.handleUndo} underlayColor={'transparent'} activeOpacity={0.25} style={{marginLeft: 16, marginRight: 16}}>

                                      <View style={{backgroundColor: 'transparent', borderRadius: 17, borderColor: '#0076ff', borderWidth: 1, width: 34, height: 34, alignItems: 'center', justifyContent: 'center'}}>
                                          <Icon
                                              name='ion|ios-undo'
                                              color='#0076ff'
                                              size={22}
                                              style={{width: 22, height: 22, backgroundColor: 'transparent'}}
                                          />
                                      </View>
                                  </TouchableHighlight>

                                  <TouchableHighlight  underlayColor={'transparent'} activeOpacity={0.25} style={{marginLeft: 16}} onPress={this.toggleDecisionButtons}>
                                      <View style={{backgroundColor: 'transparent', borderRadius: 17, borderColor: '#0076ff', borderWidth: 1, width: 34, height: 34, alignItems: 'center', justifyContent: 'center'}}>
                                          <Icon
                                              name='ion|ios-settings'
                                              color='#0076ff'
                                              size={22}
                                              style={{width: 22, height: 22}}
                                          />
                                      </View>
                                  </TouchableHighlight>
                              </View>
                          </View>
                      </View>
                      <View style={{position: 'absolute', top: 64, bottom: 0, left: 0, right: 0, backgroundColor: '#eeeeee', marginTop: 0}}>

                        <ScoreList scores={this.state.scores} match={this.props.match} isGameBall={this.isGameBall} isMatchBall={this.isMatchBall} isMatchSet={this.isMatchSet} />

                        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 98, backgroundColor: '#eeeeee', top: DeviceHeight - 98 - 64, overflow: 'hidden', borderTopWidth: 1 / PixelRatio.get(), borderTopColor: '#cccccc'}}>

                            <View style={{flex: 1, flexDirection: 'row', height: 42, position: 'absolute', top: 24, left: 0, right: 0, overflow: 'visible', backgroundColor: 'transparent'}}>
                                <View style={{flex: 1, height: 42, marginLeft: 4, marginRight: 4, justifyContent: 'center'}}>
                                    <Text style={{fontWeight: '700', color: '#000000', textAlign: 'center', lineHeight: 12, containerBackgroundColor: 'transparent', height: 12, fontSize: 12}} numberOfLines={1}>
                                        {this.props.match.playerOne}
                                    </Text>
                                </View>

                                <View style={{flex: 0.25, height: 42, justifyContent: 'center'}}>
                                    <Text style={{fontWeight: '700', color: '#000000', textAlign: 'center', lineHeight: 16, containerBackgroundColor: 'transparent', fontSize: 12}} numberOfLines={1}>
                                        {_.last(this.state.scores).p1GamesWon}
                                        -
                                        {_.last(this.state.scores).p2GamesWon}
                                    </Text>
                                </View>

                                <View style={{flex: 1, height: 42, marginLeft: 4, marginRight: 4, justifyContent: 'center'}}>
                                    <Text style={{fontWeight: '700', color: '#000000', textAlign: 'center', lineHeight: 12, containerBackgroundColor: 'transparent', height: 12, fontSize: 12, marginTop: 3}} numberOfLines={1} >
                                        {this.props.match.playerTwo}
                                    </Text>
                                </View>
                            </View>

                            <View style={{flex: 1, flexDirection: 'row', height: 36, position: 'absolute', top: 74, left: 0, right: 0}}>
                                <View style={{flex: 1, height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginRight: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#0076ff', marginBottom: 0, left: 5}}>
                                        <TouchableHighlight style={{flex: 1, height: 66, borderRightWidth: 1 / PixelRatio.get(), borderRightColor: '#cccccc'}} onPress={this.handleDown.bind(null, '1')} underlayColor={'#FF4C45'}>
                                            <Text style={{fontWeight: '300', color: '#ffffff', textAlign: 'center', marginTop: 12, fontSize: 13}}>
                                                Down/Out
                                            </Text>
                                        </TouchableHighlight>

                                        <TouchableHighlight style={{flex: 1, height: 66}}  onPress={this.handleNotUp.bind(null, '1')} underlayColor={'#FF4C45'}>
                                            <Text style={{fontWeight: '300', color: '#ffffff', textAlign: 'center', marginTop: 12, fontSize: 13}}>
                                                Not Up
                                            </Text>
                                        </TouchableHighlight>
                                    </View>

                                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', marginLeft: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#0076ff', marginBottom: 0, right: 5}}>
                                        <TouchableHighlight style={{flex: 1, height: 66, borderRightWidth: 1 / PixelRatio.get(), borderRightColor: '#cccccc'}} onPress={this.handleDown.bind(null, '2')} underlayColor={'#FF4C45'}>
                                            <Text style={{fontWeight: '300', color: '#ffffff', textAlign: 'center', marginTop: 12, fontSize: 13}}>
                                                Down/Out
                                            </Text>
                                        </TouchableHighlight>

                                        <TouchableHighlight style={{flex: 1, height: 66}} onPress={this.handleNotUp.bind(null, '2')} underlayColor={'#FF4C45'}>
                                            <Text style={{fontWeight: '300', color: '#ffffff', textAlign: 'center', marginTop: 12, fontSize: 13}}>
                                                Not Up
                                            </Text>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={[{width: (DeviceWidth - (DeviceWidth * 0.125)) / 2 - 36, backgroundColor: '#dddddd', height: 30, borderRadius: 15, borderWidth: 1 / PixelRatio.get(), borderColor: '#cccccc', position: 'absolute', top: DeviceHeight - 95 - 64, overflow: 'hidden'}, _.last(this.state.scores).toServe === '1' && {left: 24, right: null}, _.last(this.state.scores).toServe === '2' && {right: 24, left: null}]} >

                          <View style={[{backgroundColor: 'transparent', alignItems: 'center', flex: 1, position: 'absolute', width: (DeviceWidth - (DeviceWidth * 0.125)) / 2 - 36,  }, this._currentServeSide === 'right' && {alignItems: 'flex-start'}, this._currentServeSide === 'left' && {alignItems: 'flex-end'}]}>
                            {this._currentServeSide === 'right' &&
                                <Text style={{color: 'black', flex: 1, marginTop: 6, fontSize: '14', marginLeft: 12, marginRight: 12}}>Right</Text>
                            }
                            {this._currentServeSide === 'left' &&
                                <Text style={{color: 'black', flex: 1, marginTop: 6, fontSize: '14', marginLeft: 12, marginRight: 12}}>Left</Text>
                            }
                          </View>

                          <View style={{width: 28, height: 28, borderRadius: 14, backgroundColor: '#f7f7f7', position: 'absolute', left: 0, top: 1 / PixelRatio.get(), borderWidth: 1 / PixelRatio.get(), borderColor: '#555555', shadowColor: '#444444', shadowRadius: 6, shadowOpacity: 0.5, shadowOffset: {height: 0, width: 0}}} ref={'serveSideHighlight'}></View>

                          <TouchableHighlight style={{flex: 1, height: 30}} onPress={this.handleServeSideToggle.bind(null, 'toggle', null, null, 'fromUser')} underlayColor={'transparent'}>
                            <Text></Text>
                          </TouchableHighlight>
                        </View>

                        <DecisionButtonsLeft handleYesLet={this.handleYesLet} handleNoLet={this.handleNoLet} handleStroke={this.handleStroke} showButtons={this.state.showDecisionButtons} />
                        <DecisionButtonsRight handleYesLet={this.handleYesLet} handleNoLet={this.handleNoLet} handleStroke={this.handleStroke} showButtons={this.state.showDecisionButtons} />
                    </View>



                </View>
          );
      }
  });

  var DecisionButtonsLeft = React.createClass({
      render: function() {
          return (
              <View style={[{flexDirection: 'column', position: 'absolute', left: -15, top: DeviceHeight / 2 - 102 -64, width: 84, height: 204, backgroundColor: 'transparent', alignItems: 'center', borderRadius: 24, opacity: 0.85}, !this.props.showButtons && { left: -85}]}>
                  <TouchableHighlight style={[styles.decisionButton, styles.letButton, {marginRight: -10}]}  underlayColor={'green'} onPress={this.props.handleYesLet.bind(null, '1')}>
                      <Text style={{fontSize: 10, fontWeight: '700'}}>YES LET</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={[styles.decisionButton, styles.noLetButton, {marginRight: -10}]}   underlayColor={'orange'} onPress={this.props.handleNoLet.bind(null, '1')}>
                      <Text style={{fontSize: 10, fontWeight: '700'}}>NO LET</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={[styles.decisionButton, styles.strokeButton, {marginRight: -10}]}  underlayColor={'red'} onPress={this.props.handleStroke.bind(null, '1')}>
                    <Text style={{fontSize: 10, fontWeight: '700'}}>STROKE</Text>
                  </TouchableHighlight>
              </View>
          );
      }
  });

  var DecisionButtonsRight = React.createClass({
      render: function() {
          return (
              <View style={[{flexDirection: 'column', position: 'absolute', right: -15, top: DeviceHeight / 2 - 102 -64, width: 84, height: 204, backgroundColor: 'transparent', alignItems: 'center', borderRadius: 24, opacity: 0.85}, !this.props.showButtons && {right: -85}]}>
                  <TouchableHighlight style={[styles.decisionButton, styles.letButton, {marginLeft: -10}]}   underlayColor={'green'} onPress={this.props.handleYesLet.bind(null, '2')}>
                      <Text style={{fontSize: 10, fontWeight: '700'}}>YES LET</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={[styles.decisionButton, styles.noLetButton, {marginLeft: -10}]}  underlayColor={'orange'} onPress={this.props.handleNoLet.bind(null, '2')}>
                      <Text style={{fontSize: 10, fontWeight: '700'}}>NO LET</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={[styles.decisionButton, styles.strokeButton, {marginLeft: -10}]}  underlayColor={'red'} onPress={this.props.handleStroke.bind(null, '2')}>
                      <Text style={{fontSize: 10, fontWeight: '700'}}>STROKE</Text>
                  </TouchableHighlight>
              </View>
          );
      }
  });

  var CoinModal = React.createClass({
      handleToss: function(player) {
          var config = LayoutAnimationConfigs[1];
          LayoutAnimation.configureNext(config);
          this.props.handleToss(player);
      },

      render: function() {
          if (!this.props.tossDecided) {
              var view =
                  <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center', height: DeviceHeight, width: DeviceWidth, flex: 1, backgroundColor: '#555555', opacity: 0.45}} ref={'toServeModal'}>
                      <View style={{flex: 1, width: DeviceWidth, opacity: 1, position: 'absolute', top: DeviceHeight / 2 - 40 - 42, height: 20}}>
                          <Text style={{textAlign: 'center', fontSize: 18, color: 'white', fontWeight: '100'}}>
                              Cointoss won by
                          </Text>
                      </View>

                      <View style={{flexDirection: 'row', flex: 1, opacity: 1, position: 'absolute', top: DeviceHeight / 2 - 42, height: 40, alignItems: 'center', width: DeviceWidth}}>
                          <View style={{flex: 1}}>
                              <TouchableHighlight style={{backgroundColor: '#222222', opacity: 0.95, padding: 12, margin: 8, borderRadius: 8, flexWrap: 'nowrap', height: 40}} onPress={this.handleToss.bind(null, '1')}>
                                  <Text style={{textAlign: 'center', fontSize: 18, color: 'white',  fontWeight: '100', opacity: 1, lineHeight: 18, height: 18}} numberOfLines={1}>
                                      {this.props.match.playerOne}
                                  </Text>
                              </TouchableHighlight>
                          </View>

                          <View style={{flex: 1}}>
                              <TouchableHighlight style={{backgroundColor: '#222222', opacity: 0.95, padding: 12, margin: 8, borderRadius: 8, flexWrap: 'nowrap', height: 40}} onPress={this.handleToss.bind(null, '2')}>
                                  <Text style={{textAlign: 'center', fontSize: 18, color: 'white',  fontWeight: '100', opacity: 1, lineHeight: 18, height: 18}} numberOfLines={1}>
                                      {this.props.match.playerTwo}
                                  </Text>
                              </TouchableHighlight>
                          </View>
                      </View>
                  </View>;

              return view;
          } else {
              return <View></View>;
          }
      }
  });


  var ScoreList = React.createClass({
      shouldComponentUpdate: function(nextProps, nextState, nextContext) {
          if (this.props !== nextProps || this.state !== nextState) {
              console.log("COMPONENT SHOULD UPDATE");
              return true;
          } else return false;
      },

      componentDidMount: function() {
          var self = this;
          setTimeout(function() {
              self.refs.list.scrollTo(150);
              setTimeout(function() {
                  self.refs.list.scrollTo(-50);
                  setTimeout(function() {
                      self.refs.list.scrollTo(0);
                  }, 250);
              }, 150);
          }, 1);
      },

      componentDidUpdate: function(prevProps, prevState) {
          var self = this;
          var initialContentSize = 83.5;

          if (this.props.scores.length > prevProps.scores.length) {
              this._scroll += 36;
              this._contentSize += 36;
          }

          if (this._contentSize > DeviceHeight - 98 - initialContentSize) { // 98 == alareunan kontrollien korkeus, kait?
              console.log("should scroll");
              if (this.props.scores.length < prevProps.scores.length) {
                  this.refs.list.scrollTo(this._scroll + 5);
                  setTimeout(function() {
                      self.refs.list.scrollTo(self._scroll);
                  }, 75);
              } else
                  this.refs.list.scrollTo(this._scroll);
          }

          console.log("calculated scroll pos ", this._scroll);
      },

      handleScroll: function(event) {
          //console.log(event);
          //console.log(this.refs.list);
          //console.log(event.nativeEvent);

          console.log(event.nativeEvent.contentSize);
          console.log(event.nativeEvent.layoutMeasurement);

          this._bottom = event.nativeEvent.layoutMeasurement.height;
          this._contentSize = event.nativeEvent.contentSize.height;
          this._scroll = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;
      },

      renderRow: function(row, index) {
          if (this.props.isMatchSet(row)) {
              var e =
              <View style={{alignItems: 'center', flex: 1, height: 36, justifyContent: 'center'}}>
                  <Text>
                      Match to {row.matchWonBy}, {row.p1GamesWon} - {row.p2GamesWon}

                  </Text>
              </View>;
              return e;
          }

          var r =
              <View style={[styles.oddRow, index % 2 === 0 && styles.evenRow, this.props.isGameBall(row) && styles.gameBall, this.props.isMatchBall(row) && styles.matchBall]} key={'key_' + index}>
                  <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignSelf: 'center'}}>
                      <View style={{marginTop: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                          {((this.props.isGameBall(row) || this.props.isMatchBall(row)) && (row.p1gameBall || row.p1matchBall)) &&
                              <View style={[styles.badge, styles.gameMatchBallBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>
                                      {row.p1gameBall  && ' Game ball'}
                                      {row.p1matchBall && ' Match ball'}
                                  </Text>
                              </View>
                          }

                          {(row.p1dec === 'down' || row.p1dec === 'notup') &&
                              <View style={[styles.badge, styles.notUpBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>
                                      {row.p1dec === 'down'  && 'Down'}
                                      {row.p1dec === 'notup' && 'Not Up'}
                                  </Text>
                              </View>
                          }

                          {row.p1dec === 'yeslet' &&
                              <View style={[styles.badge, styles.yesLetBadge, {width: 45}]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>Yes Let</Text>
                              </View>
                          }

                          {row.p1dec === 'nolet' &&
                              <View style={[styles.badge, styles.noLetBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>No Let</Text>
                              </View>
                          }

                          {row.p1dec === 'stroke' &&
                              <View style={[styles.badge, styles.strokeBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, fontWeight: '500'}}>Stroke</Text>
                              </View>
                          }

                      </View>
                  </View>
                  <View style={{flex: 0.5, backgroundColor: 'transparent'}}>
                      <Text style={{textAlign: 'center', marginTop: 8, color: '#000000', opacity: 1, containerBackgroundColor: 'transparent'}}>
                          {row.p1score} - {row.p2score}
                      </Text>
                  </View>
                  <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start'}}>
                      <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start'}}>
                          {row.p2dec === 'stroke' &&
                              <View style={[styles.badge, styles.strokeBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, fontWeight: '500'}}>Stroke</Text>
                              </View>
                          }
                          {row.p2dec === 'nolet' &&
                              <View style={[styles.badge, styles.noLetBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>No Let</Text>
                              </View>
                          }
                          {row.p2dec === 'yeslet' &&
                              <View style={[styles.badge, styles.yesLetBadge, {width: 45}]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>Yes Let</Text>
                              </View>
                          }
                          {/*row.handOut && row.toServe === '2' &&
                              <View style={[styles.badge, {width: 50}]}>
                                  <Text style={{color: '#111111', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: 200}}>Handout</Text>
                              </View>
                          */}

                          {(row.p2dec === 'down' || row.p2dec === 'notup') &&
                              <View style={[styles.badge, styles.notUpBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>
                                      {row.p2dec === 'down'  && 'Down'}
                                      {row.p2dec === 'notup' && 'Not Up'}
                                  </Text>
                              </View>
                          }

                          {((this.props.isGameBall(row) || this.props.isMatchBall(row)) && (row.p2gameBall || row.p2matchBall)) &&
                              <View style={[styles.badge, styles.gameMatchBallBadge]}>
                                  <Text style={{color: '#ffffff', fontSize: 10, textAlign: 'center', flex: 1, opacity: 1, fontWeight: '500'}}>
                                      {row.p2gameBall  && ' Game ball'}
                                      {row.p2matchBall && ' Match ball'}
                                  </Text>
                              </View>
                          }

                      </View>
                  </View>
              </View>;

          return r;
      },

      render: function() {
          var self = this;
          return (
              <ScrollView style={{position: 'absolute', height: DeviceHeight - 97 - 64, top: 0, left: 0, right: 0, bottom: 97, backgroundColor: '#eeeeee'}} ref={'list'} onScroll={this.handleScroll} onScrollAnimationEnd={this.handleScroll} scrollEventThrottle={128}>
                  <View style={{flex: 1}}>
                      <View style={{flex: 1, height: 48, borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#cccccc', backgroundColor: 'transparent', marginTop: -1 / PixelRatio.get(), justifyContent: 'space-around', alignItems: 'center'}}>
                          <Text style={{marginTop: 5, textAlign: 'center', flex: 1, color: '#777777', fontSize: 11, height: 11}}>
                              {this.props.match.playerOne} versus {this.props.match.playerTwo}
                          </Text>
                          <Text style={{textAlign: 'center', flex: 1, color: '#777777', fontSize: 11, height: 11}}>
                              Best of {this.props.match.bestOf},
                              {' '}
                              {this.props.scores[0].toServe === '1' && this.props.match.playerOne}
                              {this.props.scores[0].toServe === '2' && this.props.match.playerTwo}
                              {' '}
                              to serve
                          </Text>
                      </View>

                      {this.props.scores.map(function(i, index) {
                          return self.renderRow(i, index);
                      })}
                  </View>
              </ScrollView>
          );
      }
  });


  module.exports = MatchView;

})();
