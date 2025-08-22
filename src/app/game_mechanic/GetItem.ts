export class GetItem {
    private static mockData =
        [
            [
                1,
                1,
                1,
                1,
                1
            ], // a reel
            [
                1,
                1,
                1,
                1,
                1
            ],
            [
                1,
                1,
                1,
                1,
                1
            ],
            [
                1,
                1,
                1,
                1,
                1
            ],
            [
                0,
                1,
                1,
                1,
                1
            ]
        ];

    public static generateMatrix(mines: number) {
        const rows = 5;
        const cols = 5;
        const totalCells = rows * cols;

        if (mines >= totalCells) {
            throw new Error("Too many bombs! More than available cells.");
        }

        // Start with all diamonds (1)
        const flat: number[] = Array(totalCells).fill(1);

        // Randomly replace with mines (0)
        let placed = 0;
        while (placed < mines) {
            const randIndex = Math.floor(Math.random() * totalCells);
            if (flat[randIndex] === 1) {
                flat[randIndex] = 0;
                placed++;
            }
        }

        // Convert to 2D array
        const matrix: number[][] = [];
        for (let r = 0; r < rows; r++) {
            matrix.push(flat.slice(r * cols, (r + 1) * cols));
        }

        // update mockData
        this.mockData = matrix;
    }

    public static getItemType(i: number, j: number): number {
        // for (let row = 0; row < this.mockData.length; row++) {
        //     for (let col = 0; col < this.mockData[row].length; col++) {
        //         console.log(`mockData[${row}][${col}]: ${this.mockData[row][col]}`);
        //     }
        // }
        return this.mockData[j][i];
    }
}