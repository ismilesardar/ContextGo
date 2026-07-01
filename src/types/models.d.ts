export interface IUser {
  email: string;
  password: string;
  role: 'owner' | 'moderator' | 'member' | 'viewer';
  isEmailVerified: boolean;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  loginCount: number;
  username?: string | null | undefined;
  lastLogin?: NativeDate | null | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  profile?: {
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    avatar?: string | null | undefined;
    bio?: string | null | undefined;
    dateOfBirth?: NativeDate | null | undefined;
    gender?: 'Male' | 'Female' | 'Other';
    phoneNumber?: string;
  };
  address?: {
    street?: string | null | undefined;
    city?: string | null | undefined;
    state?: string | null | undefined;
    country?: string | null | undefined;
    zipCode?: string | null | undefined;
  };
  socials?: {
    twitter?: string | null | undefined;
    linkedIn?: string | null | undefined;
    github?: string | null | undefined;
    facebook?: string | null | undefined;
    youtube?: string | null | undefined;
    instagram?: string | null | undefined;
  };
}
