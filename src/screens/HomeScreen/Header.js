import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Button,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TouchableNativeFeedback,
} from 'react-native';
import React, {
  useState,
  useEffect,
  Component,
  createContext,
  useCallback,
  memo,
} from 'react';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { LinearGradient } from 'expo-linear-gradient';
import AppLoading from 'expo-app-loading';
import Slideshow from 'react-native-image-slider-show';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import Images from '../../constants/Images';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { Easing } from 'react-native-reanimated';
import {
  getAllGenres,
  getAllNational,
  getAllYear,
} from '../../services/MovieService';

const { height, width } = Dimensions.get('window');

const Header = ({
  navigation,
  // isVisibleYears,
  // changeYearsVisbility,
  // isVisibleGenres,
  // changeGenresVisbility,
  // dataYears,
  // dataCountries,
  // chooseGenre,
  // dataGenres,
  // activeGenre,
}) => {
  const [isCountrySelected, setIsCountrySelected] = useState(false);
  const [dataGenres, setDataGenres] = useState([]);
  const [dataYears, setDataYears] = useState([]);
  const [dataCountries, setDataCountries] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [isVisibleGenres, setIsVisibleGenres] = useState(false);
  const [isVisibleYears, setIsVisibleYears] = useState(false);

  useEffect(() => {
    Promise.all([getAllGenres(), getAllYear(), getAllNational()])
      .then((res) => {
        setDataGenres(res[0].data);
        setDataYears(res[1].data);
        setDataCountries(res[2].data);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          position: 'absolute',
          left: 0,
          right: 0,
          paddingTop: Constants.statusBarHeight + 5,
          zIndex: 2,
        }}
      >
        <LinearGradient
          colors={['rgba(217, 217, 217, 1)', 'rgba(0, 0, 0, 0)']}
          start={[1, 0]}
          end={[1, 1]}
          style={{
            width: width,
            height: 90,
            position: 'absolute',
            top: 0,
            backgroundColor: Colors.BLACK,
            opacity: 0.2,
          }}
        />
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image
            source={Images.NETFLIX}
            style={{
              transform: [{ scale: 1.1 }],
            }}
          />
        </TouchableOpacity>
        {/* <DropDownPicker
              open={open}
              value={null}
              items={dataGenres}
              multiple={true}
              setOpen={this.setOpen}
              setValue={this.setValue}
              setItems={this.setItems}
              key={(item, index) => index.toString()}
            /> */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SafeAreaView>
            <TouchableOpacity
              style={{ marginRight: 5, padding: 5 }}
              onPress={() => {
                setIsVisibleYears(!isVisibleYears);
                setIsCountrySelected(false);
              }}
            >
              <Ionicons name="filter" size={20} />
            </TouchableOpacity>

            <Modal
              transparent={true}
              animationType="fade"
              visible={isVisibleYears}
              onRequestClose={() => setIsVisibleYears(false)}
            >
              <TouchableOpacity
                onPress={() => setIsVisibleYears(false)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: width / 1.1,
                    height: height / 1.7,
                    borderRadius: 10,
                    backgroundColor: Colors.BLACK,
                    paddingHorizontal: 20,
                    top: -50,
                    alignSelf: 'center',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setIsCountrySelected(false);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          paddingVertical: 10,
                          textAlign: 'center',
                          color: isCountrySelected
                            ? Colors.LIGHT_GRAY
                            : Colors.BLACK,
                        }}
                      >
                        Years
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setIsCountrySelected(true);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          paddingVertical: 10,
                          textAlign: 'center',
                          marginLeft: 10,
                          color: isCountrySelected
                            ? Colors.BLACK
                            : Colors.LIGHT_GRAY,
                        }}
                      >
                        Countries
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* <ScrollView>
                    {years.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          navigation.navigate('movieShow', {
                            currentMovies: 'year',
                            title: item?.name,
                          });
                          changeYearsVisbility(false);
                        }}
                        activeOpacity={0.5}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: Fonts.REGULAR,
                            paddingVertical: 15,
                            borderTopColor: Colors.LIGHT_GRAY,
                            borderWidth: 0.2,
                          }}
                        >
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView> */}

                  <FlatList
                    data={!isCountrySelected ? dataYears : dataCountries}
                    showsHorizontalScrollIndicator={false}
                    onEndReachedThreshold={0.5}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('movieShow', {
                            currentMovies: isCountrySelected
                              ? 'country'
                              : 'year',
                            title: isCountrySelected
                              ? item?.english_name
                              : item?.name,
                          });
                          setIsVisibleYears(false);
                        }}
                        activeOpacity={0.5}
                        style={{
                          borderTopColor: Colors.LIGHT_GRAY,
                          borderWidth: 0.2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: Fonts.REGULAR,
                            paddingVertical: 15,
                            marginLeft: 15,
                          }}
                        >
                          {isCountrySelected ? item?.english_name : item?.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </SafeAreaView>
          <SafeAreaView>
            <TouchableOpacity
              style={{
                padding: 5,
              }}
              onPress={() => setIsVisibleGenres(!isVisibleGenres)}
              activeOpacity={0.5}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: Fonts.REGULAR,
                    marginRight: 5,
                  }}
                >
                  {activeGenre}
                </Text>
                <Ionicons
                  name={isVisibleGenres ? 'caret-up' : 'caret-down'}
                  size={16}
                  color="black"
                />
              </View>
            </TouchableOpacity>
            <Modal
              transparent={true}
              animationType="fade"
              visible={isVisibleGenres}
              onRequestClose={() => setIsVisibleGenres(false)}
            >
              <TouchableOpacity
                onPress={() => setIsVisibleGenres(false)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    width: width / 1.1,
                    height: height / 1.7,
                    borderRadius: 10,
                    backgroundColor: Colors.BLACK,
                    paddingHorizontal: 20,
                    top: -50,
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      paddingVertical: 10,
                      textAlign: 'center',
                    }}
                  >
                    Genres
                  </Text>
                  <ScrollView>
                    {dataGenres.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          //   handleRefresh(item?.name);
                          // setChooseGenre(item?.name);
                          // setActiveGenre(item?.name);
                          navigation.navigate('movieShow', {
                            currentMovies: 'genres',
                            title: item?.name,
                          });
                          setIsVisibleGenres(false);
                        }}
                        activeOpacity={0.5}
                        style={{
                          borderTopColor: Colors.LIGHT_GRAY,
                          borderWidth: 0.2,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: Fonts.REGULAR,
                            paddingVertical: 15,
                            color: Colors.WHITE,
                            marginLeft: 15,
                          }}
                        >
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(Header);

const styles = StyleSheet.create({});
