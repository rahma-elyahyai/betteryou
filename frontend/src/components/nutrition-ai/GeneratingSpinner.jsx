// FILE: src/components/nutrition-ai/GeneratingSpinner.jsx
export default function GeneratingSpinner() {
  return (
    <div className="flex justify-center">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[#D6F93D]/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#D6F93D] rounded-full animate-spin"></div>
        <div className="absolute inset-3 border-4 border-transparent border-t-[#D6F93D]/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
    </div>
  );
}