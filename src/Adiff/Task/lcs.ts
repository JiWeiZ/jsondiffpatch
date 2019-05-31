export interface IEqualFunc {
  (e1: any, e2: any): boolean
}

const lengthMatrix = (
  arr1: any[],
  arr2: any[],
  isEqual: IEqualFunc
) => {
  const len1 = arr1.length;
  const len2 = arr2.length;

  // initialize empty matrix of (len1 + 1) * (len2 + 1)
  const matrix = Array.from(
    { length: len1 + 1 },
    () => Array.from({ length: len2 + 1 }, () => 0)
  )

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const temp = isEqual(arr1[i - 1], arr2[j - 1])
        ? matrix[i][j] = matrix[i - 1][j - 1] + 1
        : Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      matrix[i][j] = temp
    }
  }

  return matrix
}

const backtrack = (
  matrix: number[][],
  arr1: any[],
  arr2: any[],
  i1: number,
  i2: number,
  isEqual: IEqualFunc
): {
  seq: any[],
  idxs1: number[],
  idxs2: number[]
} => {
  if (i1 === 0 || i2 === 0) {
    return {
      seq: [],
      idxs1: [],
      idxs2: [],
    };
  }

  if (isEqual(arr1[i1 - 1], arr2[i2 - 1])) {
    const sub = backtrack(
      matrix,
      arr1,
      arr2,
      i1 - 1,
      i2 - 1,
      isEqual,
    );
    sub.seq.push(arr1[i1 - 1]);
    sub.idxs1.push(i1 - 1);
    sub.idxs2.push(i2 - 1);
    return sub;
  }

  return matrix[i1][i2 - 1] > matrix[i1 - 1][i2]
    ? backtrack(matrix, arr1, arr2, i1, i2 - 1, isEqual)
    : backtrack(matrix, arr1, arr2, i1 - 1, i2, isEqual);
}

export const getLCS = (
  arr1: any[],
  arr2: any[],
  isEqual: IEqualFunc
) => {
  const matrix = lengthMatrix(arr1, arr2, isEqual)
  return backtrack(
    matrix,
    arr1,
    arr2,
    arr1.length,
    arr2.length,
    isEqual
  )
}
