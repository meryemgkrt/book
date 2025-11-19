import { View, Text, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore.js'
import { API_URL } from '../../constants/api.js'
import styles from "../../assets/styles/home.styles.js"

export default function index() {
  const { user, token } = useAuthStore();

  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const res = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch books");

      setBooks(prevBooks => refresh ? data.books : [...prevBooks, ...data.books]);
      setHasMore(data.currentPage < data.totalPages);
      
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleMore = async () => {
    if (!hasMore || loading || refreshing) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchBooks(nextPage, false);
  };

  const handleRefresh = async () => {
    setPage(1);
    setHasMore(true);
    await fetchBooks(1, true);
  };

  const renderItem = ({ item }) => {
  // ✅ Önce user kontrolü yap
  if (!item.user) {
    console.warn('Book without user:', item._id);
    return null; // veya placeholder göster
  }

  return (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: item.user.profileImage || 'https://via.placeholder.com/40' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={styles.bookImageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.bookImage} 
          resizeMode="cover"
        />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>by {item.author}</Text>
        <Text style={styles.bookCaption}>{item.caption}</Text>
      </View>
    </View>
  );
};

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No books yet. Create your first book!</Text>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={books}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        onEndReachedThreshold={0.5}
       
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}