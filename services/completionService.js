const Progress = require('../models/Progress');
const Section = require('../models/Section');
const Reward = require('../models/Reward');
const Module = require('../models/Module');

/**
 * Checks if a module is 100% completed by a user and issues rewards
 * @param {string} userId 
 * @param {string} moduleId 
 */
const checkModuleCompletion = async (userId, moduleId) => {
    try {
        // 1. Get all sections for this module
        const totalSections = await Section.countDocuments({ moduleId });

        // 2. Get completed sections for this user in this module
        const completedSections = await Progress.countDocuments({
            userId,
            moduleId,
            status: 'COMPLETED'
        });

        // 3. If everything is completed, check or issue reward
        if (totalSections > 0 && totalSections === completedSections) {
            let reward = await Reward.findOne({ userId, moduleId });

            if (!reward) {
                // Issue new reward
                reward = await Reward.create({
                    userId,
                    moduleId,
                    badgeAwarded: true,
                    certificateIssued: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                });
                console.log(`🏆 Reward Issued: User ${userId} completed Module ${moduleId}`);
                return { isNewlyCompleted: true, reward };
            }
            return { isNewlyCompleted: false, reward };
        }

        return { isNewlyCompleted: false };
    } catch (err) {
        console.error('Error in completionService:', err);
    }
};

module.exports = { checkModuleCompletion };
