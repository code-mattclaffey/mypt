interface AISummaryCardProps {
  onClick: () => void;
}

export default function AISummaryCard({ onClick }: AISummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 border border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-3 flex-1">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-white mb-1">Weekly AI Summary</h3>
          <p className="text-blue-100 text-sm">
            Get personalized insights and goal adjustments from your AI trainer
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full mt-4 px-4 py-2 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all duration-200 font-medium cursor-pointer"
      >
        View Summary
      </button>
    </div>
  );
}