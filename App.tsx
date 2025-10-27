import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RoleSelectScreen from './src/screens/RoleSelectScreen';
import ScenarioScreen from './src/screens/ScenarioScreen';
import StrategyScreen from './src/screens/StrategyScreen';
import SummaryScreen from './src/screens/SummaryScreen';

import { GameProvider } from './src/state/GameContext';

type RootStackParamList = {
  RoleSelect: undefined;
  Scenario: undefined;
  Strategy: undefined;
  Summary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: '#0b1326' },
  };

  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer theme={navTheme}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#0b1326' },
              headerTintColor: 'white',
            }}
          >
            <Stack.Screen
              name="RoleSelect"
              component={RoleSelectScreen}
              options={{ title: 'Choose a Stakeholder' }}
            />
            <Stack.Screen name="Scenario" component={ScenarioScreen} options={{ title: 'Scenarios' }} />
            <Stack.Screen name="Strategy" component={StrategyScreen} options={{ title: 'Future Strategies' }} />
            <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: 'Outcome Summary' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}