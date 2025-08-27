import { describe, it, expect } from "vitest";
import { RotationMatrix, Axis } from '../RotationMatrix';
import { Matrix3x3, Matrix6x6 } from "@jpl";

function expectMatrixToBeCloseTo(actual: Matrix3x3, expected: Matrix3x3, precision = 8) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      expect(actual[i][j]).toBeCloseTo(expected[i][j], precision);
    }
  }
}

describe('RotationMatrix', () => {
  describe('rotate', () => {
    it('should return identity matrix for zero rotation', () => {
      const result = RotationMatrix.rotate(0, Axis.X);
      const expected: Matrix3x3 = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });

    it('should create 90-degree rotation about Z-axis', () => {
      const result = RotationMatrix.rotate(Math.PI / 2, Axis.Z);
      const expected: Matrix3x3 = [
        [0, 1, 0],
        [-1, 0, 0],
        [0, 0, 1]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });

    it('should create 90-degree rotation about X-axis', () => {
      const result = RotationMatrix.rotate(Math.PI / 2, Axis.X);
      const expected: Matrix3x3 = [
        [1, 0, 0],
        [0, 0, 1],
        [0, -1, 0]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });

    it('should create 90-degree rotation about Y-axis', () => {
      const result = RotationMatrix.rotate(Math.PI / 2, Axis.Y);
      const expected: Matrix3x3 = [
        [0, 0, -1],
        [0, 1, 0],
        [1, 0, 0]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });

    it('should create Pi/4 rotation about Z-axis', () => {
      const result = RotationMatrix.rotate(Math.PI / 4, Axis.Z);
      const expected: Matrix3x3 = [
        [Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0],
        [-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0],
        [0, 0, 1]
      ];
      
      expectMatrixToBeCloseTo(result, expected);
    });
  });

  describe('identity', () => {
    it('should return 3x3 identity matrix', () => {
      const result = RotationMatrix.identity();
      const expected: Matrix3x3 = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });
  });

  describe('multiply', () => {
    it('should multiply identity matrix with itself', () => {
      const identity = RotationMatrix.identity();
      const result = RotationMatrix.multiply(identity, identity);

      expectMatrixToBeCloseTo(result, identity);
    });

    it('should multiply rotation matrices correctly', () => {
      const rotX = RotationMatrix.rotate(Math.PI / 2, Axis.X);
      const rotY = RotationMatrix.rotate(Math.PI / 2, Axis.Y);
      const result = RotationMatrix.multiply(rotX, rotY);

      const expected: Matrix3x3 = [
        [0, 0, -1],
        [1, 0, 0],
        [0, -1, 0]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });
  });

  describe('transpose', () => {
    it('should transpose identity matrix to itself', () => {
      const identity = RotationMatrix.identity();
      const result = RotationMatrix.transpose(identity);

      expectMatrixToBeCloseTo(result, identity);
    });

    it('should transpose rotation matrix correctly', () => {
      const rotation: Matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      const result = RotationMatrix.transpose(rotation);
      const expected: Matrix3x3 = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ];

      expectMatrixToBeCloseTo(result, expected);
    });
  });

  describe.skip('transposeByBlocks', () => {
    it('should transpose 2x2 matrix with block size 1', () => {
      const matrix = [
        [1, 2],
        [3, 4]
      ];

      const result = RotationMatrix.transposeByBlocks(matrix, 2, 2, 1);
      const expected = [
        [1, 3],
        [2, 4]
      ];

      expect(result).toEqual(expected);
    });

    it('should transpose 4x4 matrix with block size 2', () => {
      const matrix = [
        [1, 2, 5, 6],
        [3, 4, 7, 8],
        [9, 10, 13, 14],
        [11, 12, 15, 16]
      ];

      const result = RotationMatrix.transposeByBlocks(matrix, 4, 4, 2);
      const expected = [
        [1, 3, 5, 7],
        [2, 4, 6, 8],
        [9, 11, 13, 15],
        [10, 12, 14, 16]
      ];

      expect(result).toEqual(expected);
    });

    it('should transpose 6x6 state transformation matrix with block size 3', () => {
      // Simulate a state transformation matrix [R 0; W*R R]
      const matrix = [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0.1, 0.2, 0.3, 1, 0, 0],
        [0.4, 0.5, 0.6, 0, 1, 0],
        [0.7, 0.8, 0.9, 0, 0, 1]
      ];

      const result = RotationMatrix.transposeByBlocks(matrix, 6, 6, 3);
      const expected = [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0.1, 0.4, 0.7, 1, 0, 0],
        [0.2, 0.5, 0.8, 0, 1, 0],
        [0.3, 0.6, 0.9, 0, 0, 1]
      ];

      expect(result).toEqual(expected);
    });

    it('should handle single block (entire matrix)', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      const result = RotationMatrix.transposeByBlocks(matrix, 3, 3, 3);
      const expected = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9]
      ];

      expect(result).toEqual(expected);
    });

    it('should throw error for invalid block size', () => {
      const matrix = [[1, 2], [3, 4]];

      expect(() => {
        RotationMatrix.transposeByBlocks(matrix, 2, 2, 0);
      }).toThrow('Block size must be positive, got: 0');
    });

    it('should throw error for negative dimensions', () => {
      const matrix = [[1, 2], [3, 4]];

      expect(() => {
        RotationMatrix.transposeByBlocks(matrix, -1, 2, 1);
      }).toThrow('Number of rows must be positive, got: -1');

      expect(() => {
        RotationMatrix.transposeByBlocks(matrix, 2, -1, 1);
      }).toThrow('Number of columns must be positive, got: -1');
    });

    it('should throw error when block size does not divide dimensions evenly', () => {
      const matrix = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];

      expect(() => {
        RotationMatrix.transposeByBlocks(matrix, 3, 3, 2);
      }).toThrow('Block size 2 does not evenly divide matrix dimensions 3x3');
    });
  });

  describe('invert', () => {
    it('should invert rotation matrix using transpose', () => {
      const rotation = RotationMatrix.rotate(Math.PI / 4, Axis.Z);
      const inverse = RotationMatrix.invert(rotation);
      const product = RotationMatrix.multiply(rotation, inverse);
      const identity = RotationMatrix.identity();

      expectMatrixToBeCloseTo(product, identity);
    });

    it('should return identity for identity matrix', () => {
      const identity = RotationMatrix.identity();
      const inverse = RotationMatrix.invert(identity);

      expectMatrixToBeCloseTo(inverse, identity);
    });
  });

  describe('invertStateTransformation', () => {
    it('should invert 6x6 state transformation matrix', () => {
      const stateMatrix: Matrix6x6 = [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0.1, 0.2, 0.3, 1, 0, 0],
        [0.4, 0.5, 0.6, 0, 1, 0],
        [0.7, 0.8, 0.9, 0, 0, 1]
      ];

      const result = RotationMatrix.invertStateTransformation(stateMatrix);

      // Should be equivalent to transposeByBlocks with blockSize=3
      const expected = RotationMatrix.transposeByBlocks(stateMatrix, 6, 6, 3);
      expect(result).toEqual(expected);
    });

    it('should return proper Matrix6x6 tuple type', () => {
      const stateMatrix: Matrix6x6 = [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0.1, 0.2, 0.3, 1, 0, 0],
        [0.4, 0.5, 0.6, 0, 1, 0],
        [0.7, 0.8, 0.9, 0, 0, 1]
      ];

      const result = RotationMatrix.invertStateTransformation(stateMatrix);

      // Verify it's a proper Matrix6x6 tuple
      expect(result).toHaveLength(6);
      expect(result[0]).toHaveLength(6);
      expect(result[5]).toHaveLength(6);

      // Verify specific values from block transpose
      expect(result[3][0]).toBe(0.1);
      expect(result[3][1]).toBe(0.4);
      expect(result[3][2]).toBe(0.7);
    });
  });

  describe('determinant', () => {
    it('should calculate determinant of identity matrix', () => {
      const identity = RotationMatrix.identity();
      const det = RotationMatrix.determinant(identity);

      expect(det).toBeCloseTo(1, 10);
    });

    it('should calculate determinant of rotation matrix', () => {
      const rotation = RotationMatrix.rotate(Math.PI / 4, Axis.Z);
      const det = RotationMatrix.determinant(rotation);

      expect(det).toBeCloseTo(1, 10);
    });

    it('should calculate determinant of singular matrix', () => {
      const singular: Matrix3x3 = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const det = RotationMatrix.determinant(singular);

      expect(det).toBeCloseTo(0, 10);
    });
  });

  describe('isOrthogonal', () => {
    it('should return true for rotation matrices', () => {
      const rotation = RotationMatrix.rotate(Math.PI / 3, Axis.Y);

      expect(RotationMatrix.isOrthogonal(rotation)).toBe(true);
    });

    it('should return true for identity matrix', () => {
      const identity = RotationMatrix.identity();

      expect(RotationMatrix.isOrthogonal(identity)).toBe(true);
    });

    it('should return false for non-orthogonal matrix', () => {
      const nonOrthogonal: Matrix3x3 = [
        [1, 2, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];

      expect(RotationMatrix.isOrthogonal(nonOrthogonal)).toBe(false);
    });
  });
});
