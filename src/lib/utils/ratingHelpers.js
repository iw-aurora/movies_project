/**
 * Rating Logic Helper
 * 
 * Implements a weighted combination of TMDB data (prior) and User Ratings (observed).
 * - Generates a 5-star distribution from TMDB scores using Gaussian Normal Distribution.
 * - Merges this with real user ratings using a Bayesian-like approach where TMDB acts as a prior.
 */

// CONFIGURATION
// varying this constant changes how "strong" the TMDB baseline is.
// A value of 50 means the TMDB rating holds the weight of 50 "virtual" user votes.
// User votes will rapidly shift the average once they exceed a fraction of this count.
const TMDB_PRIOR_WEIGHT = 50;
const TMDB_SIGMA = 1.1; // Standard deviation for Gaussian estimation

/**
 * Calculates the Cumulative Distribution Function (CDF) for a Normal Distribution
 * @param {number} x - The value to evaluate
 * @param {number} mean - The mean of the distribution
 * @param {number} sigma - The standard deviation
 */
function cdf(x, mean, sigma) {
    return 0.5 * (1 + errorFunction((x - mean) / (sigma * Math.sqrt(2))));
}

/**
 * Approximation of the error function (erf)
 * Needed for CDF calculation.
 */
function errorFunction(x) {
    // Constants for approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    let sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

/**
 * Generates an estimated count for each star bucket (1-5) based on TMDB score.
 * Maps 0-10 scale to 5 buckets: 
 * 1 Star: 0-2
 * 2 Star: 2-4
 * 3 Star: 4-6
 * 4 Star: 6-8
 * 5 Star: 8-10
 * 
 * @param {number} tmdbRating - Average rating from TMDB (0-10)
 * @param {number} weight - The total "virtual" weight to distribute
 * @returns {Object} Map of star (1-5) to count
 */
function getEstimatedDistribution(tmdbRating, weight) {
    const distribution = {};

    // Calculate probability for each bucket
    for (let star = 1; star <= 5; star++) {
        const lowerBound = (star - 1) * 2;
        const upperBound = star * 2;

        // Probability mass in this range
        const prob = cdf(upperBound, tmdbRating, TMDB_SIGMA) - cdf(lowerBound, tmdbRating, TMDB_SIGMA);

        distribution[star] = prob * weight;
    }

    // Normalize to ensure exact sum matches weight (correcting float errors)
    const currentSum = Object.values(distribution).reduce((a, b) => a + b, 0);
    if (currentSum > 0) {
        for (let star = 1; star <= 5; star++) {
            distribution[star] = (distribution[star] / currentSum) * weight;
        }
    }

    return distribution;
}

/**
 * Main function to calculate aggregated rating stats
 * 
 * @param {number} tmdbRating - TMDB Vote Average (0-10)
 * @param {number} tmdbCount - TMDB Vote Count
 * @param {Array} userComments - Array of comment objects with 'rating' property
 * @returns {Object} { average, totalDisplay, breakdown, debugInfo }
 */
export function calculateMovieRating(tmdbRating = 0, tmdbCount = 0, userComments = []) {
    // 1. Get Baseline (Prior) Data
    // If we have absolutely no data, default to neutral
    const safeTmdbRating = tmdbRating || 5;

    // 2. Generate Virtual Distributions
    // We treat TMDB data as a fixed-weight prior estimate
    const virtualCounts = getEstimatedDistribution(safeTmdbRating, TMDB_PRIOR_WEIGHT);

    // 3. Add Real User Data
    // User ratings are 1-5 stars. We assume 1 star = ~2 points, 5 stars = ~10 points for the bucket mapping
    const realCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let userSum = 0;
    const userTotal = userComments.length;

    userComments.forEach(comment => {
        let r = Number(comment.rating);
        // Safety check for invalid ratings, clamp to 1-5
        if (isNaN(r) || r < 1) r = 1;
        if (r > 5) r = 5;

        realCounts[r] = (realCounts[r] || 0) + 1;
        userSum += r; // Sum of stars (1-5 scale)
    });

    // 4. Combine Pools
    const combinedCounts = {};
    let totalWeightedCount = 0;
    let totalWeightedScore10Scale = 0;

    for (let star = 1; star <= 5; star++) {
        const vCount = virtualCounts[star] || 0;
        const rCount = realCounts[star] || 0;

        const combined = vCount + rCount; // Weighted combination
        combinedCounts[star] = combined;
        totalWeightedCount += combined;

        // Calculate score contribution
        // For average calculation, we approximate the "value" of a Star bucket.
        // 1 star ~ 2 pts, 5 stars ~ 10 pts.
        // However, to be more precise for the TMDB part:
        // The TMDB Average is already known: `tmdbRating`.
        // The User Average is `userSum / userTotal` (on 5 scale) -> `(userSum / userTotal) * 2` (on 10 scale).
    }

    // 5. Calculate Weighted Average
    // Avg = (PriorWeight * PriorMean + UserCount * UserMean) / (PriorWeight + UserCount)
    // Note: We convert User Mean (1-5) to 0-10 scale by multiplying by 2
    const userScore10Scale = userTotal > 0 ? (userSum / userTotal) * 2 : 0;

    const finalAverage = (
        (TMDB_PRIOR_WEIGHT * safeTmdbRating) +
        (userTotal * userScore10Scale)
    ) / (TMDB_PRIOR_WEIGHT + userTotal);


    // 6. Calculate Breakdown Percentages
    // This uses the Combined Counts (Virtual + Real) to show the distribution
    const breakdown = [5, 4, 3, 2, 1].map(star => {
        const count = combinedCounts[star] || 0;
        const percentage = totalWeightedCount > 0 ? (count / totalWeightedCount) * 100 : 0;
        return {
            stars: star,
            percentage: Math.round(percentage),
            count: Math.round(count) // This might be a float for virtual, but rounds for UI
            // Note: displaying "count" might look weird if we show the virtual numbers.
            // The UI seems to ignore the explicit 'count' text in the bars (it shows percentage).
        };
    });

    return {
        average: finalAverage.toFixed(1), // format 0.0 - 10.0
        total: tmdbCount + userTotal,     // Display real total votes
        userCount: userTotal,
        breakdown, // Array of { stars, percentage }
        isEstimate: userTotal === 0,
        tmdbRating: safeTmdbRating
    };
}
