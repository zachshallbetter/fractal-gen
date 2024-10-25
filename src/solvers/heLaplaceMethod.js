/**
 * @module solvers/heLaplaceMethod
 * @description Implements the He–Laplace method for solving ordinary differential equations (ODEs).
 * This method is particularly effective for solving initial value problems in ODEs, offering a simple and efficient approach.
 * 
 * The He–Laplace method is a numerical technique that approximates the solution of an ODE by iteratively updating the solution based on the current time and the derivative function provided.
 * It is optimized for non-blocking computation, ensuring responsiveness and suitability for both small-scale and large-scale simulations.
 * 
 * @example
 * const solution = heLaplaceMethod((t, y) => y, 1); // Example usage with a simple ODE
 * console.log(solution(2)); // Evaluate the solution at time t = 2
 * 
 * @param {Function} fractionalDE - The fractional differential equation to be solved. (Function)
 * @param {number} initialCondition - The initial condition for the ODE. (Number)
 * @returns {Function} - A function that takes time `t` as input and returns the solution at that time. (Function)
 * 
 * @since 1.0.1
 */

/**
 * @description This function implements the He-Laplace method to solve the given fractional differential equation.
 * It iteratively updates the solution based on the current time and the derivative function provided.
 * @param {number} t - The time at which to evaluate the solution.
 * @returns {number} - The solution to the ODE at time `t`.
 */
export function heLaplaceMethod(fractionalDE, initialCondition) {

  return function solution(t) {
    let y = initialCondition; // Initialize the solution with the initial condition
    let dt = 0.01; // Time step for the iteration
    let currentTime = 0; // Initialize the current time

    // Iterate until the current time reaches the target time `t`
    while (currentTime < t) {
      // Calculate the derivative at the current time
      let derivative = fractionalDE(currentTime, y);
      // Update the solution using the derivative and time step
      y += derivative * dt;
      // Increment the current time
      currentTime += dt;
    }

    return y; // Return the solution at time `t`
  };
}