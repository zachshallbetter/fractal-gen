/**
 * @module solvers/solverSelector
 * @description Selects the appropriate solver based on the model and method
 * @since 1.1.5
 */

import { modelMethods as advectionDiffusionReactionMethods } from '../models/advectionDiffusionReactionModel.js';
import { modelMethods as fractionalSineGordonMethods } from '../models/fractionalSineGordonModel.js';
import { modelMethods as interpersonalRelationshipsMethods } from '../models/interpersonalRelationshipsModel.js';
import logger from '../utils/logger.js';

const modelSolvers = {
  advectionDiffusionReaction: advectionDiffusionReactionMethods,
  fractionalSineGordon: fractionalSineGordonMethods,
  interpersonalRelationships: interpersonalRelationshipsMethods,
};

/**
 * Selects the appropriate solver based on the given model and method.
 * @param {string} model - The model to use.
 * @param {string} method - The solver method to use.
 * @returns {Function} The selected solver function.
 * @throws {Error} If the solver for the specified model and method is not found.
 */
export function selectSolver(model, method) {
  const modelSolver = modelSolvers[model];
  if (!modelSolver) {
    logger.error(`Model "${model}" not found.`);
    throw new Error(`Model "${model}" not found.`);
  }

  const solver = modelSolver[method];
  if (!solver) {
    logger.error(`Method "${method}" not found for model "${model}".`);
    throw new Error(`Method "${method}" not found for model "${model}".`);
  }

  logger.info(`Selected solver: ${model} - ${method}`);
  return solver;
}

/**
 * Retrieves available models.
 * @returns {string[]} An array of available model names.
 */
export function getAvailableModels() {
  return Object.keys(modelSolvers);
}

/**
 * Retrieves available methods for a given model.
 * @param {string} model - The model name.
 * @returns {string[]} An array of available method names for the specified model.
 * @throws {Error} If the specified model is not found.
 */
export function getAvailableMethods(model) {
  const modelSolver = modelSolvers[model];
  if (!modelSolver) {
    throw new Error(`Model "${model}" not found.`);
  }
  return Object.keys(modelSolver);
}
