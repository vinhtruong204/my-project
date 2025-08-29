export class GetItem {
  private static mockData: number[][] = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1],
  ];

  public static generateMatrix(bombs: number) {
    const rows = 5;
    const cols = 5;
    const totalCells = rows * cols;

    if (bombs >= totalCells) {
      throw new Error("Too many bombs! More than available cells.");
    }

    const flat: number[] = Array(totalCells).fill(1);

    let placed = 0;
    while (placed < bombs) {
      const randIndex = Math.floor(Math.random() * totalCells);
      if (flat[randIndex] === 1) {
        flat[randIndex] = 0;
        placed++;
      }
    }

    const matrix: number[][] = [];
    for (let r = 0; r < rows; r++) {
      matrix.push(flat.slice(r * cols, (r + 1) * cols));
    }

    this.mockData = matrix;
  }

  public static async getItemType(i: number, j: number): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mockData[j][i]);
      }, 200);
    });
  }

  public static async fetchData(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sender: "Server",
          matrix: this.mockData,
          error: 0,
        });
      }, 300);
    });
  }
}
