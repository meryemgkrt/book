import { View, Text, Alert, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { API_URL } from '../../constants/api.js'
import { useAuthStore } from '../../store/authStore.js'
import { useRouter } from 'expo-router'
import styles from '../../assets/styles/profile.styles.js'
import { Image } from "expo-image"
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/Colors.js'

export default function Profile() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const router = useRouter()
  const { token, user, logout } = useAuthStore()
  
  const fetchData = async (pageNum = 1, isRefresh = false) => {
    if (!user?.id) {
      Alert.alert("Error", "Please log in again");
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const url = `${API_URL}/books/user/${user.id}?page=${pageNum}&limit=10`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      
      if (isRefresh || pageNum === 1) {
        setBooks(data.books);
      } else {
        setBooks(prev => [...prev, ...data.books]);
      }
      
      setTotalPages(data.totalPages);
      setPage(pageNum);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load books");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    fetchData(1, true);
  };

  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      fetchData(page + 1);
    }
  };

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

  const handleDelete = async (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/books/${bookId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });

              if (!response.ok) {
                throw new Error("Failed to delete book");
              }

              setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
              Alert.alert("Success", "Book deleted successfully");
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Failed to delete book");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };
  
  useEffect(() => {
    if (token && user?.id) {
      fetchData(1);
    }
  }, [token, user]);

  const renderRatingStars = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={{ fontSize: 14, marginRight: 2 }}>
            {star <= rating ? '⭐' : '☆'}
          </Text>
        ))}
        <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '600' }}>
          {rating}/5
        </Text>
      </View>
    );
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>by {item.author}</Text>
        {renderRatingStars(item.rating)}
        <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
        <Text style={styles.bookDate}>
          📅 {formatDate(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.profileImage }} 
          style={styles.profileImage} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.memberSince}>
            👤 Member since {formatMemberSince(user?.createdAt || new Date())}
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>

      {/* Books Header with Add Button */}
      <View style={styles.booksHeader}>
        <View>
          <Text style={styles.booksTitle}>📚 My Books</Text>
          <Text style={styles.booksCount}>{books.length} Books</Text>
        </View>
        {/* ✅ Add Button eklendi */}
        <TouchableOpacity 
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
          onPress={() => router.push('/(tabs)/create')}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
            Add Book
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || books.length === 0) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }; 

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ fontSize: 60 }}>📖</Text>
      <Text style={styles.emptyText}>
        You haven't added any books yet.{'\n'}
        Start building your library!
      </Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/create')}
      >
        <Text style={styles.addButtonText}>➕ Add Book</Text>
      </TouchableOpacity>
    </View>
  ); 

  if (isLoading && books.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBook}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}