import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';;
import { Card, ListItem, Button, Icon } from 'react-native-elements'
import { Color, Routes } from 'common';
import { Dimensions } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisH, faUser, faCheckCircle, fasTimesCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Config from 'src/config.js';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import Api from 'services/api/index.js';

const width = Math.round(Dimensions.get('window').width)

class CardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  sendRequest = (el) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to add this person?',
      [
        {text: 'Cancel'},
        {text: 'Add', onPress: () => {
          let parameter = {
            account_id: this.props.state.user.id,
            to_email: el.email,
            content: "This is an invitation for you to join my connections."
          }
          this.setState({ isLoading: true });
          Api.request(Routes.circleCreate, parameter, response => {
            console.log(response, 'response');
            this.setState({ isLoading: false })
            if(response.data !== null) {
              el.is_added = true
            }
          });
        }, style: 'cancel'}
      ],
      { cancelable: false }
    )
  }

  storePeople = (item) => {
    item['added'] = true
    const { setTempMembers } = this.props;
    let temp = this.props.state.tempMembers;
    temp.push(item);
    setTempMembers(temp);
  }

  inviteToGroup = () => {
    let parameter = {
      id: id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.messengerMembersCreate, parameter, response => {
      this.setState({ isLoading: false })
      if(response.data !== null) {
        this.props.navigation.navigate('messagesStack', {
          data: this.props.navigation?.state?.params?.data
        });
      }
    });
  }

  updateStatus = (item, status) => {
    let parameter = {
      id: item.id,
      status: status
    }
    this.setState({ isLoading: true });
    Api.request(Routes.circleUpdate, parameter, response => {
      this.setState({ isLoading: false })
      this.props.retrieve();
    });
  }

  deleteConnection = (id) => {
    let parameter = {
      id: id
    }
    this.setState({ isLoading: true });
    Api.request(Routes.circleDelete, parameter, response => {
      this.setState({ isLoading: false })
      console.log(response, 'l', parameter);
      this.props.retrieve();
    });
  }

  remove = (id) => {
    const { setTempMembers } = this.props;
    let temp = this.props.state.tempMembers;
    temp.map((item, index) => {
      if (id === item.account.id) {
        item['added'] = false
        temp.splice(index, 1)
        setTempMembers(temp);
      }
    })

  }

  render() {
    return (
      <View>
        {this.state.isLoading ? <Spinner mode="overlay" /> : null}
        {
          this.props.data.length > 0 && this.props.data.map((el, idx) => {
            return (
              <View>
                {this.props.search ?
                  <View>
                    {this.props.search && (this.props.search !== null || this.props.search !== '') && ((el.account?.information?.first_name + ' ' + el.account?.information?.last_name).includes(this.props.search) || el.account?.username.includes(this.props.search)) && <TouchableOpacity onPress={() => { this.props.navigation.navigate('viewProfileStack', { user: el, level: this.props.level }) }}>
                      <ListItem key={idx} style={{ width: width }}>
                        {el.account?.profile?.url ? <Image
                          style={Style.circleImage}
                          source={{ uri: Config.BACKEND_URL + el.account?.profile?.url }}
                        /> :
                          <View style={{
                            borderColor: Color.primary,
                            width: 75,
                            height: 75,
                            borderRadius: 50,
                            borderColor: Color.primary,
                            borderWidth: 3,
                            overflow: "hidden",
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: 8
                          }}><FontAwesomeIcon
                              icon={faUser}
                              size={53}
                              color={Color.primary}
                            /></View>}
                        <View>
                          <View style={{ flexDirection: 'row' }}>
                            <View>
                              <Text style={{ fontWeight: 'bold' }}>{el.account?.information?.first_name ? el.account?.information?.first_name + ' ' + el.account?.information?.last_name : el.account?.username}</Text>
                              <Text style={{ fontStyle: 'italic' }}>{el.account?.information?.address || 'No address provided'}</Text>
                              <Text style={{ color: 'gray', fontSize: 10, marginBottom: 5 }}>{el.numberOfConnection} similar connections</Text>
                              {
                                this.props.hasAction && (
                                  <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity
                                      onPress={() => this.updateStatus(el, 'accepted')}
                                      style={{
                                        ...Style.actionBtn,
                                        backgroundColor: Color.primary
                                      }}
                                    >
                                      <Text style={{ color: 'white' }}>Confirm</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => this.updateStatus(el, 'declined')}
                                      style={{
                                        ...Style.actionBtn,
                                        backgroundColor: 'gray'
                                      }}
                                    >
                                      <Text style={{ color: 'white' }}>Delete</Text>
                                    </TouchableOpacity>
                                  </View>
                                )
                              }
                            </View>
                            {el.added && el.added === true || this.props.data.length === this.props.state.tempMembers.length ?
                              <View style={{
                                position: 'absolute',
                                left: (width - 200),
                                flexDirection: 'row'
                              }}>
                                <TouchableOpacity onPress={() => { this.remove(el.account?.id) }}>
                                  <Text style={{ color: Color.danger }}>Remove</Text>
                                </TouchableOpacity>
                              </View>
                              :
                              <View style={{
                                position: 'absolute',
                                left: (width - 270),
                              }}>
                                {
                                  this.props.actionType == 'text' ? (
                                    <Text style={{ marginLeft: 10 }}>{el.lastLogin}</Text>
                                  ) : (
                                    <TouchableOpacity
                                      onPress={() => this.props.invite ? this.storePeople(el) : this.props.actionContent == 'icon' || el.is_added === true ? this.deleteConnection(el.id) : this.sendRequest(el)}
                                      style={[Style.button, { backgroundColor: this.props.actionContent == 'icon' || el.is_added === true ? 'gray' : Color.primary }]}
                                    >
                                      {
                                        this.props.actionContent == 'icon' ? (
                                          <Text style={{ color: 'white' }}>Remove</Text>
                                        ) : (
                                          <Text style={{ color: 'white' }}>{el.is_added ? 'Cancel' : 'Add'}</Text>
                                        )
                                      }
                                    </TouchableOpacity>
                                  )
                                }
                              </View>
                            }
                          </View>
                        </View>
                      </ListItem>
                      {/* </Card> */}
                    </TouchableOpacity>}</View> :
                  <TouchableOpacity onPress={() => { this.props.navigation.navigate('viewProfileStack', { user: el, level: this.props.level }) }}>
                    <ListItem key={idx} style={{ width: width }}>
                      {el.account?.profile?.url ? <Image
                        style={Style.circleImage}
                        source={{ uri: Config.BACKEND_URL + el.account?.profile?.url }}
                      /> :
                        <View style={{
                          borderColor: Color.primary,
                          width: 75,
                          height: 75,
                          borderRadius: 50,
                          borderColor: Color.primary,
                          borderWidth: 3,
                          overflow: "hidden",
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingBottom: 8
                        }}><FontAwesomeIcon
                            icon={faUser}
                            size={53}
                            color={Color.primary}
                          /></View>}
                      <View>
                        <View style={{ flexDirection: 'row' }}>
                          <View>
                            <Text style={{ fontWeight: 'bold' }}>{el.account?.information?.first_name ? el.account?.information?.first_name + ' ' + el.account?.information?.last_name : el.account?.username}</Text>
                            <Text style={{ fontStyle: 'italic' }}>{el.account?.information?.address || 'No address provided'}</Text>
                            <Text style={{ color: 'gray', fontSize: 10, marginBottom: 5 }}>{el.numberOfConnection} similar connections</Text>
                            {
                              this.props.hasAction && (
                                <View style={{ flexDirection: 'row' }}>
                                  <TouchableOpacity
                                    onPress={() => this.updateStatus(el, 'accepted')}
                                    style={{
                                      ...Style.actionBtn,
                                      backgroundColor: Color.primary
                                    }}
                                  >
                                    <Text style={{ color: 'white' }}>Confirm</Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => this.updateStatus(el, 'declined')}
                                    style={{
                                      ...Style.actionBtn,
                                      backgroundColor: 'gray'
                                    }}
                                  >
                                    <Text style={{ color: 'white' }}>Delete</Text>
                                  </TouchableOpacity>
                                </View>
                              )
                            }
                          </View>
                          {el.added && el.added === true || this.props.data.length === this.props.state.tempMembers.length ?
                            <View style={{
                              position: 'absolute',
                              left: (width - 200),
                              flexDirection: 'row'
                            }}>
                              <TouchableOpacity onPress={() => { this.remove(el.account?.id) }}>
                                <Text style={{ color: Color.danger }}>Remove</Text>
                              </TouchableOpacity>
                            </View>
                            :
                            <View style={{
                              position: 'absolute',
                              left: (width - 270),
                            }}>
                              {
                                this.props.actionType == 'text' ? (
                                  <Text style={{ marginLeft: 10 }}>{el.lastLogin}</Text>
                                ) : 
                                <View>
                                  {el.is_added === false && this.props.actionContent !== 'icon' && <TouchableOpacity
                                    onPress={() => this.props.invite ? this.storePeople(el) : this.props.actionContent == 'icon' || el.is_added === true ? this.deleteConnection(el.id) : this.sendRequest(el)}
                                    style={[Style.button, { backgroundColor: this.props.actionContent == 'icon' || el.is_added === true ? 'gray' : Color.primary }]}
                                  >
                                    <Text style={{ color: 'white' }}>{el.is_added ? 'Cancel' : 'Add'}</Text>
                                  </TouchableOpacity>}
                                  {this.props.actionContent === 'icon' && <TouchableOpacity
                                    onPress={() => this.deleteConnection(el.id)}
                                    style={[Style.button, { backgroundColor: this.props.actionContent == 'icon' || el.is_added === true ? 'gray' : Color.primary }]}
                                  >
                                    <Text style={{ color: 'white' }}>Remove</Text>
                                  </TouchableOpacity>}
                                  {this.props.invite === true && <TouchableOpacity
                                    onPress={() => this.storePeople(el)}
                                    style={[Style.button, { backgroundColor: this.props.actionContent == 'icon' || el.is_added === true ? 'gray' : Color.primary }]}
                                  >
                                    <Text style={{ color: 'white' }}>Add</Text>
                                  </TouchableOpacity>}
                                </View>
                              }
                            </View>
                          }
                        </View>
                      </View>
                    </ListItem>
                    {/* </Card> */}
                  </TouchableOpacity>}
              </View>
            )
          })
        }
      </View>
    )
  }
}

const Style = StyleSheet.create({
  ScrollView: {
    flex: 1,
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Color.white,
    zIndex: 0,
    marginBottom: 50
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  standardButton: {
    height: 30,
    backgroundColor: Color.primary,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  actionBtn: {
    height: 30,
    backgroundColor: Color.primary,
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginLeft: 3
  },
  button: {
    width: 80,
    height: 30,
    backgroundColor: Color.primary,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50
  },
  iconBtn: {
    width: 80,
    height: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 80
  },
  circleImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderColor: Color.primary,
    borderWidth: 3,
    overflow: "hidden",
  },
  Text: {
    marginLeft: 20,
    width: 200,
    height: 100
  },
  TextContainer: {
    flex: 1
  },
})

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(CardList);