/* jslint esnext:true */

(function() {
  'use strict';

  var React = require('react-native');
  var {
      LayoutAnimation,
  } = React;

  var animations = {
      layout: {
          spring: {
              duration: 750,
              create: {
                  duration: 300,
                  type: LayoutAnimation.Types.easeInEaseOut,
                  property: LayoutAnimation.Properties.opacity,
              },
              update: {
                  type: LayoutAnimation.Types.spring,
                  springDamping: 400,
              },
          },
          gentleSpring: {
              duration: 450,
              create: {
                  duration: 450,
                  type: LayoutAnimation.Types.spring,
                  springDamping: 0.75,
                  property: LayoutAnimation.Properties.opacity
              },
              update: {
                  duration: 450,
                  type: LayoutAnimation.Types.spring,
                  springDamping: 0.75,
                  property: LayoutAnimation.Properties.opacity
              }
          },
          quickSpring: {
              duration: 250,
              create: {
                  duration: 250,
                  type: LayoutAnimation.Types.spring,
                  springDamping: 0.75,
                  property: LayoutAnimation.Properties.opacity
              },
              update: {
                  duration: 250,
                  type: LayoutAnimation.Types.spring,
                  springDamping: 0.75,
                  property: LayoutAnimation.Properties.opacity
              }
          },
          easeInEaseOut: {
              duration: 550,
              create: {
                  duration: 550,
                  type: LayoutAnimation.Types.easeInEaseOut,
                  property: LayoutAnimation.Properties.opacity
              },
              update: {
                  type: LayoutAnimation.Types.easeInEaseOut,
                  property: LayoutAnimation.Properties.opacity,
                  duration: 550
              },
          },
      },
  };

  var configs = [
      animations.layout.spring,
      animations.layout.gentleSpring,
      animations.layout.quickSpring,
      animations.layout.easeInEaseOut
  ];

  module.exports = configs;
})();
