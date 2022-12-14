import React, { useContext, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import HomeScreen from '../HomeScreen';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import Search from '../Search';
import List from '../List';
import Setting from '../Setting/Setting';
import BottomTabNavigator from '../BottomTabNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../store/AuthProvider';
import Images from '../../constants/Images';
import { useRoute } from '@react-navigation/native';

const DrawerStack = createDrawerNavigator();
const DrawerContent = (props, { navigation }) => {
  const { authContext } = useContext(AuthContext);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const route = useRoute();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.BLACK }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Avatar.Image source={Images.ACCOUNT} size={50} />
              <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                <Title style={styles.title}>DuyHieu987</Title>
                <Caption style={styles.caption}>@d_hieu</Caption>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  80
                </Paragraph>
                <Caption style={styles.caption}>Following</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>
                  100
                </Paragraph>
                <Caption style={styles.caption}>Followers</Caption>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="home-outline"
                  color={route.name === 'home' ? Colors.ACTIVE : color}
                  size={size}
                />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('home');
              }}
              labelStyle={{
                color: route.name === 'home' ? Colors.ACTIVE : null,
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => {
                props.navigation.navigate('S');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="bookmark-outline" color={color} size={size} />
              )}
              label="List"
              onPress={() => {
                props.navigation.navigate('List');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Ionicons name="settings-outline" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => {
                props.navigation.navigate('Setting');
              }}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="account-check-outline" color={color} size={size} />
              )}
              label="Support"
              onPress={() => {
                props.navigation.navigate('support');
              }}
            />
          </Drawer.Section>
          <Drawer.Section title="Preferences">
            <TouchableRipple
              onPress={() => {
                // toggleTheme();
                setIsSwitchOn(!isSwitchOn);
              }}
            >
              <View style={styles.preference}>
                <Text style={{ fontFamily: Fonts.REGULAR, marginTop: 15 }}>
                  Dark Theme
                </Text>
                <View pointerEvents="none">
                  <Switch color={Colors.ACTIVE} value={isSwitchOn} />
                </View>
              </View>
            </TouchableRipple>
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign Out"
          onPress={() => {
            authContext.signOut();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <DrawerStack.Navigator
      initialRouteName="home"
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        activeTintColor: Colors.ACTIVE,
        activeBackgroundColor: Colors.ACTIVE,
        inactiveTintColor: Colors.GRAY,
      }}
    >
      <DrawerStack.Screen name="HomeDrawer" component={BottomTabNavigator} />
      <DrawerStack.Screen name="SearchDrawer" component={Search} />
      <DrawerStack.Screen name="ListDrawer" component={List} />
      <DrawerStack.Screen name="SettingDrawer" component={Setting} />
    </DrawerStack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: 20,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
    fontFamily: Fonts.REGULAR,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontFamily: Fonts.REGULAR,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bottomDrawerSection: {
    marginBottom: 25,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
});

export default DrawerNavigator;
