/**
 * Maps duration strings to their equivalent in milliseconds.
 */
const VALID_DURATIONS = {
  '1h': 3600000,
  '6h': 21600000,
  '12h': 43200000,
  '24h': 86400000,
  '3d': 259200000,
  '7d': 604800000,
};

/**
 * Maps duration strings to human-readable labels.
 */
const DURATION_LABELS = {
  '1h': '1 Hour',
  '6h': '6 Hours',
  '12h': '12 Hours',
  '24h': '24 Hours',
  '3d': '3 Days',
  '7d': '7 Days',
};

module.exports = {
  VALID_DURATIONS,
  DURATION_LABELS,
};
