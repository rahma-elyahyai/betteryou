export default function GeneratorForm({ values, onChange, onSubmit, loading, error, userData }) {
  // Date formatting helper - converts DD-MM-YYYY to YYYY-MM-DD for input
  const formatDateForInput = (ddmmyyyy) => {
    if (!ddmmyyyy) return '';
    const parts = ddmmyyyy.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Date formatting helper - converts YYYY-MM-DD to DD-MM-YYYY for display
  const formatDateForDisplay = (yyyymmdd) => {
    if (!yyyymmdd) return '';
    const parts = yyyymmdd.split('-');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // Calculates end date as start date + 7 days
  const calculateEndDate = (startDateDDMMYYYY) => {
    if (!startDateDDMMYYYY) return '';
    const parts = startDateDDMMYYYY.split('-');
    if (parts.length !== 3) return '';
    
    const date = new Date(parts[2], parts[1] - 1, parts[0]);
    date.setDate(date.getDate() + 7);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  };

  // Handles start date change and auto-calculates end date
  const handleStartDateChange = (e) => {
    const yyyymmdd = e.target.value;
    const ddmmyyyy = formatDateForDisplay(yyyymmdd);
    onChange('startDate', ddmmyyyy);
    
    const calculatedEndDate = calculateEndDate(ddmmyyyy);
    onChange('endDate', calculatedEndDate);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  const objectives = [
    { value: 'MAINTAIN', label: 'Maintain Weight', icon: '⚖️', color: 'blue' },
    { value: 'LOSE_WEIGHT', label: 'Lose Weight', icon: '🔥', color: 'red' },
    { value: 'GAIN_MASS', label: 'Gain Muscle Mass', icon: '💪', color: 'green' },
    { value: 'PERFORMANCE', label: 'Performance', icon: '⚡', color: 'yellow' }
  ];

  return (
    <div className="bg-[#1a0733] rounded-lg p-8 border border-[#D6F93D]/20">
      {/* ========================================
          USER INFO SECTION (Read-Only)
          - Displays: First Name, Last Name
          - Style: Disabled gray inputs in purple box
          ======================================== */}
      {userData && (
        <div className="mb-6 p-4 bg-[#2C0E4E] rounded-lg border border-[#D6F93D]/10">
          <h3 className="text-sm font-semibold text-[#D6F93D] mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            Your Profile
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">First Name</label>
              <input
                type="text"
                value={userData.firstName || 'N/A'}
                readOnly
                disabled
                className="w-full mt-1 px-3 py-2 bg-[#1a0733] border border-[#D6F93D]/20 rounded text-white text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400">Last Name</label>
              <input
                type="text"
                value={userData.lastName || 'N/A'}
                readOnly
                disabled
                className="w-full mt-1 px-3 py-2 bg-[#1a0733] border border-[#D6F93D]/20 rounded text-white text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          YOUR GOALS SECTION
          ======================================== */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#D6F93D] mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Your Goals
        </h2>

        <div className="space-y-6">
          {/* ========================================
              OBJECTIVE CARDS (4 buttons in 2x2 grid)
              - Shows: Icon + Label for each goal
              - Selected: Lime border + lime bg tint
              - Unselected: Gray border + purple bg
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Main Goal <span className="text-[#D6F93D]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {objectives.map((obj) => (
                <button
                  key={obj.value}
                  type="button"
                  onClick={() => onChange('objective', obj.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    values.objective === obj.value
                      ? 'border-[#D6F93D] bg-[#D6F93D]/10'
                      : 'border-[#D6F93D]/20 bg-[#2C0E4E] hover:border-[#D6F93D]/40'
                  }`}
                >
                  <div className="text-3xl mb-2">{obj.icon}</div>
                  <div className="text-white font-medium text-sm">{obj.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ========================================
              START DATE INPUT
              - Displays: dd-mm-yyyy format
              - Clicking opens native date picker
              - Auto-calculates end date on change
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date <span className="text-[#D6F93D]">*</span>
            </label>
            <input
              type="text"
              value={values.startDate}
              readOnly
              onClick={(e) => {
                const input = document.createElement('input');
                input.type = 'date';
                input.value = formatDateForInput(values.startDate);
                input.style.position = 'absolute';
                input.style.opacity = '0';
                document.body.appendChild(input);
                input.showPicker();
                input.addEventListener('change', (ev) => {
                  handleStartDateChange(ev);
                  document.body.removeChild(input);
                });
                input.addEventListener('blur', () => {
                  setTimeout(() => {
                    if (document.body.contains(input)) {
                      document.body.removeChild(input);
                    }
                  }, 100);
                });
              }}
              placeholder="dd-mm-yyyy"
              className="w-full px-4 py-3 bg-[#2C0E4E] border border-[#D6F93D]/30 rounded-lg text-white focus:outline-none focus:border-[#D6F93D] transition cursor-pointer"
              required
            />
          </div>

          {/* ========================================
              END DATE (Auto-calculated, disabled)
              - Always shows start date + 7 days
              - Grayed out, cannot be edited
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date <span className="text-[#D6F93D]">*</span>
            </label>
            <input
              type="text"
              value={values.endDate}
              readOnly
              disabled
              placeholder="dd-mm-yyyy"
              className="w-full px-4 py-3 bg-[#2C0E4E]/50 border border-[#D6F93D]/20 rounded-lg text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* ========================================
              DAILY CALORIES SLIDER
              - Range: 1200-5000 kcal (step: 50)
              - Shows: Slider + numeric input + "kcal" label
              - Both controls synchronized
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Daily Calories Target <span className="text-[#D6F93D]">*</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                value={values.caloriesPerDay}
                onChange={(e) => onChange('caloriesPerDay', e.target.value)}
                min="1200"
                max="5000"
                step="50"
                className="flex-1 h-2 bg-[#2C0E4E] rounded-lg appearance-none cursor-pointer accent-[#D6F93D]"
              />
              <input
                type="number"
                value={values.caloriesPerDay}
                onChange={(e) => onChange('caloriesPerDay', e.target.value)}
                min="1200"
                max="5000"
                className="w-24 px-3 py-2 bg-[#2C0E4E] border border-[#D6F93D]/30 rounded-lg text-white text-center focus:outline-none focus:border-[#D6F93D] transition"
                required
              />
              <span className="text-gray-400 text-sm">kcal</span>
            </div>
          </div>

          {/* ========================================
              PROGRAM NAME (Optional)
              - Text input for custom plan name
              - Example: "Muscle Gain January 2025"
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Program Name <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={values.programName || ''}
              onChange={(e) => onChange('programName', e.target.value)}
              placeholder="e.g., Muscle Gain January 2025"
              className="w-full px-4 py-3 bg-[#2C0E4E] border border-[#D6F93D]/30 rounded-lg text-white focus:outline-none focus:border-[#D6F93D] transition"
            />
          </div>

          {/* ========================================
              DESCRIPTION (Optional)
              - Textarea for notes/preferences
              - 3 rows tall
              ======================================== */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={values.description || ''}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Add any notes or preferences..."
              rows="3"
              className="w-full px-4 py-3 bg-[#2C0E4E] border border-[#D6F93D]/30 rounded-lg text-white focus:outline-none focus:border-[#D6F93D] transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================
          ERROR MESSAGE (if any)
          - Red background with border
          - Only shows when error exists
          ======================================== */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* ========================================
          SUBMIT BUTTON
          - Lime green with rocket icon
          - Shows spinner when loading
          - Disabled when missing required fields
          ======================================== */}
      <button
        onClick={handleFormSubmit}
        disabled={loading || !values.startDate || !values.objective}
        className="w-full py-4 bg-[#D6F93D] text-[#2C0E4E] rounded-lg font-semibold hover:bg-[#c5e834] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-[#D6F93D]/20"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Generate My AI Nutrition Program
          </>
        )}
      </button>

      {/* ========================================
          VALIDATION HELPER TEXT
          - Only shows when form is incomplete
          ======================================== */}
      {(!values.startDate || !values.objective) && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Please complete all required fields (marked with *)
        </p>
      )}
    </div>
  );
}