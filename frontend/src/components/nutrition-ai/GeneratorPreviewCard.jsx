export default function GeneratorPreviewCard({ plan }) {
  // Convertir yyyy-mm-dd -> dd-mm-yyyy pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // Si la date est déjà au format dd-mm-yyyy
    if (dateString.includes('/')) {
      return dateString.replace(/\//g, '-');
    }
    
    // Si la date est au format dd-mm-yyyy (correct)
    const dashParts = dateString.split('-');
    if (dashParts.length === 3 && dashParts[0].length <= 2) {
      return dateString;
    }
    
    // Si la date est au format yyyy-mm-dd (backend)
    if (dashParts.length === 3 && dashParts[0].length === 4) {
      return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
    }
    
    // Fallback: format complet
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  const formatObjective = (objective) => {
    const map = {
      LOSE_WEIGHT: 'Lose Weight',
      MAINTAIN: 'Maintain Weight',
      GAIN_MASS: 'Gain Muscle Mass',
      PERFORMANCE: 'Performance'
    };
    return map[objective] || objective;
  };

  return (
    <div className="bg-[#1a0733] rounded-lg p-6 border border-[#D6F93D]/20 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {plan.nutritionName || 'My AI Nutrition Plan'}
          </h2>

          <span className="inline-block px-3 py-1 bg-[#D6F93D]/20 text-[#D6F93D] text-sm font-semibold rounded-full">
            {formatObjective(plan.objective)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-[#D6F93D]">
            {plan.caloriesPerDay ?? "—"}
          </div>
          <div className="text-sm text-gray-400">calories/day</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="bg-[#2C0E4E] rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Start Date</p>
          <p className="text-white font-medium">{formatDate(plan.startDate)}</p>
        </div>
        <div className="bg-[#2C0E4E] rounded-lg p-4">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">End Date</p>
          <p className="text-white font-medium">{formatDate(plan.endDate)}</p>
        </div>
      </div>

      {plan.description && (
        <div className="mt-4 p-4 bg-[#2C0E4E] rounded-lg">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Description</p>
          <p className="text-white text-sm">{plan.description}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center">
        <span className="inline-flex items-center px-3 py-1 bg-[#D6F93D]/10 text-[#D6F93D] text-xs font-medium rounded-full">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
          AI Generated
        </span>
      </div>
    </div>
  );
}