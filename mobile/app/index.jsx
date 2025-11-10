import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.title}>Edit app.</Text>
      <Link href="/(auth)/signup">Go to Signup</Link>
      <Link href="/(auth)">Go to Login</Link>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  title:{
    color:"blue"
  }
})
