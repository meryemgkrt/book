import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import styles from "../../assets/styles/creat.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore.js";
import { API_URL } from "../../constants/api.js";

export default function create() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageBase64, setCoverImageBase64] = useState(null);

  const router = useRouter();
  const { token } = useAuthStore();

const handleSubmit = async () => {
  if (!title || !author || !caption || !coverImageBase64 || !rating) {
    Alert.alert(
      "Error",
      "Please fill all the fields and select a cover image."
    );
    return;
  }

  if (!token) {
    Alert.alert("Error", "You must be logged in to create a book.");
    return;
  }

  try {
    setLoading(true);
    const uriParts = coverImage.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const imageType = fileType ? `image/${fileType}` : "image/jpeg";

    const imageDataUrl = `data:${imageType};base64,${coverImageBase64}`;

    const res = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        author,
        caption,
        rating,
        image: imageDataUrl, 
      }),
    });

    const responseText = await res.text();

    if (!res.ok) {
      let errorMessage = "Failed to create book";
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${res.status}`;
      }
      throw new Error(errorMessage);
    }

    // Clear form
    setTitle("");
    setAuthor("");
    setCaption("");
    setRating(3);
    setCoverImage(null);
    setCoverImageBase64(null);

    
    router.replace("/(tabs)"); 
    
    setTimeout(() => {
      Alert.alert("Success", "Book created successfully!");
    }, 300);
    
  } catch (error) {
    console.error("Submit error:", error);
    Alert.alert(
      "Error",
      error.message || "Failed to create book. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={24}
            color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

const handleImagePicker = async () => {
  try {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need permission to access your photos."
        );
        return;
      }
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4], // ✅ Kitap kapağı oranı
      quality: 0.1, // ✅ 0.3 → 0.1 (çok daha küçük)
      base64: true, 
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
      setCoverImageBase64(result.assets[0].base64); 
    }
    
  } catch (error) {
    console.error("Image picker error:", error);
    Alert.alert("Error", "Failed to pick image");
  }
};
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.scrollViewStyle}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Book</Text>
            <Text style={styles.subtitle}>
              Share your favorite reads with others
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formGroup}>
              {/* Book Title */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Book Title</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter book title"
                    placeholderTextColor={COLORS.placeholderText}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </View>
              {/* Author Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Author Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter author name"
                    placeholderTextColor={COLORS.placeholderText}
                    value={author}
                    onChangeText={setAuthor}
                  />
                </View>
              </View>
              {/* Rating */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                {renderRatingPicker()}
              </View>
              {/* Image Picker */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Cover Image</Text>
                <TouchableOpacity
                  style={styles.imagePicker}
                  onPress={handleImagePicker}
                >
                  {coverImage ? (
                    <Image
                      source={{ uri: coverImage }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <Ionicons
                        name="image-outline"
                        size={48}
                        color={COLORS.textSecondary}
                      />
                      <Text style={styles.placeholderText}>
                        Tap to select an image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {/* Caption */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Caption</Text>
                <View
                  style={[styles.inputContainer, { alignItems: "flex-start" }]}
                >
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={20}
                    color={COLORS.textSecondary}
                    style={[styles.inputIcon, { marginTop: 12 }]}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      { height: 120, textAlignVertical: "top", paddingTop: 12 },
                    ]}
                    placeholder="Share your thoughts about this book..."
                    placeholderTextColor={COLORS.placeholderText}
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    numberOfLines={5}
                  />
                </View>
              </View>
              {/* Submit Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={20}
                      color={COLORS.white}
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>Share</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
