export interface ProfileDto {
    userId: string;         // links to User._id
    bio?: string;
    profileImage?: string;  // URL or path
}