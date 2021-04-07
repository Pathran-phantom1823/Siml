import React, { Component } from 'react';
import Style from './Style.js';
import { connect } from 'react-redux';
import { View, Image, Text, TouchableHighlight, ScrollView} from 'react-native';
import { Routes, Color, Helper, BasicStyles } from 'common';
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Landing extends Component{
  constructor(props){
    super(props);
  }
  render() {
    const { theme } = this.props.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={{
          height: height,
          flex: 1
        }}>
          <LinearGradient
              colors={[theme ? theme.primary : Color.primary, theme ? theme.secondary : Color.secondary, Color.warning]}
              locations={[0,0.5,1]} start={{ x: 2, y: 0 }} end={{ x: 1, y: 1 }}
              style={{
                height: height
              }}
            >


            <View style={{
              height: 300,
              width: width,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 100}}>
            <Image source={require('assets/new2.png')} style={{width: '90%', height: '90%'}}/>
            </View>


            <View style={{
              width: '100%',
              alignItems: 'center'
            }}>

              <Text style={{
                color:'white', 
                fontStyle: 'italic',
                fontFamily: 'roboto',
                fontSize: 18}}>
                CHOOSING TOGETHER.
              </Text>
              <Text style={{
                color:'white',
                fontStyle: 'italic',
                fontFamily: 'roboto',
                fontSize: 18}}>
                ENJOYING TOGETHER.
              </Text>
            </View>


            <View>
              <TouchableHighlight
                style={[BasicStyles.btnRound, {
                    backgroundColor: Color.warning,
                    marginTop: '20%',
                    width: '50%'
                }]}
                onPress={()=> this.props.navigation.navigate('registerStack')}
                underlayColor={Color.gray}>
                <Text style={BasicStyles.textWhite}>
                    Get Started!
                </Text>
              </TouchableHighlight>
            </View>



            <View style={{
              width: '100%',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: BasicStyles.standardFontSize
              }}>Already have an account?
                <Text
                  style={{
                    textDecorationLine:'underline',
                    fontWeight:'bold'
                  }}
                  onPress={()=> this.props.navigation.navigate('loginStack')}>
                    Login
                </Text>
              </Text>
            </View>


          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
    const { actions } = require('@redux');
    return {
      setTheme: (theme) => dispatch(actions.setTheme(theme)),
    };
  };
export default connect(
    mapStateToProps,
    mapDispatchToProps)(Landing);