/**
 * TypeScript implementation of SPICE rotation matrix functions
 * Based on JPL SPICE rotate.c, rotmat.c, and eul2m.c
 */

import { Matrix3x3, Matrix6x6, Vector3 } from "@jpl";

export enum Axis {
  X = 1,
  Y = 2,
  Z = 3
}

export class RotationMatrix {

  /**
   * Generate a 3x3 rotation matrix for rotation about a specified axis
   * Equivalent to SPICE rotate() function
   * 
   * @param angle Rotation angle in radians
   * @param axis Axis of rotation (1=X, 2=Y, 3=Z)
   * @returns 3x3 rotation matrix
   */
  static rotate(angle: number, axis: Axis): Matrix3x3 {
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    // Apply rotation based on axis
    switch (axis) {
      case Axis.X: // Rotation about X-axis
        return [
          [1, 0, 0],
          [0, c, s],
          [0, -s, c]
        ];

      case Axis.Y: // Rotation about Y-axis
        return [
          [c, 0, -s],
          [0, 1, 0],
          [s, 0, c]
        ];

      case Axis.Z: // Rotation about Z-axis
        return [
          [c, s, 0],
          [-s, c, 0],
          [0, 0, 1]
        ];

      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid axis: ${axis}. Must be 1 (X), 2 (Y), or 3 (Z)`);
    }
  }

  /**
   * Apply a rotation to an existing matrix
   * Equivalent to SPICE rotmat() function
   * 
   * @param matrix Input 3x3 matrix
   * @param angle Rotation angle in radians
   * @param axis Axis of rotation (1=X, 2=Y, 3=Z)
   * @returns Rotated 3x3 matrix
   */
  static rotateMatrix(matrix: Matrix3x3, angle: number, axis: Axis): Matrix3x3 {
    const rotationMatrix = this.rotate(angle, axis);
    return this.multiply(rotationMatrix, matrix);
  }

  /**
   * Construct rotation matrix from Euler angles
   * Equivalent to SPICE eul2m() function
   * 
   * @param angle3 Third rotation angle in radians
   * @param angle2 Second rotation angle in radians  
   * @param angle1 First rotation angle in radians
   * @param axis3 Third rotation axis (1=X, 2=Y, 3=Z)
   * @param axis2 Second rotation axis (1=X, 2=Y, 3=Z)
   * @param axis1 First rotation axis (1=X, 2=Y, 3=Z)
   * @returns Combined 3x3 rotation matrix
   */
  static eulerToMatrix(
    angle3: number, angle2: number, angle1: number,
    axis3: Axis, axis2: Axis, axis1: Axis
  ): Matrix3x3 {
    // Validate axes
    this.validateAxis(axis1);
    this.validateAxis(axis2);
    this.validateAxis(axis3);

    // Build rotation matrices for each axis
    const r1 = this.rotate(angle1, axis1);
    const r2 = this.rotate(angle2, axis2);
    const r3 = this.rotate(angle3, axis3);

    // Combine rotations: R = R3 * R2 * R1
    const temp = this.multiply(r2, r1);
    return this.multiply(r3, temp);
  }

  /**
   * Multiply two 3x3 matrices
   * 
   * @param a First matrix
   * @param b Second matrix
   * @returns Product matrix a * b
   */
  static multiply(a: Matrix3x3, b: Matrix3x3): Matrix3x3 {
    const result: Matrix3x3 = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result[i][j] = 0;
        for (let k = 0; k < 3; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }

    return result;
  }

  /**
   * Multiply a 3x3 matrix by a 3D vector
   * Equivalent to SPICE mxv() function
   * 
   * @param matrix 3x3 matrix
   * @param vector 3D vector
   * @returns Resulting 3D vector (matrix * vector)
   */
  static multiplyVector(matrix: Matrix3x3, vector: Vector3): Vector3 {
    return [
      matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
      matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
      matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
    ];
  }

  /**
   * Create identity matrix
   */
  static identity(): Matrix3x3 {
    return [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
  }

  /**
   * Transpose a 3x3 matrix
   */
  static transpose(matrix: Matrix3x3): Matrix3x3 {
    return [
      [matrix[0][0], matrix[1][0], matrix[2][0]],
      [matrix[0][1], matrix[1][1], matrix[2][1]],
      [matrix[0][2], matrix[1][2], matrix[2][2]]
    ];
  }

  /**
   * Convert rotation matrix to Euler angles (Z-X-Z sequence)
   * 
   * @param matrix 3x3 rotation matrix
   * @returns Euler angles [angle1, angle2, angle3] in radians
   */
  static matrixToEuler(matrix: Matrix3x3): Vector3 {
    const angle2 = Math.acos(Math.max(-1, Math.min(1, matrix[2][2])));

    if (Math.abs(Math.sin(angle2)) < 1e-14) {
      // Gimbal lock case
      const angle1 = 0;
      const angle3 = Math.atan2(matrix[0][1], matrix[0][0]);
      return [angle1, angle2, angle3];
    } else {
      const angle1 = Math.atan2(matrix[2][0], -matrix[2][1]);
      const angle3 = Math.atan2(matrix[0][2], matrix[1][2]);
      return [angle1, angle2, angle3];
    }
  }

  /**
   * Invert a 3x3 rotation matrix
   * For rotation matrices, the inverse is simply the transpose
   * 
   * @param matrix 3x3 rotation matrix
   * @returns Inverted rotation matrix
   */
  static invert(matrix: Matrix3x3): Matrix3x3 {
    // For rotation matrices, inverse = transpose
    return this.transpose(matrix);
  }

  /**
   * Invert a 3x3 matrix using Gauss-Jordan elimination
   * General matrix inversion (not optimized for rotation matrices)
   * 
   * @param matrix 3x3 matrix to invert
   * @returns Inverted matrix
   * @throws Error if matrix is singular (non-invertible)
   */
  static invertGeneral(matrix: Matrix3x3): Matrix3x3 {
    // Create augmented matrix [A|I]
    const augmented: number[][] = [
      [matrix[0][0], matrix[0][1], matrix[0][2], 1, 0, 0],
      [matrix[1][0], matrix[1][1], matrix[1][2], 0, 1, 0],
      [matrix[2][0], matrix[2][1], matrix[2][2], 0, 0, 1]
    ];

    // Gauss-Jordan elimination
    for (let i = 0; i < 3; i++) {
      // Find pivot
      let maxRow = i;
      for (let k = i + 1; k < 3; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }

      // Swap rows if needed
      if (maxRow !== i) {
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      }

      // Check for singular matrix
      if (Math.abs(augmented[i][i]) < 1e-14) {
        throw new Error('Matrix is singular and cannot be inverted');
      }

      // Scale pivot row
      const pivot = augmented[i][i];
      for (let j = 0; j < 6; j++) {
        augmented[i][j] /= pivot;
      }

      // Eliminate column
      for (let k = 0; k < 3; k++) {
        if (k !== i) {
          const factor = augmented[k][i];
          for (let j = 0; j < 6; j++) {
            augmented[k][j] -= factor * augmented[i][j];
          }
        }
      }
    }

    // Extract inverse matrix from right side of augmented matrix
    return [
      [augmented[0][3], augmented[0][4], augmented[0][5]],
      [augmented[1][3], augmented[1][4], augmented[1][5]],
      [augmented[2][3], augmented[2][4], augmented[2][5]]
    ];
  }

  /**
   * Transpose matrix by blocks (equivalent to SPICE xposbl)
   * Useful for state transformation matrix inversion
   * 
   * @param matrix Input matrix (must be evenly divisible by blockSize)
   * @param nRows Number of rows in matrix
   * @param nCols Number of columns in matrix  
   * @param blockSize Size of square blocks to transpose
   * @returns Matrix with each block transposed
   */
  static transposeByBlocks(
    matrix: number[][],
    nRows: number,
    nCols: number,
    blockSize: number
  ): number[][] {
    // Validate inputs
    if (blockSize < 1) {
      throw new Error(`Block size must be positive, got: ${blockSize}`);
    }
    if (nRows < 1) {
      throw new Error(`Number of rows must be positive, got: ${nRows}`);
    }
    if (nCols < 1) {
      throw new Error(`Number of columns must be positive, got: ${nCols}`);
    }
    if (nRows % blockSize !== 0 || nCols % blockSize !== 0) {
      throw new Error(
        `Block size ${blockSize} does not evenly divide matrix dimensions ${nRows}x${nCols}`
      );
    }

    // Initialize result matrix
    const result: number[][] = Array(nRows).fill(0).map(() => Array<number>(nCols).fill(0));

    // Process each block
    for (let blockRow = 0; blockRow < nRows; blockRow += blockSize) {
      for (let blockCol = 0; blockCol < nCols; blockCol += blockSize) {
        // Transpose current block
        for (let i = 0; i < blockSize; i++) {
          for (let j = 0; j < blockSize; j++) {
            result[blockRow + i][blockCol + j] = matrix[blockRow + j][blockCol + i];
          }
        }
      }
    }

    return result;
  }

  /**
   * Invert a 6x6 state transformation matrix (equivalent to SPICE invstm)
   * State transformation matrices have the form:
   * [R   0 ]
   * [W*R R ]
   * where R is 3x3 rotation matrix, W is 3x3 skew-symmetric matrix
   * 
   * @param stateMatrix 6x6 state transformation matrix
   * @returns Inverted state transformation matrix
   */
  static invertStateTransformation(stateMatrix: Matrix6x6): Matrix6x6 {
    // Use block transpose method (equivalent to SPICE xposbl with blockSize=3)
    const result = this.transposeByBlocks(stateMatrix, 6, 6, 3);
    
    // Convert back to Matrix6x6 tuple type
    return [
      [result[0][0], result[0][1], result[0][2], result[0][3], result[0][4], result[0][5]],
      [result[1][0], result[1][1], result[1][2], result[1][3], result[1][4], result[1][5]],
      [result[2][0], result[2][1], result[2][2], result[2][3], result[2][4], result[2][5]],
      [result[3][0], result[3][1], result[3][2], result[3][3], result[3][4], result[3][5]],
      [result[4][0], result[4][1], result[4][2], result[4][3], result[4][4], result[4][5]],
      [result[5][0], result[5][1], result[5][2], result[5][3], result[5][4], result[5][5]]
    ];
  }

  /**
   * Calculate determinant of 3x3 matrix
   * 
   * @param matrix 3x3 matrix
   * @returns Determinant value
   */
  static determinant(matrix: Matrix3x3): number {
    return (
      matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
      matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
      matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
    );
  }

  /**
   * Check if matrix is orthogonal (rotation matrix)
   * For rotation matrices: R * R^T = I and det(R) = 1
   * 
   * @param matrix 3x3 matrix to check
   * @param tolerance Numerical tolerance for comparison
   * @returns True if matrix is orthogonal
   */
  static isOrthogonal(matrix: Matrix3x3, tolerance = 1e-10): boolean {
    const det = this.determinant(matrix);
    if (Math.abs(det - 1) > tolerance) {
      return false;
    }

    const transpose = this.transpose(matrix);
    const product = this.multiply(matrix, transpose);
    const identity = this.identity();

    // Check if product is identity matrix
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (Math.abs(product[i][j] - identity[i][j]) > tolerance) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Validate axis parameter
   */
  private static validateAxis(axis: Axis): void {
    if (axis < Axis.X || axis > Axis.Z) {
      throw new Error(`Invalid axis: ${axis}. Must be 1 (X), 2 (Y), or 3 (Z)`);
    }
  }
}
