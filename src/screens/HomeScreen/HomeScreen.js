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
  // Animated,
} from 'react-native';
import React, {
  useState,
  useEffect,
  Component,
  createContext,
  useCallback,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import Colors from '../../constants/Colors';
import GenreCard from '../../components/GenreCard';
import ItemSeparator from '../../components/ItemSeparator';
import Fonts from '../../constants/Fonts';
import MovieCard from '../../components/MovieCard';
import {
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getAllGenres,
  getTrending,
  getPoster,
  getMovieById,
  getList,
  getMoviesByGenresNowPlaying,
  getMoviesByGenresUpComing,
  getMoviesByGenresPopular,
  getMoviesByGenresTopRated,
  getMoviesByYear,
  getAllYear,
  addItemList,
  removeItemList,
  getAllNational,
  getMovieSeriesById,
} from '../../services/MovieService';
import { LinearGradient } from 'expo-linear-gradient';
import AppLoading from 'expo-app-loading';
import Slideshow from 'react-native-image-slider-show';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import axios from 'axios';
import Images from '../../constants/Images';
import Constants from 'expo-constants';
import ListsMovies from './ListsMovies';
import { useFocusEffect } from '@react-navigation/native';
import Header from './Header';
import Animated from 'react-native-reanimated';
import { AuthContext } from '../../store/AuthProvider';
import ListMovieHorizontal from '../../components/ListMovieHorizontal/ListMovieHorizontal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [dataTrendingMoives, setDataTrendingMoives] = useState({});
  const [dataNowPlayingMovies, setDataNowPlayingMovies] = useState([]);
  const [dataUpcomingMovies, setDataUpcomingMovies] = useState([]);
  const [dataPopularMovies, setDataPopularMovies] = useState([]);
  const [dataTopRatedMovies, setDataTopRatedMovies] = useState([]);
  const [dataList, setDataList] = useState([]);
  var [pageNowPlaying, setPageNowPlaying] = useState(1);
  var [pageUpComing, setPageUpComing] = useState(1);
  var [pagePopular, setPagePopuLar] = useState(1);
  var [pageTopRated, setPageTopRated] = useState(1);
  const [checkisInList, setCheckIsInList] = useState('add');
  const [randomTrending, setRandomTrending] = useState(
    Math.floor(Math.random() * 20)
  );
  const [dataGenres, setDataGenres] = useState([]);
  const [dataYears, setDataYears] = useState([]);
  const [dataCountries, setDataCountries] = useState([]);
  const [activeGenre, setActiveGenre] = useState('All');
  const [loadingNowPlaying, setLoadingNowPlaying] = useState(false);
  const [loadingUpComing, setLoadingUpComing] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingTopRated, setLoadingTopRated] = useState(false);
  const [isVisibleGenres, setIsVisibleGenres] = useState(false);
  const [isVisibleYears, setIsVisibleYears] = useState(false);
  const [chooseGenre, setChooseGenre] = useState('All');
  const [isEpisodes, setIsEpisodes] = useState(false);
  const [numberMovieTrending, setNumberMovieTrending] = useState(0);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === 'home') {
      navigation.setOptions({ tabBarVisible: false });
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({ tabBarVisible: false });
    // setTimeout(() => setLoading(true), 2000);
    getData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused/mount

      return () => {
        // Do something when the screen is unfocused/unmount
        // Useful for cleanup functions
        // clearInterval(intervalId);
      };
    }, [])
  );
  // const intervalId = useRef(1);

  const GetDataTrending = async () => {
    // console.log(await AsyncStorage.getItem('userToken'));
    getTrending(1).then((movieRespone) => {
      setDataTrendingMoives(
        movieRespone?.data?.results[Math.floor(Math.random() * 20)]
        // movieRespone?.data?.results[numberMovieTrending]
      )?.catch((e) => {
        if (axios.isCancel(e)) return;
      });
      // setCheckIsInList('add');
    });
  };

  // useEffect(() => {
  //   GetDataTrending();
  // }, [numberMovieTrending]);

  let intervalId = useRef().current;

  useEffect(() => {
    GetDataTrending();

    intervalId = setInterval(GetDataTrending.bind(dataTrendingMoives), 15000);

    // intervalId = setInterval(() => {
    //   GetDataTrending();
    // }, 15000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (dataTrendingMoives?.id !== undefined) {
      getMovieSeriesById(dataTrendingMoives?.id)
        .then((tvResponed) => {
          if (tvResponed?.data === null)
            getMovieById(dataTrendingMoives?.id)
              .then((movieResponed) => {
                setIsEpisodes(false);
              })
              .catch((e) => {
                if (axios.isCancel(e)) return;
              });
          else {
            setIsEpisodes(true);
          }
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    }

    getList(user?.id).then((movieRespone) => {
      setDataList(movieRespone.data.items);
    });
  }, [dataTrendingMoives?.id]);

  useEffect(() => {
    dataList.map((item) => {
      if (item.id === dataTrendingMoives?.id) {
        setCheckIsInList('checkmark');
      }
    });
  }, [dataList || dataTrendingMoives]);

  const getData = () => {
    Promise.all([
      getNowPlayingMovies(pageNowPlaying),
      getUpcomingMovies(pageUpComing),
      getPopularMovies(pagePopular),
      getTopRatedMovies(pageTopRated),
      // getAllGenres(),
      // getAllYear(),
      // getAllNational(),
    ])
      .then((res) => {
        setDataNowPlayingMovies(res[0].data.results);
        setDataUpcomingMovies(res[1].data.results);
        setDataPopularMovies(res[2].data.results);
        setDataTopRatedMovies(res[3].data.results);
        // setDataGenres(res[4].data);
        // setDataYears(res[5].data);
        // setDataCountries(res[6].data);
        setLoading(true);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });

    // getNowPlayingMovies(pageNowPlaying)
    //   .then((movieRespone) => {
    //     setDataNowPlayingMovies(movieRespone.data.results);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });

    // getUpcomingMovies(pageUpComing)
    //   .then((movieRespone) => {
    //     setDataUpcomingMovies(movieRespone.data.results);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });

    // getPopularMovies(pagePopular)
    //   .then((movieRespone) => {
    //     setDataPopularMovies(movieRespone.data.results);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });

    // getTopRatedMovies(pageTopRated)
    //   .then((movieRespone) => {
    //     setDataTopRatedMovies(movieRespone.data.results);
    //   })
    //   .catch((e) => {
    //     if (axios.isCancel(e)) return;
    //   });

    // getAllGenres().then((genreResponse) => {
    //   setDataGenres(genreResponse.data);
    // });

    // getAllYear().then((yearResponse) => {
    //   setDataYears(yearResponse.data);
    // });
  };

  const handleEndReachedNowPlaying = useCallback(() => {
    setPageNowPlaying(++pageNowPlaying);
    setLoadingNowPlaying(true);

    getNowPlayingMovies(pageNowPlaying)
      .then((movieRespone) => {
        setDataNowPlayingMovies(
          dataNowPlayingMovies.concat(movieRespone.data.results)
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [dataNowPlayingMovies]);

  const handleEndReachedUpComing = useCallback(() => {
    setPageUpComing(++pageUpComing);
    setLoadingUpComing(true);

    getUpcomingMovies(pageUpComing)
      .then((movieRespone) => {
        setDataUpcomingMovies(
          dataUpcomingMovies.concat(movieRespone.data.results)
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [dataUpcomingMovies]);

  const handleEndReachedPopular = useCallback(() => {
    setPagePopuLar(++pagePopular);
    setLoadingPopular(true);

    getPopularMovies(pagePopular)
      .then((movieRespone) => {
        setDataPopularMovies(
          dataPopularMovies.concat(movieRespone.data.results)
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [dataPopularMovies]);

  const handleEndReachedTopRated = useCallback(() => {
    setPageTopRated(++pageTopRated);
    setLoadingTopRated(true);

    getTopRatedMovies(pageTopRated)
      .then((movieRespone) => {
        setDataTopRatedMovies(
          dataTopRatedMovies.concat(movieRespone.data.results)
        );
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
      });
  }, [dataTopRatedMovies]);

  // const getDataByGenres = (genreName) => {
  //   getMoviesByGenresNowPlaying(pageNowPlaying, genreName)
  //     .then((movieRespone) => {
  //       setDataNowPlayingMovies(movieRespone.data.results);
  //     })
  //     .catch((e) => {
  //       if (axios.isCancel(e)) return;
  //     });

  //   getMoviesByGenresUpComing(pageUpComing, genreName)
  //     .then((movieRespone) => {
  //       setDataUpcomingMovies(movieRespone.data.results);
  //     })
  //     .catch((e) => {
  //       if (axios.isCancel(e)) return;
  //     });
  //   getMoviesByGenresPopular(pagePopular, genreName)
  //     .then((movieRespone) => {
  //       setDataPopularMovies(movieRespone.data.results);
  //     })
  //     .catch((e) => {
  //       if (axios.isCancel(e)) return;
  //     });
  //   getMoviesByGenresTopRated(pageTopRated, genreName)
  //     .then((movieRespone) => {
  //       setDataTopRatedMovies(movieRespone.data.results);
  //     })
  //     .catch((e) => {
  //       if (axios.isCancel(e)) return;
  //     });
  // };

  // useEffect(() => {
  //   if (activeGenre === 'All') {
  //     getData();
  //   } else {
  //     getDataByGenres(activeGenre);
  //   }
  // }, [activeGenre]);

  const handleRefresh = (genreName) => {
    // if (genreName === 'All') {
    //   getData();
    // } else {
    //   getDataByGenres(genreName);
    // }
  };

  const changeGenresVisbility = useCallback((bool) => {
    setIsVisibleGenres(bool);
  }, []);

  const changeYearsVisbility = useCallback((bool) => {
    setIsVisibleYears(bool);
  }, []);

  const scrolly = useRef(new Animated.Value(0)).current;

  const diffClamp = useRef(Animated.diffClamp(scrolly, 0, 90)).current;

  const header_translateY = Animated.interpolateNode(diffClamp, {
    inputRange: [0, 90],
    outputRange: [0, -90],
    extrapolate: 'clamp',
  });

  const header_opacity = Animated.interpolateNode(diffClamp, {
    inputRange: [0, 90],
    outputRange: [1, 0.2],
    extrapolate: 'clamp',
  });

  const header_color = Animated.interpolateColors(diffClamp, {
    inputRange: [0, 1],
    outputColorRange: ['red', 'black'],
  });

  return loading ? (
    // dataTrendingMoives &&
    //   dataUpcomingMovies != [] &&
    //   dataPopularMovies != [] &&
    //   dataTopRatedMovies != [] ?
    <SafeAreaView style={styles.container}>
      <StatusBar
        style="auto"
        translucent={true}
        backgroundColor="transparent"
      />

      <Animated.View
        style={{
          transform: [{ translateY: header_translateY }],
          zIndex: 10,
          backgroundColor: header_color,
          opacity: header_opacity,
        }}
      >
        <Header
          navigation={navigation}
          // dataGenres={dataGenres}
          // activeGenre={activeGenre}
          // dataYears={dataYears}
          // dataCountries={dataCountries}
          // chooseGenre={chooseGenre}
          // isVisibleYears={isVisibleYears}
          // changeYearsVisbility={changeYearsVisbility}
          // isVisibleGenres={isVisibleGenres}
          // changeGenresVisbility={changeGenresVisbility}
        />
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event([
          { nativeEvent: { contentOffset: { y: scrolly } } },
        ])}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={5}
      >
        <View style={{ marginBottom: 10 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('movie', {
                movieId: dataTrendingMoives?.id,
                item: dataTrendingMoives,
              })
            }
          >
            <ImageBackground
              source={{
                uri: getPoster(
                  dataTrendingMoives?.poster_path
                    ? dataTrendingMoives?.poster_path
                    : dataTrendingMoives?.backdrop_path
                ),
              }}
              resizeMode="cover"
              style={{
                height: height / 1.45,
                width: width,
              }}
            />

            <LinearGradient
              colors={['rgba(217, 217, 217, 0)', 'rgba(0, 0, 0, 1)']}
              start={[1, 0]}
              end={[1, 1]}
              style={{
                width: width,
                height: 150,
                position: 'absolute',
                bottom: 0,
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              width: width,
              position: 'absolute',
              alignSelf: 'center',
              alignItems: 'center',
              bottom: 0,
              zIndex: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                color: Colors.BLACK,
                fontFamily: Fonts.EXTRA_BOLD,
                fontSize: 22,
                textAlign: 'center',
                width: width / 1.3,
                marginBottom: 5,
                opacity: 0.85,
              }}
            >
              {!dataTrendingMoives?.name
                ? dataTrendingMoives?.title
                : dataTrendingMoives?.name}
            </Text>

            <View
              style={{
                width: width,
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('video', {
                    movieId: dataTrendingMoives?.id,
                  })
                }
              >
                <Ionicons name="play" size={45} color={Colors.BLACK} />
                <Text
                  style={{
                    fontFamily: Fonts.REGULAR,
                    fontSize: 20,
                    color: Colors.BLACK,
                    opacity: 0.7,
                  }}
                >
                  Play
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => {
                  if (checkisInList === 'add') {
                    // axios.post(
                    //   'https://api.themoviedb.org/3/list/8215569/add_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                    //   {
                    //     media_id: dataTrendingMoives?.id,
                    //   }
                    // );
                    addItemList(user?.id, {
                      media_type: isEpisodes ? 'tv' : 'movie',
                      media_id: +dataTrendingMoives?.id,
                    });
                    setCheckIsInList('checkmark');
                  } else if (checkisInList === 'checkmark') {
                    // axios.post(
                    //   'https://api.themoviedb.org/3/list/8215569/remove_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                    //   {
                    //     media_id: dataTrendingMoives?.id,
                    //   }
                    // );
                    removeItemList(user?.id, {
                      media_id: +dataTrendingMoives?.id,
                    });
                    setCheckIsInList('add');
                  }
                }}
              >
                <Ionicons name={checkisInList} size={45} color={Colors.BLACK} />
                <Text
                  style={{
                    fontFamily: Fonts.REGULAR,
                    fontSize: 20,
                    color: Colors.BLACK,
                    opacity: 0.7,
                  }}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* <Slideshow
            dataSource={this.getPosterPath()}
            position={position}
            onPositionChanged={(position) => this.setState({ position })}
            containerStyle={{
              height: height / 1.45,
              width: width,
            }}
          /> */}

        {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 15,
              marginTop: 10,
            }}
          >
            <Text style={styles.headerTitle}>Genres</Text>
          </View>
          <View style={styles.genreListContainer}>
            <FlatList
              data={dataGenres}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <ItemSeparator width={15} />}
              ListHeaderComponent={() => <ItemSeparator width={10} />}
              ListFooterComponent={() => <ItemSeparator width={10} />}
              renderItem={({ item }) => (
                <GenreCard
                  genreName={item.name}
                  active={item.name === activeGenre ? true : false}
                  onPress={(genreName) => {
                    this.handleRefresh(genreName);
                  }}
                />
              )}
            />
          </View> */}

        {/* <ListsMovies
          dataNowPlayingMovies={dataNowPlayingMovies}
          handleEndReachedNowPlaying={handleEndReachedNowPlaying}
          dataUpcomingMovies={dataUpcomingMovies}
          handleEndReachedUpComing={handleEndReachedUpComing}
          dataPopularMovies={dataPopularMovies}
          handleEndReachedPopular={handleEndReachedPopular}
          dataTopRatedMovies={dataTopRatedMovies}
          handleEndReachedTopRated={handleEndReachedTopRated}
          navigation={navigation}
          loadingNowPlaying={loadingNowPlaying}
          loadingUpComing={loadingUpComing}
          loadingPopular={loadingPopular}
          loadingTopRated={loadingTopRated}
        /> */}

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('movieShow', {
                currentMovies: 'nowplaying',
                currentTV: 'airingtoday',
                title: 'Now Playing',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>

        <ListMovieHorizontal
          data={dataNowPlayingMovies}
          sizeActivityIndicator={1.62}
          size={1}
          handleEndReached={handleEndReachedNowPlaying}
          loading={loadingNowPlaying}
          isMovieScreen={false}
          navigation={navigation}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Coming Soon</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('movieShow', {
                currentMovies: 'upcoming',
                currentTV: 'ontheair',
                title: 'Coming Soon',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>

        <ListMovieHorizontal
          data={dataUpcomingMovies}
          sizeActivityIndicator={1}
          size={0.62}
          handleEndReached={handleEndReachedUpComing}
          loading={loadingUpComing}
          isMovieScreen={false}
          navigation={navigation}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Popular</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('movieShow', {
                currentMovies: 'popular',
                currentTV: 'popular',
                title: 'Popular',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>

        <ListMovieHorizontal
          data={dataPopularMovies}
          sizeActivityIndicator={1}
          size={0.62}
          handleEndReached={handleEndReachedPopular}
          loading={loadingPopular}
          isMovieScreen={false}
          navigation={navigation}
        />

        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Top Rated</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('movieShow', {
                currentMovies: 'toprated',
                currentTV: 'toprated',
                title: 'Top Rated',
              })
            }
          >
            <Text style={styles.headerSubTile}>View All</Text>
          </TouchableOpacity>
        </View>

        <ListMovieHorizontal
          data={dataTopRatedMovies}
          sizeActivityIndicator={1}
          size={0.62}
          handleEndReached={handleEndReachedTopRated}
          loading={loadingTopRated}
          isMovieScreen={false}
          navigation={navigation}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  ) : (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BLACK,
      }}
    >
      <ActivityIndicator
        size="large"
        color={Colors.RED}
        style={{ transform: [{ scale: 1.5 }] }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BLACK,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.REGULAR,
  },
  headerSubTile: {
    fontSize: 16,
    color: Colors.ACTIVE,
    fontFamily: Fonts.BOLD,
    bordervaColor: Colors.LIGHT_GRAY,
    padding: 3,
    paddingHorizontal: 7,
  },
  genreListContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
