import { TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore.js';
import styles from "../assets/styles/profile.styles.js"
import { Ionicons } from '@expo/vector-icons';

// ✅ Named export (süslü parantezle import edilebilir)
export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: async () => {
            await logout();
            router.replace("/(auth)");
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={handleLogout}
    >
    
    <Ionicons name="log-out-outline" size={20} color="#fff" />
      <Text style={styles.logoutText}>
        Logout
      </Text>
    </TouchableOpacity>
  );
}