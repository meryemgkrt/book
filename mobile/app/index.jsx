import { Link } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/authStore.js";
import { useEffect } from "react";

export default function Index() {
  const { user, token, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    console.log("User on Index page:", user, token); // useEffect içinde
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit app.{user?.username}</Text>
      <Text style={styles.title}>Token: {token}</Text>
      
      {/* DÜZELTME: () => logout() */}
      <TouchableOpacity onPress={() => logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      
      <Link href="/(auth)/signup">Go to Signup</Link>
      <Link href="/(auth)">Go to Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "blue",
  },
});