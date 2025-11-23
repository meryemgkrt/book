import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore.js";
import { API_URL } from "../../constants/api.js";
import styles from "../../assets/styles/home.styles.js";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors.js";

export default function index() {
  const { user, token } = useAuthStore();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
        setPage(1);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const res = await fetch(`${API_URL}/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to fetch books");

      if (refresh || pageNum === 1) {
        setBooks(data.books);
        setPage(2);
      } else {
        const newBooks = data.books.filter(
          (newBook) => !books.some((book) => book._id === newBook._id)
        );
        setBooks((prev) => [...prev, ...newBooks]);
        setPage(pageNum + 1);
      }

      setHasMore(data.currentPage < data.totalPages);
      
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const handleLoadMore = () => {
    if (!hasMore || loading || refreshing) return;
    fetchBooks(page, false);
  };

  const handleRefresh = () => {
    setBooks([]);
    setHasMore(true);
    setSearchQuery("");
    setSearchVisible(false);
    fetchBooks(1, true);
  };

  const formatPublishDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const getFilteredBooks = () => {
    if (!searchQuery.trim()) return books;
    
    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.caption?.toLowerCase().includes(query)
    );
  };

  // ✅ Notification handler
  const handleNotifications = () => {
    Alert.alert(
      "📬 Notifications",
      "You have 3 new notifications:\n\n📚 John liked your book\n⭐ Sarah gave 5 stars\n💬 Mike commented on your post",
      [{ text: "OK" }]
    );
  };

  const renderItem = ({ item }) => {
    if (!item.user) return null;

    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.bookInfo}>
            <Image
              source={{ uri: item.user.profileImage }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.user.username}</Text>
          </View>
        </View>
        <View style={styles.bookImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.bookImage}
            contentFit="cover"
          />
        </View>
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>by {item.author}</Text>
          <View style={styles.ratingContainer}>
            {renderRatingStars(item.rating)}
          </View>
          <Text style={styles.caption}>{item.caption}</Text>
          <Text style={styles.date}>
            Shared on: {formatPublishDate(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    if (loading && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyText}>
          {searchQuery ? "No books found" : "No books yet"}
        </Text>
        <Text style={styles.emptySubtext}>
          {searchQuery ? "Try a different search" : "Be the first to share a book!"}
        </Text>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Ionicons name="book" size={26} color="#4A90E2" />
            <Text style={styles.wormEmoji}>🐛</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>BookWorm</Text>
            <Text style={styles.headerSubtitle}>Share your reading journey</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={handleNotifications}
            style={styles.iconButton}
          >
            <View style={styles.notificationWrapper}>
              <Ionicons 
                name="notifications-outline" 
                size={24} 
                color="#333" 
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
            <Ionicons 
              name={searchVisible ? "close" : "search-outline"} 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {searchVisible && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title, author, or caption..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading books...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={getFilteredBooks()}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}