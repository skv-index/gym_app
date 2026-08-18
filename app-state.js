// Centralized Shared App State Management for Gym App Prototype
(function () {
  const STORAGE_KEY = 'gym_app_state_v1';
  const TODAY_STR = new Date().toISOString().split('T')[0];

  const DEFAULT_STATE = {
    stepTrackingEnabled: true,
    activityCaloriesEnabled: true,
    dailySteps: 8450,
    dailyStepGoal: 10000,
    dailyCalories: 520,
    lastUpdatedDate: TODAY_STR
  };

  window.GymState = {
    get() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          this.save(DEFAULT_STATE);
          return { ...DEFAULT_STATE };
        }
        let state = JSON.parse(raw);
        // Date handling: reset daily values if new day
        if (state.lastUpdatedDate !== TODAY_STR) {
          state.dailySteps = 8450;
          state.dailyCalories = 520;
          state.lastUpdatedDate = TODAY_STR;
          this.save(state);
        }
        return state;
      } catch (e) {
        console.error('Error reading state:', e);
        return { ...DEFAULT_STATE };
      }
    },

    save(newState) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new CustomEvent('appStateChanged', { detail: newState }));
      } catch (e) {
        console.error('Error saving state:', e);
      }
    },

    update(fields) {
      const current = this.get();
      const updated = { ...current, ...fields, lastUpdatedDate: TODAY_STR };
      this.save(updated);
      return updated;
    },

    addDemoSteps(amount = 500) {
      const current = this.get();
      if (!current.stepTrackingEnabled) return current;
      const updatedSteps = current.dailySteps + amount;
      const updatedCalories = current.activityCaloriesEnabled ? current.dailyCalories + Math.round(amount * 0.05) : current.dailyCalories;
      return this.update({ dailySteps: updatedSteps, dailyCalories: updatedCalories });
    }
  };
})();
