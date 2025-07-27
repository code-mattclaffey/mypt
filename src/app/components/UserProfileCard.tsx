import { UserProfile } from '../types';

interface UserProfileCardProps {
  userProfile: UserProfile;
  onEditProfile?: () => void;
}

export default function UserProfileCard({ userProfile, onEditProfile }: UserProfileCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 mb-1">Your Profile</h3>
          <p className="text-slate-300 text-sm">
            {userProfile.height}cm, {userProfile.sex}, {userProfile.weight}kg, 
            Activity Level: {userProfile.activityLevel}/5
          </p>
        </div>
      </div>
      {onEditProfile && (
        <button
          onClick={onEditProfile}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
}