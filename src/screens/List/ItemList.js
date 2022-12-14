import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Fonts from '../../constants/Fonts';
import Images from '../../constants/Images';
import {
  getPoster,
  getLanguage,
  removeItemList,
  addItemList,
  getMovieSeriesById,
  getMovieById,
} from '../../services/MovieService';
import axios from 'axios';
import { addContext } from '../HomeScreen/HomeScreen';
import { AuthContext } from '../../store/AuthProvider';

const { height, width } = Dimensions.get('window');

const ItemList = ({ id, title, poster, handleOnPress }) => {
  const [remove, setRemove] = useState(true);
  const [voteCountValue, setVoteCountValue] = useState({});
  const [removeItem, setRemoveItem] = useState(true);
  const [isEpisodes, setIsEpisodes] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getMovieSeriesById(id)
      .then((tvResponed) => {
        if (tvResponed?.data === null)
          getMovieById(id)
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
  }, [id]);

  return removeItem ? (
    <TouchableOpacity
      style={{
        marginHorizontal: 5,
        marginTop: 3,
      }}
      activeOpacity={0.8}
      onPress={handleOnPress}
    >
      <ImageBackground
        style={styles.container}
        imageStyle={{ borderRadius: 10 }}
        source={{ uri: getPoster(poster) }}
        resizeMode="contain"
      />
      <View style={styles.movieContainer}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.movieSubTitleContainer}>
          <TouchableNativeFeedback
            style={styles.rowAndCenter}
            onPress={() => {
              if (remove === false) {
                // axios.post(
                //     'https://api.themoviedb.org/3/list/8215569/remove_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                //     {
                //       media_id: id,
                //     }
                //   )
                addItemList(user?.id, {
                  media_type: isEpisodes ? 'tv' : 'movie',
                  media_id: +id,
                });
                setRemove(false);
              } else {
                // axios.post(
                //     'https://api.themoviedb.org/3/list/8215569/add_item?api_key=fe1b70d9265fdb22caa86dca918116eb&session_id=5ae3c9dd2c824276ba202e5f77298064ccc7085d',
                //     {
                //       media_id: id,
                //     }
                //   );
                removeItemList(user?.id, {
                  media_id: +id,
                });
                setRemove(true);
                setRemoveItem(false);
              }
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={remove ? 'checkmark' : 'add'}
                size={30}
                style={{
                  padding: 10,
                }}
              />
              <Text style={{ fontSize: 12 }}>{remove ? 'Remove' : 'Add'}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </TouchableOpacity>
  ) : null;
};

ItemList.defaultProps = {
  size: 1,
  heartLess: false,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY,
    height: 170,
    width: width / 3.3,
    borderRadius: 12,
    elevation: 7,
    marginVertical: 2,
  },
  movieTitle: {
    fontFamily: Fonts.EXTRA_BOLD,
    color: Colors.GRAY,
    marginTop: 7,
    paddingHorizontal: 5,
    width: width / 3.3,
  },
  movieContainer: {
    justifyContent: 'space-between',
    height: 100,
  },
  movieSubTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAndCenter: {
    alignSelf: 'center',
  },
  imdbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    position: 'absolute',
    backgroundColor: Colors.YELLOW,
    borderTopRightRadius: 10,
    paddingVertical: 3,
    borderBottomLeftRadius: 6,
  },
});

export default ItemList;
