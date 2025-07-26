interface GoalProgressCardProps {
  progress: number;
  remaining: number;
  currentWeight: number;
  goalWeight: number;
  dailyTargets: { calories: number; steps: number };
}

export default function GoalProgressCard({ 
  progress, 
  remaining, 
  currentWeight, 
  goalWeight, 
  dailyTargets 
}: GoalProgressCardProps) {
  return (
    <div 
      className="rounded-xl p-4 border transition-all duration-300"
      style={{
        background: `linear-gradient(to right, 
          rgba(239, 68, 68, 0.1) 0%, 
          rgba(245, 158, 11, 0.1) 25%, 
          rgba(34, 197, 94, 0.1) 50%, 
          rgba(34, 197, 94, ${Math.min(progress / 100, 1)}) 100%
        )`,
        borderColor: progress > 75 ? '#22c55e' : progress > 50 ? '#f59e0b' : '#ef4444'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900 mb-1">Goal Progress</h3>
          <p className="text-gray-800 text-sm mb-2">
            Current: {currentWeight}kg → Goal: {goalWeight}kg
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                {progress.toFixed(1)}% complete
              </div>
              <div className="text-xs text-gray-600">
                ({remaining.toFixed(1)}kg remaining)
              </div>
            </div>
            <div className="text-xs text-gray-600">
              Daily targets: {dailyTargets.calories} cal • {dailyTargets.steps.toLocaleString()} steps
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}