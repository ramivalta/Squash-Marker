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
        PanResponder,
        LayoutAnimation,
        PixelRatio,
        AsyncStorage,
        Image
    } = React;

    var NavigationBar = require('react-native-navbar');
    var Icon = require('react-native-icons');
    var RNS = require('react-native-store');


    var DeviceHeight = require('Dimensions').get('window').height;
    var DeviceWidth = require('Dimensions').get('window').width;

    var LayoutAnimationConfigs = require('./LayoutAnimations');

    /*RNS.table("matches").then(function(matches) {
        for (var i = 0; i < 1500; i++) {
            matches.removeById(i);
        }
    });*/

    var MatchSetupView = require('./matchSetupView');
    var MatchView = require('./matchView');


    console.log("DEVICE WIDTH", DeviceWidth);
    console.log("DEVICE HEIGHT", DeviceHeight);

    var MainView = React.createClass({
        getInitialState: function() {
            return {
                //matches: this.props.matches || [],
                accessToken: this.props.accessToken,

                /*data: new ListView.DataSource({
                    rowHasChanged: (row1, row2) => row1 !== row2,
                })*/
                //data: []
            };
        },

        shouldComponentUpdate: function(nextProps, nextState) {
            if (this.props !== nextProps || this.state !== nextState) {
                console.log("MAINVIEW COMPONENT SHOULD UPDATE");
                return true;
            }
            else return false;
        },

        componentWillReceiveProps: function(newprops) {
            console.log("WILL RECEIVE PROPS");
            /*if (newprops.matches) {
                this.setState({
                    matches: newprops.matches
                });
            }*/
        },

        componentDidMount: function() {
            console.log("MAIN VIEW MOUNTED");
            console.log(this.props.matches);
        },

        componentWillMount: function() {
            var self = this;
            console.log(this.props);

            this._previousLeft = 0;
            this._pannedElement = null;

            this._panGesture = PanResponder.create({

                // Ask to be the responder:
                onStartShouldSetPanResponder: (evt, gestureState) => true,
                onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
                onMoveShouldSetPanResponder: (evt, gestureState) => true,
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

                onPanResponderGrant: (evt, gestureState) => {
                    // The guesture has started. Show visual feedback so the user knows
                    // what is happening!


                    // gestureState.{x,y}0 will be set to zero now
                },
                onPanResponderMove: (evt, gestureState) => {
                    this._pannedElement = this._pannedTemp;
                    var el = this._pannedElement.row;
                    var delel = this._pannedElement.delbutton;

                    if (gestureState.dx > 0 || gestureState.dx < - 120) return;

                    if (gestureState.dx > -60) {
                        var m = 1 * ((Math.abs(gestureState.dx) * 1.6666667) / 100);
                        //console.log(m);

                        delel.setNativeProps({
                            opacity: m,
                            right: 60 * ((1 - m) * -1),
                        });
                    } else {
                        delel.setNativeProps({opacity: 1, right: 0});
                    }

                    el.setNativeProps({left: gestureState.dx});

                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
                },
                onPanResponderTerminationRequest: (evt, gestureState) => false,
                onPanResponderRelease: (evt, gestureState) => {
                    if (!this._pannedElement) return;

                    var self = this;

                    var el = this._pannedElement.row;
                    var delel = this._pannedElement.delbutton;
                    var config;

                    if (gestureState.dx < -30) {
                        el.setNativeProps({left: -60});
                        delel.setNativeProps({
                            opacity: 1,
                            right: 0
                        });
                    } else {
                        el.setNativeProps({left: 0});
                        delel.setNativeProps({
                            /*opacity: m,
                            right: 60 * ((1 - m) * -1),*/
                            right: -75
                        });

                        //delel.setNativeProps({right: -45});
                        this._pannedElement = null;
                        this._pannedTemp = null;
                    }

                    config = LayoutAnimationConfigs[1];
                    LayoutAnimation.configureNext(config);

                    // The user has released all touches while this view is the
                    // responder. This typically means a gesture has succeeded
                },
                onPanResponderTerminate: (evt, gestureState) => {
                    if (!this._pannedElement) {
                        return;
                    }

                    var self = this;
                    var el = this._pannedElement.row;
                    var delel = this._pannedElement.delbutton;
                    var config;

                    if (gestureState.dx < -30) {
                        el.setNativeProps({left: -60});
                        delel.setNativeProps({
                            opacity: 1,
                            right: 0
                        });
                    } else {
                        el.setNativeProps({left: 0});
                        delel.setNativeProps({
                            //opacity: m,
                            //right: 60 * ((1 - m) * -1),
                            right: -75
                        });

                        this._pannedElement = null;
                        this._pannedTemp = null;
                    }

                    config = LayoutAnimationConfigs[1];

                    LayoutAnimation.configureNext(config);

                    // Another component has become the responder, so this gesture
                    // should be cancelled

                },
            });
        },

        handleTouchStart: function(id, event, element) {
            var ref = 'ref_' + id;
            //if (!this._pannedElement)
            var panned = {
                parent: this.refs['parent_' + ref],
                row: this.refs[ref],
                delbutton: this.refs['del_' + ref],
                deltext: this.refs['del_text_' + ref],
                target: event.target
            };


            console.log(panned);

            //this._pannedRef = ref;

            //console.log("touch event ", id, event.target, element);

            if (this._pannedElement) {
                var el = this._pannedElement.row;
                var delel = this._pannedElement.delbutton;
                //var deltext = this._pannedElement.deltext;
                var config = LayoutAnimationConfigs[1];

                LayoutAnimation.configureNext(config);
                delel.setNativeProps({opacity: 0.75, right: -75});
                el.setNativeProps({left: 0});
                //deltext.setNativeProps({opacity: 0});

                //delel.setNativeProps({opacity: 0.5, right: -60});
                /*setTimeout(function() {
                    delel.setNativeProps({opacity: 0, right: 0});
                }, 350);*/
            }

            this._pannedTemp = panned;
        },

        handleDelete: function(id) {
            if (!this._pannedElement) return;
            if (!this._pannedElement.row) return;

            var self = this;
            console.log("DEL ID " + id);

            var outerrow =  this._pannedElement.parent;
            var el =        this._pannedElement.row;
            var del =       this._pannedElement.delbutton;
            var deltext =   this._pannedElement.deltext;

            outerrow.setNativeProps({
              position: 'absolute',
              scaleY: 0.001,
              height: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderBottomWidth: 0
            });

            del.setNativeProps({
              position: 'absolute',
              height: 0,
              width: 60,
              right: 0,
              top: 0,
              scaleY: 0.0001,
              //translateY: -48
            });

            deltext.setNativeProps({
              opacity: 0.0001
            });

            var config = LayoutAnimationConfigs[1];
            LayoutAnimation.configureNext(config);

            /*var arr = this.state.data;

            var newarr = arr.filter(function(i) {
                if (i.id !== id)
                    return i;
            });*/

            setTimeout(function() {
                /*self.setState({
                    data: newarr
                });*/
                self.deleteMatch(id);
            }, 400);

            this._pannedElement = null;
        },

        deleteMatch: function(id) {
            this.props.deleteMatch(id);
        },

        handleScroll: function(event) {
            //event.defaultPrevented = true;
            //console.log(event);
        },

        render: function() {
            var self = this;

            return (
                <ScrollView style={styles.content} onScroll={this.handleScroll} scrollEventThrottle={128}>

                  {this.props.matches.length === 0 &&
                    <View style={{flex: 1, height: 24, alignItems: 'center', justifyContent: 'center', marginTop: DeviceHeight / 2 - 64 - 12 }}>
                      <Text style={{fontSize: 20, color: '#666666'}}>
                        Welcome to Squash Marker
                      </Text>
                    </View>
                  }

                  {this.props.matches.map(function(data) {
                      return ([
                          <View>
                              <View style={styles.outerRow} {...self._panGesture.panHandlers} onTouchStart={self.handleTouchStart.bind(null, data.id)} key={'key_' + data.id} ref={'parent_ref_' + data.id}>
                                  <View style={styles.row} ref={'ref_' + data.id} pointerEvents={'none'}>
                                      {!data.matchOver &&
                                          <Icon
                                              name='ion|ios-infinite'
                                              size={24}
                                              color='#cccccc'
                                              style={{width: 32, height: 32}}
                                          />
                                      }
                                      {data.matchOver &&
                                          <Icon
                                              name='ion|ios-checkmark-empty'
                                              size={24}
                                              color='#cccccc'
                                              style={{width: 32, height: 32}}
                                          />
                                      }

                                      <Text style={styles.timeStamp} onPress={() => console.log(data)}>
                                          {data.startTime && moment(data.startTime).calendar()}
                                      </Text>
                                      <Text style={styles.playerOne} numberOfLines={1}>
                                          {data.playerOne}
                                      </Text>
                                      <Text style={styles.score} numberOfLines={1}>
                                          {'  '}
                                          {data.scores[data.scores.length -1].p1GamesWon}
                                          {' - '}
                                          {data.scores[data.scores.length -1].p2GamesWon}
                                          {'  '}
                                      </Text>
                                      <Text style={styles.playerTwo} numberOfLines={1}>
                                          {data.playerTwo}
                                      </Text>
                                      <Icon
                                          name='ion|chevron-right'
                                          size={24}
                                          color='#555555'
                                          style={{marginRight: 8, width: 24, height: 24}}>
                                      </Icon>
                                  </View>
                              </View>

                              <View style={styles.delbutton} key={'del_' + data.id} ref={'del_ref_' + data.id}>
                                  <Text style={styles.deltext} onPress={self.handleDelete.bind(null, data.id)} ref={'del_text_ref_' + data.id}>
                                      Delete
                                  </Text>
                              </View>
                          </View>
                      ]);
                  })}
                </ScrollView>
            );
        }
    });



    var SquashMarker = React.createClass({
        getInitialState: function() {
            return {
                matches: [],
                accessToken: 'cmF0YXZhbHRAZ21haWwuY29tdW5kZWZpbmVk',
                ready: false
            };
        },

        componentDidMount: function() {

        },

        deleteMatch: function(id) {
            var self = this;
            fetch('http://10.0.1.200:1337/match/delete', {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    accessToken: self.state.accessToken
                })
            }).then(function(response) {
                console.log(response);
            }).catch(function(err) {
                console.log(err);
            });

            RNS.table('matches').then(function(matches) {
                var data = { markedForDeletion: true };
                var removed = matches.where({
                    id: id
                }).update(data);
                console.log(removed);
            });

            var m = this.state.matches.filter(function(i) {
                return i.id !== id;
            });

            var sorted = _.sortBy(m, function(i) {
                return i.startTime;
            }).reverse();

            this.setState({
                matches: sorted
            });
        },

        getMatches: function(cb) {
            console.log("IN GE TMATCHES");
            var self = this;
            var promise = RNS.table('matches').then(function(matches) {
                var ms = matches.find() || [];
                console.log("MATCHES IN RNS", ms);
                var m = ms.filter(function(i) {
                    return !i.markedForDeletion;
                });

                var sorted = _.sortBy(m, function(i) {
                    return i.startTime;
                }).reverse();

                /*var interval = setTimeout(function() {
                    if (self.isMounted()) {
                        self.setState({
                            matches: sorted
                        });
                        self.forceUpdate();
                        clearInterval(interval);
                    } else {
                        console.log("ROOT NOT MOUNTED, RETRYING UNTIL IT IS");
                    }
                }, 250);*/

                /*this.setState({
                    matches: sorted
                });*/

                /*self.setState({
                    matches: matches
                });*/

                if (cb) return cb(sorted);
                else return sorted;
            }).catch(function(err) {
                console.log(err);
                return [];
            });
            return promise;
        },

        componentWillMount: function() {
            var self = this;
            var token = 'cmF0YXZhbHRAZ21haWwuY29tdW5kZWZpbmVk';

            //this.setupMainView();

            //console.log("THIS GETMATHCES", this.getMatches);

            this._matchSetupView = {
                _id: 'setup',
                component: MatchSetupView,
                title: 'Match Setup',
                backButtonTitle: 'Back',
                passProps: {
                    renderScene: this.renderScene,
                },
                navigationBar: <NavigationBar
                    title = 'Match Setup'
                />

                //onRightButtonPress: this.handleNavigation.bind(null, self._matchView),
                //passProps: {renderScene: this.renderScene},
            };

            function status(response) {
                if (response.status >= 200 && response.status < 300) {
                    return Promise.resolve(response);
                } else {
                    return Promise.reject(new Error(response.statusText));
                }
            }

            function json(response) {
                return response.json();
            }

            //('http://10.0.1.200:1337/match/find/?addedBy

            var postdata = JSON.stringify({
                accessToken: token
            });

            //return true;

            fetch('http://10.0.1.200:1337/match/find/?addedBy=ratavalt@gmail.com', {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: postdata
                //body: {accessToken : token }
            }).then(status)

            .then(json)

            .then(function(json) {
                //console.log(JSON.parse(data._bodyText));
                //var d = JSON.parse(data._bodyText);
                var d = json;

                var matches = d.filter(function(i) {
                    return !i.markedForDeletion;
                });

                console.log(matches);

                /*self.setState({
                    //matches: matches, // TODO: mergee serveri ja lokaalidata
                    accessToken: token
                });*/

            });/*.catch(function(err) {
                console.log(err);
            });*/


            this.getMatches().then(function(matches) {
                console.log("MATCHES", matches);
                self.setState({
                    matches: matches,
                    ready: true
                });
            });
        },

        renderScene: function(route, navigator) {
            var self = this;
            console.log("IN RENDER SCENE");
            var navi = this.refs.nav;

            if (!navigator) navigator = navi;

            var Component = route.component;
            var navBar = route.navigationBar;

            if (route._id === 'main') {
              navBar.props.hidePrev = true;
            }

            console.log("in return view");
            if (navBar) {
                console.log("HAD NAV BAR");
                navBar  = React.addons.cloneWithProps(navBar, {
                    navigator: navigator,
                    route: route
                });
            }
            return (
                <View style={styles.navbar}>
                    {navBar}
                    <Component navigator={navigator} route={route} {...route.passProps} />
                </View>
            );
        },

        componentWillReceiveProps: function(nextProps) {
            console.log("ROOT ROMPONENT WILL REVEIVE PROPAS");
            console.log("NEXT PROPS", nextProps);
        },

        handleFocus: function(route) {
            var self = this;
            console.log("DID FOCUS", route);
        },

        handleRef: function(ref, index) {
            console.log("ON ITEM REF", ref, index);
        },

        componentDidUpdate: function() {
            var config = LayoutAnimationConfigs[1];
            LayoutAnimation.configureNext(config);
        },

        render: function() {
            var self = this;
            if (this.state.ready)
                return (
                    <Navigator
                        ref='nav'
                        //itemWrapperStyle={{backgroundColor: '#eeeeee'}}
                        style={{flex: 1, backgroundColor: '#ffffff'}}
                        //navigationBarHidden={this.state.hideNavbar}
                        configureScene={function(route) {
                            if (route._id === 'matchView')
                                return Navigator.SceneConfigs.FloatFromBottom;
                            else
                                return Navigator.SceneConfigs.FloatFromRight;
                        }}
                        renderScene={this.renderScene}
                        initialRoute={{
                            _id: 'main',
                            component: MainView,
                            passProps: {
                                matches: this.state.matches,
                                accessToken: this.state.accessToken,
                                renderScene: this.renderScene,
                                deleteMatch: this.deleteMatch
                            },
                            navigationBar: <NavigationBar
                                title = 'Squash Marker'
                                nextTitle = 'New Match'
                                onNext = {() => this.renderScene(this._matchSetupView) && this.refs.nav.push(this._matchSetupView)}
                            />
                        }}
                        onWillFocus={this.handleFocus}
                        onItemRef={this.handleRef}
                    />
                );
            else return (
                <View style={{flex: 1, backgroundColor: '#eeeeee'}}>
                    <View style={{height: 64, borderBottomWidth: 1 / PixelRatio.get(), borderBottomColor: '#cccccc', justifyContent: 'center', backgroundColor: '#f7f7f7'}}>
                        {/*<Text style={{textAlign: 'center', fontSize: 17, fontWeight: '500', marginBottom: 6, marginRight: 2}}>
                            Squash Marker
                        </Text>*/}
                    </View>
                </View>
            );
        }
    });

    var serveButtonWidth = DeviceWidth / 2 - 40;

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

        navbar: {
            flex: 1,
        },

        delbutton: {
            backgroundColor: 'red',
            position: 'absolute',
            top: 0,
            opacity: 0.1,
            width: 60,
            height: 60,
            right: -60,
            justifyContent: 'center',
            alignItems: 'center'
        },

        deltext: {
            //backgroundColor: 'red',
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            //height: 60,
            //width: 60,
            //lineHeight: 30
            //position: 'relative',
            //top: 20,
        },

        outerRow: {
            flexDirection: 'row',
            flex: 1,
            backgroundColor: '#ffffff',
            height: 60,
            borderBottomWidth: 1 / PixelRatio.get(),
            borderTopWidth: 1 / PixelRatio.get(),
            marginTop: (1 / PixelRatio.get()) * -1,
            borderColor: '#cccccc',
            //overflow: 'hidden'
        },

        row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 5,
            flex: 1,
            justifyContent: 'center',
            left: 0,
            backgroundColor: '#fefefe',
            overflow: 'hidden',
        },
        bold: {
            fontWeight: 'bold',
        },
        timeStamp: {
            fontSize: 10,
            textAlign: 'left',
            color: '#888888',
            position: 'absolute',
            top: 2,
            left: 4,
        },
        welcome: {
            fontSize: 18,
            textAlign: 'center',
            margin: 10,
            fontFamily: 'Helvetica Neue'
        },
        instructions: {
            textAlign: 'center',
            color: '#333333',
        },
        score: {
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            fontSize: 14,
            lineHeight: 14,
            height: 14
        },

        playerOne: {
            fontWeight: 'bold',
            flex: 2.5,
            textAlign: 'center',
            containerBackgroundColor: 'transparent',
            fontSize: 14,
            //marginLeft: 26,
            height: 14,
            lineHeight: 14,
        },

        playerTwo: {
            fontWeight: 'bold',
            flex: 2.5,
            textAlign: 'center',
            containerBackgroundColor: 'transparent',
            fontSize: 14,
            //marginRight: 0,
            height: 14,
            lineHeight: 14,
        },

    });

    AppRegistry.registerComponent('SquashMarker', () => SquashMarker);

})();
