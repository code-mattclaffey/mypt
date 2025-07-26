interface WelcomeScreenProps {
  onCreateProfile: () => void;
}

export default function WelcomeScreen({ onCreateProfile }: WelcomeScreenProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center h-full flex items-center justify-center">
      <div>
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome to Health Assistant</h2>
        <p className="text-gray-600 mb-6">
          Create your profile to start tracking your daily health metrics and get personalized insights.
        </p>
        <button
          onClick={onCreateProfile}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg cursor-pointer"
        >
          Create Your Profile
        </button>
      </div>
    </div>
  );
}