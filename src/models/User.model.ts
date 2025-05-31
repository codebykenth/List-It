export interface User {
  id?: number | null;
  name: string;
  email: string;
  profile_image_url?: string | null; // URL of the profile image
  profile_image?: File | null; // Optional file for profile image upload
}