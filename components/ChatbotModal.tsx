import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  MessageSquare,
  Send,
  X,
  Sparkles,
  Leaf,
  RefreshCw,
} from 'lucide-react-native';
import { useTheme } from '@/context/theme';
import {
  generateSustainabilityResponse,
  getRandomSustainabilityQuestions,
} from '@/lib/gemini';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hello! I'm your EcoNexus sustainability assistant powered by Gemini. How can I help you with environmental sustainability today?",
    sender: 'bot',
    timestamp: new Date(),
  },
];

export default function ChatbotModal() {
  const { colors, isDark } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const lastMessageRef = useRef<string>('');

  // Simple periodic network check using fetch timeout
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://www.google.com', {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        setIsConnected(response.ok);
      } catch (error) {
        console.log('Connectivity check failed:', error);
        setIsConnected(false);
      }
    };

    // Initial check
    checkConnectivity();

    // Set up periodic check every 30 seconds
    const intervalId = setInterval(checkConnectivity, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Load suggestions when the component mounts
  useEffect(() => {
    setSuggestions(getRandomSustainabilityQuestions(3));
  }, []);

  // Animate the button when not in use
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    if (!modalVisible) {
      pulseAnimation.start();
    } else {
      pulseAnimation.stop();
      Animated.timing(buttonAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    return () => pulseAnimation.stop();
  }, [modalVisible]);

  // Reset suggestions when the modal is closed
  useEffect(() => {
    if (!modalVisible) {
      setSuggestions(getRandomSustainabilityQuestions(3));
    }
  }, [modalVisible]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const buttonRotate = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const buttonOpacity = buttonAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.8, 1],
  });

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        'You appear to be offline. Connect to the internet to use the chatbot.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Save for potential retry
    lastMessageRef.current = text.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Get response from Gemini
      const response = await generateSustainabilityResponse(text.trim());

      const botMessage: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Update suggestions after each successful exchange
      setSuggestions(getRandomSustainabilityQuestions(3));
    } catch (error) {
      console.error('Error getting response:', error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "I'm having trouble connecting to my knowledge base. Please check your internet connection and try again.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastMessageRef.current) {
      // Remove the error message
      setMessages((prev) => prev.filter((msg) => !msg.isError));
      // Retry the last query
      handleSend(lastMessageRef.current);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    handleSend(suggestion);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isBot = item.sender === 'bot';
    const isErrorMessage = item.isError;

    return (
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: isBot
              ? isErrorMessage
                ? isDark
                  ? 'rgba(220, 38, 38, 0.2)'
                  : '#FEE2E2'
                : isDark
                ? colors.elevated
                : '#F3F4F6'
              : colors.primary,
            alignSelf: isBot ? 'flex-start' : 'flex-end',
          },
        ]}
      >
        {isBot && (
          <View style={styles.botIconContainer}>
            <Leaf
              size={16}
              color={isErrorMessage ? '#DC2626' : colors.primary}
            />
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            {
              color: isBot
                ? isErrorMessage
                  ? isDark
                    ? '#FCA5A5'
                    : '#B91C1C'
                  : colors.text
                : '#FFFFFF',
            },
          ]}
        >
          {item.text}
        </Text>

        {isErrorMessage && (
          <TouchableOpacity
            style={[
              styles.retryButton,
              {
                backgroundColor: isDark ? 'rgba(220, 38, 38, 0.5)' : '#FEE2E2',
              },
            ]}
            onPress={handleRetry}
          >
            <RefreshCw size={14} color={isDark ? '#FCA5A5' : '#DC2626'} />
            <Text
              style={{
                color: isDark ? '#FCA5A5' : '#DC2626',
                marginLeft: 4,
                fontSize: 12,
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        )}

        <Text
          style={[
            styles.timestamp,
            {
              color: isBot ? colors.secondaryText : 'rgba(255, 255, 255, 0.8)',
            },
          ]}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0 || messages.length > 2) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestionsContainer}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.suggestionChip,
              { backgroundColor: isDark ? colors.elevated : '#F3F4F6' },
            ]}
            onPress={() => handleSuggestionPress(suggestion)}
          >
            <Text
              style={[styles.suggestionText, { color: colors.text }]}
              numberOfLines={2}
            >
              {suggestion}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          {
            transform: [{ scale: buttonScale }, { rotate: buttonRotate }],
            opacity: buttonOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.chatButton, { backgroundColor: colors.primary }]}
          onPress={() => setModalVisible(true)}
        >
          <MessageSquare size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: 'rgba(0,0,0,0.5)' },
            ]}
          >
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.background },
              ]}
            >
              <View
                style={[styles.header, { backgroundColor: colors.primary }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sparkles size={20} color="#FFFFFF" />
                  <Text style={styles.headerTitle}>EcoNexus Assistant</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.chatContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ padding: 16 }}
                  ListFooterComponent={
                    isTyping ? (
                      <View
                        style={[
                          styles.loadingContainer,
                          {
                            backgroundColor: isDark
                              ? colors.elevated
                              : '#F3F4F6',
                          },
                        ]}
                      >
                        <ActivityIndicator
                          size="small"
                          color={colors.primary}
                        />
                        <Text
                          style={[
                            styles.loadingText,
                            { color: colors.secondaryText },
                          ]}
                        >
                          EcoNexus is typing...
                        </Text>
                      </View>
                    ) : null
                  }
                />

                {renderSuggestions()}

                {!isConnected && (
                  <View
                    style={[
                      styles.offlineBar,
                      {
                        backgroundColor: isDark
                          ? 'rgba(220, 38, 38, 0.2)'
                          : '#FEE2E2',
                      },
                    ]}
                  >
                    <Text style={{ color: isDark ? '#FCA5A5' : '#DC2626' }}>
                      No internet connection
                    </Text>
                  </View>
                )}

                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.card,
                      borderTopColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    ref={inputRef}
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? colors.elevated : '#F3F4F6',
                        color: colors.text,
                      },
                    ]}
                    placeholder="Ask about sustainability..."
                    placeholderTextColor={colors.secondaryText}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={() => handleSend()}
                    editable={!isTyping && isConnected}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      {
                        backgroundColor:
                          isTyping || !input.trim() || !isConnected
                            ? isDark
                              ? 'rgba(34, 197, 94, 0.5)'
                              : '#D1FAE5'
                            : colors.primary,
                      },
                    ]}
                    onPress={() => handleSend()}
                    disabled={isTyping || !input.trim() || !isConnected}
                  >
                    <Send size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 90, // Position above tab bar with enough space
    right: 20,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  botIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
    maxWidth: '80%',
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  suggestionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    maxWidth: width * 0.6,
  },
  suggestionText: {
    fontSize: 14,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  offlineBar: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
