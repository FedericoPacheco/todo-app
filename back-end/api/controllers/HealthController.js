/**
 * HealthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  isHealthy: async function (req, res) {
    return res.ok();
  },
};
