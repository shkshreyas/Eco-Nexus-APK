import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Heart, MessageCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

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

interface PostProps {
  post: Post;
  onLike: () => void;
}

export function Post({ post, onLike }: PostProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    try {
      if (post.liked) {
        await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, user_id: supabase.auth.getUser()?.id });
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: post.id, user_id: supabase.auth.getUser()?.id });
      }
      onLike();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    
    setLoading(true);
    try {
      await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: supabase.auth.getUser()?.id,
          content: comment.trim(),
        });
      setComment('');
      setIsCommenting(false);
      onLike(); // Refresh post data
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: post.profiles.avatar_url }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>{post.profiles.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <Text style={styles.postText}>{post.content}</Text>
      
      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          style={styles.postImage}
        />
      )}
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={20}
            color={post.liked ? '#EF4444' : '#6B7280'}
            fill={post.liked ? '#EF4444' : 'transparent'}
          />
          <Text style={styles.actionText}>{post.likes_count}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsCommenting(!isCommenting)}>
          <MessageCircle size={20} color="#6B7280" />
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </TouchableOpacity>
      </View>

      {isCommenting && (
        <View style={styles.commentSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleComment}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.commentButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {post.comments?.map((comment) => (
        <View key={comment.id} style={styles.commentContainer}>
          <Text style={styles.commentUsername}>{comment.profiles.username}</Text>
          <Text style={styles.commentContent}>{comment.content}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  timestamp: {
    fontSize: 14,
    color: '#6B7280',
  },
  postText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6B7280',
  },
  commentSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  commentButton: {
    backgroundColor: '#22C55E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  commentContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#374151',
  },
});