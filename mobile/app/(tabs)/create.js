import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput, TouchableOpacity,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useReducer } from "react";
import styles from "../../assets/styles/creat.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";
import { useRouter } from "expo-router";

export default function create() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const pickImage = async () => { 
    // Image picker logic here

  };

  const hendleSubmit = async () => {};

  const renderRatingPicker=()=>{
    const stars=[];
    for (let i=1; i<=5; i++){
      stars.push(
        <TouchableOpacity
          key={i} onPress={()=>setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i<=rating ? "star" : "star-outline"}
            size={24}
            color={i<=rating ? "#f4b400":COLORS.textSecondary}
          />
        </TouchableOpacity>
      )
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  }

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
              {/* Reating */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                <View >
                  {renderRatingPicker()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
