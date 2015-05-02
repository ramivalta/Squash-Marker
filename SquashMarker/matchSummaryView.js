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
      PanResponder,
      Image
  } = React;

  var DeviceHeight = require('Dimensions').get('window').height;
  var DeviceWidth = require('Dimensions').get('window').width;
  var BlurView = require('react-native-blur').BlurView;
  var NavigationBar = require('react-native-navbar');
  var Icon = require('react-native-icons');
  var RNS = require('react-native-store');

  var Modal = require('react-native-modal');

  var LayoutAnimationConfigs = require('./LayoutAnimations');

  var serveButtonWidth = DeviceWidth / 2 - 40;

  var styles = StyleSheet.create({
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

    var MatchSummaryView = React.createClass({
        getInitialState: function() {
            return {
                scores: this.props.match.scores,
                playerOne: this.props.match.playerOne,
                playerTwo: this.props.match.playerTwo,
                bestOf: this.props.match.bestOf,
                id: this.props.match.id,
            };
        },

        shouldComponentUpdate: function(nextProps, nextState, nextContext) {
            if (this.props !== nextProps || this.state !== nextState) {
                console.log("MATCHSUMMARYVIEW COMPONENT SHOULD UPDATE");
                return true;
            }
            else return false;
        },

        componentDidMount: function() {
            console.log("MATCHSUMMARYVIEW MOUNTED");
        },

        componentWillMount: function() {
            this._getDecs();
            this._getWinners();
            this._getErrors();
        },

        _getDecs () {
            var decs = {
                p1lets: 0,
                p2lets: 0,
                p1nolets: 0,
                p2nolets: 0,
                p1strokes: 0,
                p2strokes: 0
            };
            _.each(this.props.match.scores, function(i) {
                if (i.p1dec === 'yeslet') decs.p1lets++;
                if (i.p2dec === 'yeslet') decs.p2lets++;

                if (i.p1dec === 'nolet') decs.p1nolets++;
                if (i.p2dec === 'nolet') decs.p2nolets++;

                if (i.p1dec === 'stroke') decs.p1strokes++;
                if (i.p2dec === 'stroke') decs.p1strokes++;
            });

            this.setState({
                p1lets      : decs.p1lets,
                p2lets      : decs.p2lets,
                p1strokes   : decs.p1strokes,
                p2strokes   : decs.p2strokes,
                p1nolets    : decs.p1nolets,
                p2nolets    : decs.p2nolets
            });
        },

        _getWinners () {
            var winners = {
                p1: 0,
                p2: 0
            };

            _.each(this.props.match.scores, function(i) {
                if (i.p2dec === 'notup') winners.p1++;
                if (i.p1dec === 'notup') winners.p2++;
            });

            this.setState({
                p1winners: winners.p1,
                p2winners: winners.p2
            });
        },

        _getErrors () {
            var errors = {
                p1: 0,
                p2: 0
            };

            _.each(this.props.match.scores, function(i) {
                if (i.p2dec === 'down') errors.p2++;
                if (i.p1dec === 'down') errors.p1++;
            });

            this.setState({
                p1errors: errors.p1,
                p2errors: errors.p2
            });
        },

        render: function() {
            var self = this;
            return (
                <View style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0}}>
                    <Image style={{width: DeviceWidth, height: 152, position: 'absolute', top: 0, left: 0, right: 0}} source={require('image!vibrancy_backdrop')}>
                        <BlurView style={{height: 152, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#777777', position: 'absolute', top: 0, left: 0, right: 0, flex: 1 }} blurType={'dark'}>
                            <TouchableHighlight style={{position: 'absolute', width: 72, height: 32, borderRadius: 16, borderWidth: 1 / PixelRatio.get(), borderColor: '#cccccc', alignItems: 'center', justifyContent: 'center', right: 10, top: 24}} underlayColor='#888888' onPress={function() {self.props.navigator.pop();}}>
                                <Text style={{textAlign: 'center', color: '#cccccc'}}>
                                    Close
                                </Text>
                            </TouchableHighlight>


                            <View style={{flex: 1, flexDirection: 'row', width: DeviceWidth, marginTop: 64}}>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 24, color: 'white', fontWeight: '100', textAlign: 'center'}} numberOfLines={1}>{this.props.match.playerOne}</Text>
                                    <Text style={{fontSize: 44, color: 'white', fontWeight: '100', textAlign: 'center'}}>{_.last(this.props.match.scores).p1GamesWon}</Text>
                                </View>
                                <View style={{flex: 0.33, alignItems: 'center', justifyContent: 'center', marginTop: 26}}>
                                    <View>
                                        <Text style={{color: '#cccccc', fontSize: 10, fontWeight: 200}}>
                                            11/3, 9/11, 11/9, 12/10
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={{color: '#cccccc', fontSize: 10, fontWeight: 200}}>
                                            Match duration { }
                                            {moment(_.last(this.props.match.scores).timeStamp).diff( this.props.match.startTime, 'minutes')}
                                            { } minutes
                                        </Text>
                                    </View>
                                </View>
                                <View style={{flex: 1}}>
                                    <Text style={{fontSize: 24, color: 'white', fontWeight: '100', textAlign: 'center'}} numberOfLines={1}>{this.props.match.playerTwo}</Text>
                                    <Text style={{fontSize: 44, color: 'white', fontWeight: '100', textAlign: 'center'}}>{_.last(this.props.match.scores).p2GamesWon}</Text>
                                </View>
                            </View>

                        </BlurView>
                    </Image>

                    <ScrollView style={{flex: 1, top: 152, backgroundColor: '#eeeeee'}}>

                        <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'center', padding: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p1lets}
                                </Text>
                            </View>
                            <View style={{flex: 0.45}}>
                                <Text style={{textAlign: 'center', fontSize: 12}}>
                                    Lets
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p2lets}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: '#e7e7e7'}}>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p1nolets}
                                </Text>
                            </View>
                            <View style={{flex: 0.45}}>
                                <Text style={{textAlign: 'center', fontSize: 12}}>
                                    No lets
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p2nolets}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'center', padding: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p1strokes}
                                </Text>
                            </View>
                            <View style={{flex: 0.45}}>
                                <Text style={{textAlign: 'center', fontSize: 12}}>
                                    Strokes
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p2strokes}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: '#e7e7e7'}}>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p1winners}
                                </Text>
                            </View>
                            <View style={{flex: 0.45}}>
                                <Text style={{textAlign: 'center', fontSize: 12}}>
                                    Winners
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p2winners}
                                </Text>
                            </View>
                        </View>

                        <View style={{flex: 1, flexDirection: 'row', borderBottomColor: '#cccccc', borderBottomWidth: 1 / PixelRatio.get(), alignItems: 'center', justifyContent: 'center', padding: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p1errors}
                                </Text>
                            </View>
                            <View style={{flex: 0.45}}>
                                <Text style={{textAlign: 'center', fontSize: 12}}>
                                    Errors
                                </Text>
                            </View>
                            <View style={{flex: 1}}>
                                <Text style={{textAlign: 'center', fontSize: 16}}>
                                    {this.state.p2errors}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    });


  module.exports = MatchSummaryView;

})();
