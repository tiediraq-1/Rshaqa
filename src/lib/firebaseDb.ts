import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  arrayUnion,
  increment,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  UserProfile,
  MealLogEntry,
  WeightEntry,
  WorkoutLog,
  MoodLog,
  FoodItem,
  CommunityPost,
  CommunityComment
} from '../types';

// User Profile
export async function saveUserProfileToFirestore(userId: string, profile: UserProfile) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      ...profile,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

// Meal Logs
export async function saveMealLogToFirestore(userId: string, meal: MealLogEntry) {
  const path = `users/${userId}/mealLogs/${meal.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'mealLogs', meal.id), meal);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMealLogFromFirestore(userId: string, mealId: string) {
  const path = `users/${userId}/mealLogs/${mealId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'mealLogs', mealId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeMealLogs(userId: string, callback: (meals: MealLogEntry[]) => void) {
  const path = `users/${userId}/mealLogs`;
  const colRef = collection(db, 'users', userId, 'mealLogs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const meals: MealLogEntry[] = snapshot.docs.map((d) => d.data() as MealLogEntry);
      callback(meals);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Weight History
export async function saveWeightEntryToFirestore(userId: string, entry: WeightEntry) {
  const path = `users/${userId}/weightHistory/${entry.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'weightHistory', entry.id), entry);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeWeightHistory(userId: string, callback: (entries: WeightEntry[]) => void) {
  const path = `users/${userId}/weightHistory`;
  const colRef = collection(db, 'users', userId, 'weightHistory');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const entries: WeightEntry[] = snapshot.docs.map((d) => d.data() as WeightEntry);
      callback(entries);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Workout Logs
export async function saveWorkoutLogToFirestore(userId: string, log: WorkoutLog) {
  const path = `users/${userId}/workoutLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'workoutLogs', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWorkoutLogFromFirestore(userId: string, logId: string) {
  const path = `users/${userId}/workoutLogs/${logId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'workoutLogs', logId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeWorkoutLogs(userId: string, callback: (logs: WorkoutLog[]) => void) {
  const path = `users/${userId}/workoutLogs`;
  const colRef = collection(db, 'users', userId, 'workoutLogs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: WorkoutLog[] = snapshot.docs.map((d) => d.data() as WorkoutLog);
      callback(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Mood Logs
export async function saveMoodLogToFirestore(userId: string, log: MoodLog) {
  const path = `users/${userId}/moodLogs/${log.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'moodLogs', log.id), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeMoodLogs(userId: string, callback: (logs: MoodLog[]) => void) {
  const path = `users/${userId}/moodLogs`;
  const colRef = collection(db, 'users', userId, 'moodLogs');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: MoodLog[] = snapshot.docs.map((d) => d.data() as MoodLog);
      callback(logs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Custom Food Items
export async function saveFoodItemToFirestore(userId: string, food: FoodItem) {
  const path = `users/${userId}/foodDatabase/${food.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'foodDatabase', food.id), food);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeCustomFoods(userId: string, callback: (foods: FoodItem[]) => void) {
  const path = `users/${userId}/foodDatabase`;
  const colRef = collection(db, 'users', userId, 'foodDatabase');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const foods: FoodItem[] = snapshot.docs.map((d) => d.data() as FoodItem);
      callback(foods);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

// Community Posts
export async function saveCommunityPostToFirestore(post: CommunityPost) {
  const path = `communityPosts/${post.id}`;
  try {
    await setDoc(doc(db, 'communityPosts', post.id), post);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeCommunityPosts(callback: (posts: CommunityPost[]) => void) {
  const path = 'communityPosts';
  const colRef = collection(db, 'communityPosts');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const posts: CommunityPost[] = snapshot.docs.map((d) => d.data() as CommunityPost);
      callback(posts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function toggleLikeCommunityPost(postId: string, userLiked: boolean) {
  const path = `communityPosts/${postId}`;
  try {
    const docRef = doc(db, 'communityPosts', postId);
    await updateDoc(docRef, {
      likesCount: increment(userLiked ? -1 : 1),
      userLiked: !userLiked,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function addCommentToCommunityPost(postId: string, comment: CommunityComment) {
  const path = `communityPosts/${postId}`;
  try {
    const docRef = doc(db, 'communityPosts', postId);
    await updateDoc(docRef, {
      comments: arrayUnion(comment),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
