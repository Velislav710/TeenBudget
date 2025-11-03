import { registerRootComponent } from 'expo';
import Constants from 'expo-constants';
import App from './App';

// Log API base for verification
const { apiBaseUrl } = Constants.expoConfig?.extra ?? {};
console.log('API Base URL:', apiBaseUrl);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
