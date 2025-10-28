import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Screens ---
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import CompanyScreen from '../screens/CompanyScreen';
import PersonalScreen from '../screens/PersonalScreen';
import AccountScreen from '../screens/AccountScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ExpenseScreen from '../screens/Expense/ExpenseScreen';
import ExpenseDetailsScreen from '../screens/Expense/ExpenseDetailsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import NewReportScreen from '../screens/Reports/NewReportScreen';
import AdvancesScreen from '../screens/Advances/AdvancesScreen';
import RecordAdvanceScreen from '../screens/Advances/RecordAdvanceScreen';
import TripsScreen from '../screens/Trips/TripsScreen';
import CreateTripScreen from '../screens/Trips/CreateTripScreen';
import TripsApprovalScreen from '../screens/TripsApprovalScreen';
import ReportsApprovalScreen from '../screens/ReportsApprovalScreen';



// --- New Analytics Screens ---
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import ExpenseByCategoryScreen from '../screens/Analytics/ExpenseByCategoryScreen';
import ExpenseByCategoryReport from '../screens/Analytics/ExpenseByCategoryReport';
import ExpenseByMerchantScreen from '../screens/Analytics/ExpenseByMerchantScreen';
import ExpenseByMerchantReport from '../screens/Analytics/ExpenseByMerchantReport';
import { AppDataProvider } from '../context/AppDataContext';


// --- Cards Screen ---
const CardsScreen = ({ navigation }) => (
  <View style={styles.cardsContainer}>
    <LinearGradient
      colors={['#8E2DE2', '#6A0DAD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.detailsHeader}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={26} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.detailsTitle}>Cards</Text>
      <View style={{ width: 26 }} />
    </LinearGradient>
    <View style={styles.cardsContent}>
      <Text style={styles.cardsText}>Connect your card and manage expenses</Text>
    </View>
  </View>
);

// --- Stack / Tab / Drawer setup ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const defaultTabBarStyle = {
  height: 80,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: 'absolute',
  overflow: 'hidden',
};

const CustomTabBarBackground = () => (
  <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={StyleSheet.absoluteFillObject} />
);

// --- Generic Stack (for Home, Company, etc.) ---
const createStack = (MainComponent, mainTitle) => (
  <Stack.Navigator>
    <Stack.Screen
      name={`${mainTitle}Main`}
      component={MainComponent}
      options={({ navigation }) => ({
        header: () => (
          <LinearGradient
            colors={['#8E2DE2', '#6A0DAD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.subHeader}
          >
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon name="menu" size={26} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.subHeaderTitle}>{mainTitle}</Text>
            <View style={{ width: 26 }} />
          </LinearGradient>
        ),
      })}
    />
    <Stack.Screen
      name={`${mainTitle}Details`}
      component={DetailsScreen}
      options={({ navigation }) => ({
        header: () => (
          <LinearGradient
            colors={['#8E2DE2', '#6A0DAD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.detailsHeader}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={26} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>Details</Text>
            <View style={{ width: 26 }} />
          </LinearGradient>
        ),
      })}
    />
  </Stack.Navigator>
);

// --- Bottom Tabs ---
const Tabs = ({ initialRoute }) => (
  <Tab.Navigator
    initialRouteName={initialRoute || 'Home'}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarBackground: () => <CustomTabBarBackground />,
      tabBarShowLabel: true,
      tabBarActiveTintColor: '#FFF',
      tabBarInactiveTintColor: '#D1B3FF',
      tabBarStyle: defaultTabBarStyle,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
      tabBarIcon: ({ color }) => {
        let iconName;
        switch (route.name) {
          case 'Home': iconName = 'home-outline'; break;
          case 'Company': iconName = 'office-building-outline'; break;
          case 'Personal': iconName = 'wallet-outline'; break;
          case 'Account': iconName = 'account-outline'; break;
          default: iconName = 'circle-outline';
        }
        return <Icon name={iconName} size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      children={() => createStack(HomeScreen, 'Home')}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeMain';
        return { tabBarStyle: routeName.endsWith('Details') ? { display: 'none' } : defaultTabBarStyle };
      }}
    />
    <Tab.Screen
      name="Company"
      children={() => createStack(CompanyScreen, 'Company')}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'CompanyMain';
        return { tabBarStyle: routeName.endsWith('Details') ? { display: 'none' } : defaultTabBarStyle };
      }}
    />
    <Tab.Screen
      name="Add"
      component={ExpenseScreen}
      options={{
        tabBarLabel: '',
        tabBarIcon: () => (
          <View style={styles.addButtonContainer}>
            <View style={styles.addGlow}>
              <TouchableOpacity style={styles.addButton}>
                <Icon name="plus" size={26} color="#6A0DAD" />
              </TouchableOpacity>
            </View>
          </View>
        ),
      }}
    />
    <Tab.Screen
      name="Personal"
      children={() => createStack(PersonalScreen, 'Personal')}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'PersonalMain';
        return { tabBarStyle: routeName.endsWith('Details') ? { display: 'none' } : defaultTabBarStyle };
      }}
    />
    <Tab.Screen
      name="Account"
      children={() => createStack(AccountScreen, 'Account')}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'AccountMain';
        return { tabBarStyle: routeName.endsWith('Details') ? { display: 'none' } : defaultTabBarStyle };
      }}
    />
  </Tab.Navigator>
);

// --- Drawer Item Component ---
const DrawerItem = ({ label, icon, focused, onPress }) => (
  <TouchableOpacity style={[styles.drawerItem, focused && styles.drawerItemActive]} onPress={onPress}>
    <Icon name={icon} size={20} color={focused ? '#FFF' : '#E0D4F7'} style={styles.drawerIcon} />
    <Text style={[styles.drawerLabel, focused && styles.drawerLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- Custom Drawer Content ---
function CustomDrawerContent({ navigation, state }) {
  const currentRoute = state.routeNames[state.index];
  return (
    <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.drawerGradient}>
      <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
        <DrawerItem
          label="Dashboard"
          icon="view-dashboard-outline"
          focused={currentRoute === 'Home'}
          onPress={() => navigation.navigate('Home', { screen: 'Home' })}
        />
        <DrawerItem
          label="Inbox"
          icon="inbox-outline"
          focused={currentRoute === 'Inbox'}
          onPress={() => {}}
        />

        <Text style={styles.sectionTitle}>EXPENSE</Text>
        <DrawerItem label="Expense" icon="file-document-outline" focused={currentRoute === 'ExpenseScreen'} onPress={() => navigation.navigate('ExpenseScreen')} />
        <DrawerItem label="Cards" icon="credit-card-outline" focused={currentRoute === 'Cards'} onPress={() => navigation.navigate('Cards')} />
        <DrawerItem label="Company" icon="office-building-outline" focused={currentRoute === 'Company'} onPress={() => navigation.navigate('Company', { screen: 'Company' })} />
        <DrawerItem label="Personal" icon="wallet-outline" focused={currentRoute === 'Personal'} onPress={() => navigation.navigate('Personal', { screen: 'Personal' })} />
        <DrawerItem label="Account" icon="account-outline" focused={currentRoute === 'Account'} onPress={() => navigation.navigate('Account', { screen: 'Account' })} />
        <DrawerItem label="Reports" icon="file-chart-outline" focused={currentRoute === 'Reports'} onPress={() => navigation.navigate('Reports')} />
        <DrawerItem label="Advances" icon="cash-multiple" focused={currentRoute === 'Advances'} onPress={() => navigation.navigate('Advances')} />
        <DrawerItem label="Trips" icon="airplane-takeoff" focused={currentRoute === 'Trips'} onPress={() => navigation.navigate('Trips')} />

        {/* Divider */}
        <View style={styles.drawerDivider} />

        <DrawerItem
          label="Trips Approval"
          icon="check-decagram-outline"
          focused={currentRoute === 'TripsApproval'}
          onPress={() => navigation.navigate('TripsApproval')}
        />
        <DrawerItem
          label="Reports Approval"
          icon="file-check-outline"
          focused={currentRoute === 'ReportsApproval'}
          onPress={() => navigation.navigate('ReportsApproval')}
        />

        {/* New Section Divider */}
        <View style={styles.drawerDivider} />

        <DrawerItem
          label="Analytics"
          icon="chart-box-outline"
          focused={currentRoute === 'Analytics'}
          onPress={() => navigation.navigate('Analytics')}
        />
      </DrawerContentScrollView>
    </LinearGradient>
  );
}

// --- Drawer Navigator ---
const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{ headerShown: false, drawerType: 'front', overlayColor: 'transparent' }}
  >
    <Drawer.Screen name="Home" children={() => <Tabs initialRoute="Home" />} />
    <Drawer.Screen name="Company" children={() => <Tabs initialRoute="Company" />} />
    <Drawer.Screen name="Personal" children={() => <Tabs initialRoute="Personal" />} />
    <Drawer.Screen name="Account" children={() => <Tabs initialRoute="Account" />} />
    <Drawer.Screen name="Cards" component={CardsScreen} />
    <Drawer.Screen name="ExpenseScreen" component={ExpenseScreen} />
    <Drawer.Screen name="ExpenseHandling" component={ExpenseDetailsScreen} />
    <Drawer.Screen name="Reports" component={ReportsScreen} />
    <Drawer.Screen name="Advances" component={AdvancesScreen} />
    <Drawer.Screen name="Trips" component={TripsScreen} />
    <Drawer.Screen name="TripsApproval" component={TripsApprovalScreen} />
    <Drawer.Screen name="ReportsApproval" component={ReportsApprovalScreen} />

    {/* New Analytics Screens */}
    <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
    <Drawer.Screen name="ExpenseByCategory" component={ExpenseByCategoryScreen} />
    <Drawer.Screen name="ExpenseByCategoryReport" component={ExpenseByCategoryReport} />
    <Drawer.Screen name="ExpenseByMerchant" component={ExpenseByMerchantScreen} />
    <Drawer.Screen name="ExpenseByMerchantReport" component={ExpenseByMerchantReport} />
  </Drawer.Navigator>
);

// --- App Navigator (Root) ---
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="NewReport" component={NewReportScreen} />
      <Stack.Screen name="RecordAdvance" component={RecordAdvanceScreen} />
      <Stack.Screen name="CreateTrip" component={CreateTripScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// --- Styles ---
const styles = StyleSheet.create({
  subHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 },
  subHeaderTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  detailsHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, justifyContent: 'space-between', elevation: 6 },
  detailsTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  addButtonContainer: { position: 'absolute', top: -25, alignItems: 'center' },
  addGlow: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 40, padding: 10 },
  addButton: { backgroundColor: '#FFF', borderRadius: 20, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#6A0DAD', shadowOpacity: 0.3, shadowRadius: 6 },
  drawerGradient: { flex: 1 },
  drawerContainer: { paddingTop: 20 },
  sectionTitle: { marginTop: 20, marginLeft: 16, fontSize: 12, color: '#E0CFFF', fontWeight: '600' },
  drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 6, marginVertical: 3, marginRight: 12 },
  drawerItemActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  drawerIcon: { marginRight: 12 },
  drawerLabel: { fontSize: 15, color: '#E0D4F7', fontWeight: '500' },
  drawerLabelActive: { color: '#FFF', fontWeight: '600' },
  drawerDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 12, marginHorizontal: 16 },
  cardsContainer: { flex: 1, backgroundColor: '#F8F5FF' },
  cardsContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardsText: { fontSize: 18, fontWeight: '600', color: '#6A0DAD', textAlign: 'center', paddingHorizontal: 20 },
});

export default AppNavigator;
