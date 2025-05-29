import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to set the access token
export const setAccessToken = async (token) => {
  try {
    await AsyncStorage.setItem('accessToken', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token', error);
  }
};

// Function to get the access token
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    if (token !== null) {
      console.log('Token retrieved successfully',token);
      return token;
    }
    console.log('No token found');
    return null;
  } catch (error) {
    console.error('Error retrieving token', error);
    return null;
  }
};
