import { UserProfile } from '../types';

interface UserProfileCardProps {
  userProfile: UserProfile;
}

export default function UserProfileCard({ userProfile }: UserProfileCardProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-green-900 mb-1">Your Profile</h3>
          <p className="text-green-800 text-sm">
            {userProfile.height}cm, {userProfile.sex}, {userProfile.weight}kg, 
            Activity Level: {userProfile.activityLevel}/5
          </p>
        </div>
      </div>
    </div>
  );
}