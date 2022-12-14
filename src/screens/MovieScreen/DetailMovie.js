import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  LogBox,
  Image,
  Linking,
} from 'react-native';
import React, { Component, memo, useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import { Feather, Ionicons } from '@expo/vector-icons';
import ItemSeparator from '../../components/ItemSeparator';
import CastCard from '../../components/CastCard';
import MovieCard from '../../components/MovieCard';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  getLanguage,
  getMoviesBySeason,
  getVideo,
} from '../../services/MovieService';
import ListMovieHorizontal from '../../components/ListMovieHorizontal/ListMovieHorizontal';
import EpisodeBox from '../../components/EpisodeBox/EpisodeBox';
import axios from 'axios';
import Images from '../../constants/Images';

const { height, width } = Dimensions.get('window');

const setHeight = (h) => (height / 100) * h;
const setWidth = (w) => (width / 100) * w;
const DetailMovie = ({
  navigation,
  dataMovies,
  dataCredits,
  dataRecommend,
  dataSimiLar,
  isCastSelected,
  setIsCastSelected,
  handleEndReachedRecommendations,
  handleEndReachedSimiLar,
  loadingRecommended,
  loadingSimilar,
  isEpisodes,
}) => {
  const [dataSeason, setDataSeason] = useState({});
  const [numberOfSeasons, setNumberOfSeasons] = useState(
    dataMovies?.last_episode_to_air?.season_number
  );
  const [activeSeason, setActiveSeason] = useState(
    'Season ' + dataMovies?.last_episode_to_air?.season_number
  );
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (isEpisodes) {
      setNumberOfSeasons(dataMovies?.last_episode_to_air?.season_number);
      setActiveSeason(
        'Season ' + dataMovies?.last_episode_to_air?.season_number
      );
    }
  }, [dataMovies?.last_episode_to_air?.season_number]);

  useEffect(() => {
    if (isEpisodes) {
      getMoviesBySeason(dataMovies?.id, numberOfSeasons)
        .then((episodesRespones) => {
          setDataSeason(episodesRespones?.data);
        })
        .catch((e) => {
          if (axios.isCancel(e)) return;
        });
    }
  }, [numberOfSeasons]);

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.movieTitleContainer}>
        <View>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {dataMovies?.title ? dataMovies?.title : dataMovies?.name}
          </Text>
          <Text style={styles.movieOriginalTitle} numberOfLines={2}>
            <Text style={styles.labelText}>Original title: </Text>
            {dataMovies?.original_title
              ? dataMovies?.original_title
              : dataMovies?.original_name}
          </Text>
        </View>
        <View style={styles.voteAverage}>
          <Ionicons name="star" size={22} color={Colors.YELLOW} />
          <Text style={styles.raitingText}>
            {dataMovies?.vote_average?.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={{ ...styles.genreText, width: width / 1.5 }}>
            <Text style={styles.labelText}>Genres: </Text>
            {dataMovies?.genres?.map((genre) => genre?.name)?.join(', ')}
          </Text>
          <Text style={styles.genreText}>
            <Text style={styles.labelText}>Language: </Text>
            {getLanguage(dataMovies?.original_language)?.english_name}
          </Text>
          <Text style={styles.genreText}>
            {dataMovies?.episode_run_time === undefined ? (
              <Text style={styles.labelText}>Run time: </Text>
            ) : (
              <Text style={styles.labelText}>Run time per episode: </Text>
            )}
            {dataMovies?.episode_run_time === undefined ||
            dataMovies?.episode_run_time[0] == undefined
              ? dataMovies?.runtime === undefined
                ? '' + ' Min'
                : dataMovies?.runtime + ' Min'
              : dataMovies?.episode_run_time[0] + ' Min'}
          </Text>
          <Text style={styles.genreText}>
            <Text style={styles.labelText}>Realease date: </Text>
            {dataMovies?.release_date
              ? dataMovies?.release_date
              : dataMovies?.last_air_date}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 30,
          }}
          onPress={() =>
            Linking.openURL(getVideo(dataMovies?.videos?.results[0].key))
          }
        >
          <Image
            source={require('../../../assets/images/play.png')}
            style={{
              transform: [{ scale: 0.7 }],
            }}
          />
          <Text style={styles.labelText}>Trailer</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overViewContainer}>
        <Text style={styles.overViewTitle}>Overview</Text>
        <Text style={styles.overViewText}>{dataMovies?.overview}</Text>
      </View>
      {isEpisodes ? (
        <View>
          <Text
            style={{
              fontSize: 16,
              marginLeft: 10,
              paddingVertical: 5,
              color: Colors.BLACK,
              fontFamily: Fonts.BOLD,
              fontSize: 18,
            }}
          >
            Episodes
          </Text>

          <TouchableOpacity
            style={{
              marginLeft: 15,
              padding: 5,
              paddingVertical: 10,
              paddingHorizontal: 10,
              width: 135,
              backgroundColor: Colors.EXTRA_LIGHT_GRAY,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 10,
            }}
            onPress={() => {
              setOpen(!open);
            }}
            activeOpacity={0.5}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                marginRight: 10,
                fontFamily: Fonts.REGULAR,
                paddingLeft: 5,
              }}
            >
              {activeSeason}
            </Text>
            <Ionicons name={!open ? 'chevron-down' : 'chevron-up'} size={20} />
          </TouchableOpacity>
        </View>
      ) : null}

      <View>
        {open ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: 0,
              left: 10,
              padding: 10,
              zIndex: 5,
              backgroundColor: Colors.LIGHT_BLACK,
            }}
          >
            <ScrollView
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {dataMovies?.seasons?.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={{
                    paddingLeft: 15,
                    paddingVertical: 8,
                    borderWidth: 0.5,
                    borderTopColor: index !== 0 ? Colors.LIGHT_GRAY : null,
                    paddingRight: 80,
                  }}
                  onPress={() => {
                    setNumberOfSeasons(item?.season_number);
                    setOpen(false);
                    setActiveSeason(item?.name);
                  }}
                  activeOpacity={0.5}
                >
                  <Text
                    style={{
                      fontFamily: Fonts.REGULAR,
                      fontSize: 15,
                      color: Colors.LIGHT_GRAY,
                    }}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>

      {isEpisodes ? (
        <View
          style={{ flex: 1, marginTop: 10 }}
          // showsVerticalScrollIndicator={false}
          // nestedScrollEnabled
        >
          <FlatList
            nestedScrollEnabled
            style={{ maxHeight: height / 2 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={dataSeason.episodes}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <ItemSeparator width={15} />}
            ListHeaderComponent={() => <ItemSeparator width={10} />}
            ListFooterComponent={() => <ItemSeparator width={10} />}
            renderItem={({ item }) => <EpisodeBox item={item} />}
          />
          {/* {dataSeason?.episodes?.map((item, index) => (
              <View key={index.toString()} style={{}}>
                <EpisodeBox item={item} />
              </View>
            ))} */}
        </View>
      ) : null}

      <View style={{ marginTop: 10 }}>
        <View style={styles.castSubMenuContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setIsCastSelected(true);
            }}
          >
            <Text
              style={{
                ...styles.castSubMenuText,
                color: isCastSelected ? Colors.BLACK : Colors.LIGHT_GRAY,
              }}
            >
              Cast
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setIsCastSelected(false);
            }}
          >
            <Text
              style={{
                ...styles.castSubMenuText,
                color: isCastSelected ? Colors.LIGHT_GRAY : Colors.BLACK,
              }}
            >
              Crew
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={{ marginVertical: 5 }}
          data={
            isCastSelected
              ? dataCredits.credits?.cast
              : dataCredits.credits?.crew
          }
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <ItemSeparator width={15} />}
          ListHeaderComponent={() => <ItemSeparator width={10} />}
          ListFooterComponent={() => <ItemSeparator width={10} />}
          renderItem={({ item }) => (
            <CastCard
              originalname={item?.name}
              characterName={isCastSelected ? item?.character : item?.job}
              image={item?.profile_path}
            />
          )}
        />
      </View>

      {dataRecommend.length !== 0 ? (
        <Text style={styles.extraListTitle}>Recommended Movives</Text>
      ) : null}

      <ListMovieHorizontal
        data={dataRecommend}
        sizeActivityIndicator={1}
        size={0.62}
        handleEndReached={handleEndReachedRecommendations}
        loading={loadingRecommended}
        isMovieScreen={true}
        navigation={navigation}
      />
      {dataSimiLar.length !== 0 ? (
        <Text style={styles.extraListTitle}>Similar Movives</Text>
      ) : null}

      <ListMovieHorizontal
        data={dataSimiLar}
        sizeActivityIndicator={1}
        size={0.62}
        handleEndReached={handleEndReachedSimiLar}
        loading={loadingSimilar}
        isMovieScreen={true}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  movieTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  movieTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.EXTRA_BOLD,
    fontSize: 18,
    width: setWidth(60),
  },
  movieOriginalTitle: {
    color: Colors.LIGHT_GRAY,
    marginTop: 5,
    fontFamily: Fonts.REGULAR,
    width: setWidth(60),
  },
  raitingText: {
    marginLeft: 5,
    color: Colors.BLACK,
    fontFamily: Fonts.EXTRA_BOLD,
    fontSize: 15,
  },
  voteAverage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  labelText: {
    color: Colors.LIGHT_GRAY,
    fontFamily: Fonts.BOLD,
    fontSize: 14,
  },
  genreText: {
    color: Colors.LIGHT_GRAY,
    paddingHorizontal: 10,
    marginTop: 5,
    fontFamily: Fonts.REGULAR,
    fontSize: 14,
  },
  overViewContainer: {
    color: Colors.LIGHT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 10,
  },
  overViewTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
  },
  overViewText: {
    color: Colors.LIGHT_GRAY,
    paddingVertical: 5,
    fontFamily: Fonts.REGULAR,
    fontSize: 14,
    textAlign: 'justify',
  },
  castSubMenuContainer: {
    marginLeft: 10,
    flexDirection: 'row',
    marginVertical: 5,
  },
  castSubMenuText: {
    marginRight: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
  },
  extraListTitle: {
    marginLeft: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.BOLD,
    fontSize: 18,
    marginVertical: 8,
  },
});

export default memo(DetailMovie);
