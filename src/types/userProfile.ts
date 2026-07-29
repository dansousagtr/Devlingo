export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string | null;
}

export interface CreateUserProfileData {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserProfileResult {
  userId?: string;
  profile?: UserProfile;
  error?: Error;
}
