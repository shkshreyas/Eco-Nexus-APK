import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post } from '@/components/community/Post';
import { AuthModal } from '@/components/auth/AuthModal';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Plus } from 'lucide-react-native';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string;
  };
  liked: boolean;
  comments: {
    id: string;
    content: string;
    profiles: {
      username: string;
    };
  }[];
};

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [user, setUser] = useState<any>(null); // Initialize as null
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Initialize user state with current user
    const { data: { user: currentUser } } = supabase.auth.getUser();
    setUser(currentUser);
    
    fetchPosts();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null); // Ensure null when no user
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          comments (
            id,
            content,
            profiles (username)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (posts) {
        const postsWithLikes = await Promise.all(
          posts.map(async (post) => {
            // Only check likes if user is authenticated
            if (user) {
              const { data: likes } = await supabase
                .from('likes')
                .select('id')
                .match({ post_id: post.id, user_id: user.id });

              return {
                ...post,
                liked: likes && likes.length > 0,
              };
            }
            
            return {
              ...post,
              liked: false,
            };
          })
        );

        setPosts(postsWithLikes);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = async () => {
    if (!newPostContent.trim() || !user) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content: newPostContent.trim(),
          user_id: user.id,
        });

      if (error) throw error;

      setNewPostContent('');
      setShowNewPost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Community Feed</Text>
          {user && (
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={() => setShowNewPost(true)}>
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {!user && (
          <TouchableOpacity
            style={styles.loginPrompt}
            onPress={() => setShowAuth(true)}>
            <Text style={styles.loginPromptText}>
              Login to interact with the community
            </Text>
          </TouchableOpacity>
        )}

        {showNewPost && (
          <View style={styles.newPostContainer}>
            <TextInput
              style={styles.newPostInput}
              placeholder="Share your eco-journey..."
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleNewPost}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.feed}>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onLike={fetchPosts}
            />
          ))}
        </View>
      </ScrollView>

      <AuthModal
        visible={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  newPostButton: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginPromptText: {
    color: '#22C55E',
    fontSize: 16,
    fontWeight: '600',
  },
  newPostContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newPostInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  feed: {
    padding: 20,
  },
});