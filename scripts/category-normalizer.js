const stringSimilarity = require('string-similarity');

// Basic text normalizer
function normalizeText(s) {
  if (!s) return '';
  return s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')      // remove punctuation
    .replace(/\s+/g, ' ')           // collapse spaces
    .replace(/\s+(tools|tool)\s*$/, ' tools') // normalize tool suffix
    .replace(/^(tools|tool)\s+/, 'tools ');   // normalize tool prefix
}

// Canonical categories list (can be expanded or moved to Firestore)
const canonicalCategories = [
  'hand tools',
  'power tools', 
  'measuring tools',
  'cutting tools',
  'fasteners',
  'safety equipment',
  'electrical tools',
  'plumbing tools',
  'automotive tools',
  'woodworking tools',
  'gardening tools',
  'welding tools',
  'painting tools',
  'cleaning tools',
  'storage solutions',
  'test equipment',
  'dies taps',
  'hammers',
  'screwdrivers',
  'wrenches',
  'pliers',
  'saws',
  'drills',
  'grinders',
  'sanders'
];

// Map raw category to canonical using similarity
function mapToCanonical(rawCategory) {
  const normalized = normalizeText(rawCategory);
  
  // Quick exact match
  const exact = canonicalCategories.find(c => normalizeText(c) === normalized);
  if (exact) return { category: exact, score: 1, method: 'exact' };

  // Fuzzy match
  const matches = stringSimilarity.findBestMatch(normalized, canonicalCategories);
  const best = matches.bestMatch;
  
  return { 
    category: best.target, 
    score: best.rating, 
    method: 'fuzzy',
    original: rawCategory,
    normalized: normalized
  };
}

// Process categories with confidence thresholds
function processCategory(rawCategory, options = {}) {
  const { 
    autoAcceptThreshold = 0.8, 
    reviewThreshold = 0.5,
    createNewThreshold = 0.3 
  } = options;
  
  const mapping = mapToCanonical(rawCategory);
  
  let action = 'reject';
  if (mapping.score >= autoAcceptThreshold) {
    action = 'auto_accept';
  } else if (mapping.score >= reviewThreshold) {
    action = 'review';
  } else if (mapping.score >= createNewThreshold) {
    action = 'create_new';
  }
  
  return {
    ...mapping,
    action,
    confidence: mapping.score
  };
}

// Batch process multiple categories
function processCategories(rawCategories, options = {}) {
  const results = rawCategories.map(cat => processCategory(cat, options));
  
  const summary = {
    total: results.length,
    autoAccepted: results.filter(r => r.action === 'auto_accept').length,
    needReview: results.filter(r => r.action === 'review').length,
    createNew: results.filter(r => r.action === 'create_new').length,
    rejected: results.filter(r => r.action === 'reject').length
  };
  
  return {
    results,
    summary,
    unmatchedCategories: results.filter(r => r.action !== 'auto_accept')
  };
}

module.exports = {
  normalizeText,
  mapToCanonical,
  processCategory,
  processCategories,
  canonicalCategories
};
