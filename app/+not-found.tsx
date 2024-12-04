import { Link, Stack } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist." }} />
      <View style={styles.container}>
        <Text style={{fontSize: 32, fontFamily: "Gilroy"}}>404 - Not Found!</Text>
        <Link href="/">Go to home screen</Link>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
