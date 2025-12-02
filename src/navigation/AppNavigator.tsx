// src/navigation/AppNavigator.tsx
import React, { useContext } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
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
import ExpenseHandlingScreen from '../screens/Expense/ExpenseHandlingScreen';
import ExpenseDetailsScreen from '../screens/Expense/ExpenseDetailsScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import NewReportScreen from '../screens/Reports/NewReportScreen';
import AdvancesScreen from '../screens/Advances/AdvancesScreen';
import RecordAdvanceScreen from '../screens/Advances/RecordAdvanceScreen';
import TripsScreen from '../screens/Trips/TripsScreen';
import CreateTripScreen from '../screens/Trips/CreateTripScreen';
import TripDetailsScreen from '../screens/Trips/TripDetailsScreen';
import TripsApprovalScreen from '../screens/TripsApprovalScreen';
import ReportsApprovalScreen from '../screens/ReportsApprovalScreen';
import ApiTestScreen from '../screens/ApiTestScreen';

// --- Analytics ---
import AnalyticsScreen from '../screens/Analytics/AnalyticsScreen';
import ExpenseByCategoryScreen from '../screens/Analytics/ExpenseByCategoryScreen';
import ExpenseByCategoryReport from '../screens/Analytics/ExpenseByCategoryReport';
import ExpenseByMerchantScreen from '../screens/Analytics/ExpenseByMerchantScreen';
import ExpenseByMerchantReport from '../screens/Analytics/ExpenseByMerchantReport';

// --- Context ---
import { AppDataContext } from '../context/AppDataContext';

// --- Cards Screen ---
const CardsScreen = ({ navigation }: any) => (
  <View style={styles.cardsContainer}>
    <LinearGradient
      colors={['#8E2DE2', '#6A0DAD']}
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

// --- Navigators ---
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// --- Common Tab Bar ---
const defaultTabBarStyle = {
  height: 80,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  position: 'absolute' as const,
  overflow: 'hidden' as const,
};

const CustomTabBarBackground = () => (
  <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={StyleSheet.absoluteFillObject} />
);

// --- Stack Generator for main screens ---
const createStack = (MainComponent: any, mainTitle: string) => {
  const InnerStack = createNativeStackNavigator();

  const StackComponent = () => (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name={`${mainTitle}Main`}
        component={MainComponent}
        options={({ navigation }) => ({
          header: () => (
            <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.subHeader}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Icon name="menu" size={26} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.subHeaderTitle}>{mainTitle}</Text>
              <View style={{ width: 26 }} />
            </LinearGradient>
          ),
        })}
      />

      <InnerStack.Screen
        name={`${mainTitle}Details`}
        component={DetailsScreen}
        options={({ navigation }) => ({
          header: () => (
            <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={26} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.detailsTitle}>Details</Text>
              <View style={{ width: 26 }} />
            </LinearGradient>
          ),
        })}
      />
    </InnerStack.Navigator>
  );

  return StackComponent;
};

// Stacks
const HomeStack = createStack(HomeScreen, 'Home');
const CompanyStack = createStack(CompanyScreen, 'Company');
const PersonalStack = createStack(PersonalScreen, 'Personal');
const AccountStack = createStack(AccountScreen, 'Account');

// --- ⭐ NEW: API TEST STACK (Back button + gradient header) ---
const ApiTestStack = () => {
  const InnerStack = createNativeStackNavigator();

  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name="ApiTestMain"
        component={ApiTestScreen}
        options={({ navigation }) => ({
          header: () => (
            <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={26} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.detailsTitle}>API Test</Text>
              <View style={{ width: 26 }} />
            </LinearGradient>
          ),
        })}
      />
    </InnerStack.Navigator>
  );
};

// --- Tabs ---
const Tabs = ({ initialRoute }: any) => (
  <Tab.Navigator
    initialRouteName={initialRoute || 'Home'}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarBackground: () => <CustomTabBarBackground />,
      tabBarActiveTintColor: '#FFF',
      tabBarInactiveTintColor: '#D1B3FF',
      tabBarStyle: defaultTabBarStyle,
      tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginBottom: 8 },
      tabBarIcon: ({ color }: any) => {
        const icons: any = {
          Home: 'home-outline',
          Company: 'office-building-outline',
          Personal: 'wallet-outline',
          Account: 'account-outline',
        };
        return <Icon name={icons[route.name] || 'circle-outline'} size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Company" component={CompanyStack} />
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
    <Tab.Screen name="Personal" component={PersonalStack} />
    <Tab.Screen name="Account" component={AccountStack} />
  </Tab.Navigator>
);

const TabsWrapper = ({ route }: any) => {
  const initialRoute = route?.params?.initialRoute || 'Home';
  return <Tabs initialRoute={initialRoute} />;
};

// --- Drawer Item ---
const DrawerItem = ({ label, icon, focused, onPress }: any) => (
  <TouchableOpacity style={[styles.drawerItem, focused && styles.drawerItemActive]} onPress={onPress}>
    <Icon name={icon} size={20} color={focused ? '#FFF' : '#E0D4F7'} style={styles.drawerIcon} />
    <Text style={[styles.drawerLabel, focused && styles.drawerLabelActive]}>{label}</Text>
  </TouchableOpacity>
);

// --- Custom Drawer ---
function CustomDrawerContent({ navigation, state }: any) {
  const currentRoute = state.routeNames[state.index];
  return (
    <LinearGradient colors={['#8E2DE2', '#6A0DAD']} style={styles.drawerGradient}>
      <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
        <DrawerItem label="Dashboard" icon="view-dashboard-outline" focused={currentRoute === 'Home'} onPress={() => navigation.navigate('Home', { screen: 'Home' })} />

        <Text style={styles.sectionTitle}>EXPENSE</Text>
        <DrawerItem label="Expense Handling" icon="playlist-edit" onPress={() => navigation.navigate('ExpenseHandling')} />
        <DrawerItem label="Create Expense" icon="file-plus-outline" onPress={() => navigation.navigate('ExpenseDetails')} />

        <Text style={styles.sectionTitle}>TRIPS</Text>
        <DrawerItem label="Trips" icon="airplane-takeoff" onPress={() => navigation.navigate('Trips')} />
        <DrawerItem label="Create Trip" icon="airplane-plus" onPress={() => navigation.navigate('CreateTrip')} />
        <DrawerItem label="Trip Approval" icon="check-decagram-outline" onPress={() => navigation.navigate('TripsApproval')} />

        <Text style={styles.sectionTitle}>REPORTS</Text>
        <DrawerItem label="Reports" icon="file-chart-outline" onPress={() => navigation.navigate('Reports')} />
        <DrawerItem label="New Report" icon="file-plus-outline" onPress={() => navigation.navigate('NewReport')} />
        <DrawerItem label="Reports Approval" icon="file-check-outline" onPress={() => navigation.navigate('ReportsApproval')} />

        <View style={styles.drawerDivider} />
        <DrawerItem label="Advances" icon="cash-multiple" onPress={() => navigation.navigate('Advances')} />
        <DrawerItem label="Analytics" icon="chart-box-outline" onPress={() => navigation.navigate('Analytics')} />

        {/* UTILITIES */}
        <Text style={styles.sectionTitle}>UTILITIES</Text>
        <DrawerItem label="API Test" icon="api" onPress={() => navigation.navigate('ApiTest')} />
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
    <Drawer.Screen name="Home" component={TabsWrapper} initialParams={{ initialRoute: 'Home' }} />
    <Drawer.Screen name="Company" component={TabsWrapper} initialParams={{ initialRoute: 'Company' }} />
    <Drawer.Screen name="Personal" component={TabsWrapper} initialParams={{ initialRoute: 'Personal' }} />
    <Drawer.Screen name="Account" component={TabsWrapper} initialParams={{ initialRoute: 'Account' }} />

    <Drawer.Screen name="Cards" component={CardsScreen} />
    <Drawer.Screen name="ExpenseHandling" component={ExpenseHandlingScreen} />
    <Drawer.Screen name="ExpenseDetails" component={ExpenseDetailsScreen} />

    <Drawer.Screen name="Trips" component={TripsScreen} />
    <Drawer.Screen name="CreateTrip" component={CreateTripScreen} />
    <Drawer.Screen name="TripsApproval" component={TripsApprovalScreen} />

    <Drawer.Screen name="Reports" component={ReportsScreen} />
    <Drawer.Screen name="NewReport" component={NewReportScreen} />
    <Drawer.Screen name="ReportsApproval" component={ReportsApprovalScreen} />

    <Drawer.Screen name="Advances" component={AdvancesScreen} />
    <Drawer.Screen name="Analytics" component={AnalyticsScreen} />

    <Drawer.Screen name="ExpenseByCategory" component={ExpenseByCategoryScreen} />
    <Drawer.Screen name="ExpenseByCategoryReport" component={ExpenseByCategoryReport} />
    <Drawer.Screen name="ExpenseByMerchant" component={ExpenseByMerchantScreen} />
    <Drawer.Screen name="ExpenseByMerchantReport" component={ExpenseByMerchantReport} />

    {/* ⭐ Api Test now uses a Stack with its own Header */}
    <Drawer.Screen name="ApiTest" component={ApiTestStack} />
  </Drawer.Navigator>
);

// --- Root Navigator ---
const RootStack = createNativeStackNavigator();

function RootNavigator() {
  const { isLoggedIn } = useContext(AppDataContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Main" component={DrawerNavigator} />
          <RootStack.Screen name="RecordAdvance" component={RecordAdvanceScreen} />
          <RootStack.Screen name="CreateTrip" component={CreateTripScreen} />
          <RootStack.Screen name="TripDetails" component={TripDetailsScreen} />
        </RootStack.Navigator>
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Splash" component={SplashScreen} />
          <RootStack.Screen name="Login" component={LoginScreen} />
          <RootStack.Screen name="Signup" component={SignupScreen} />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// AppNavigator Export
function AppNavigator() {
  return <RootNavigator />;
}

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  subHeaderTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    elevation: 6,
  },
  detailsTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  addButtonContainer: { position: 'absolute', top: -25, alignItems: 'center' },
  addGlow: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 40, padding: 10 },
  addButton: { backgroundColor: '#FFF', borderRadius: 20, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 8 },

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

// Final Export
export default AppNavigator;
