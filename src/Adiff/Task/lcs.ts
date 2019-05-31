export interface IEqualFunc {
  (e1: any, e2: any): boolean
}

const lengthMatrix = (
  array1: any[],
  array2: any[],
  isEqual: IEqualFunc
) => {
  const len1 = array1.length;
  const len2 = array2.length;

  // initialize empty matrix of (len1 + 1) * (len2 + 1)
  const matrix = Array.from(
    { length: len1 + 1 },
    () => Array.from({ length: len2 + 1 }, () => 0)
  )

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const temp = isEqual(array1[i - 1], array2[j - 1])
        ? matrix[i][j] = matrix[i - 1][j - 1] + 1
        : Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      matrix[i][j] = temp
    }
  }

  return matrix
}

const backtrack = (
  matrix: number[][],
  array1: any[],
  array2: any[],
  index1: number,
  index2: number,
  isEqual: IEqualFunc
): {
  sequence: any[],
  indices1: number[],
  indices2: number[]
} => {
  if (index1 === 0 || index2 === 0) {
    return {
      sequence: [],
      indices1: [],
      indices2: [],
    };
  }

  if (isEqual(array1[index1 - 1], array2[index2 - 1])) {
    const sub = backtrack(
      matrix,
      array1,
      array2,
      index1 - 1,
      index2 - 1,
      isEqual,
    );
    sub.sequence.push(array1[index1 - 1]);
    sub.indices1.push(index1 - 1);
    sub.indices2.push(index2 - 1);
    return sub;
  }

  return matrix[index1][index2 - 1] > matrix[index1 - 1][index2]
    ? backtrack(matrix, array1, array2, index1, index2 - 1, isEqual)
    : backtrack(matrix, array1, array2, index1 - 1, index2, isEqual);
}

export const getLCS = (
  array1: any[],
  array2: any[],
  isEqual: IEqualFunc
) => {
  const matrix = lengthMatrix(array1, array2, isEqual)
  return backtrack(
    matrix,
    array1,
    array2,
    array1.length,
    array2.length,
    isEqual
  )
}
