export class GetItem {
    private static mockData =
        [
            [
                1,
                1,
                0,
                0,
                1
            ], // a reel
            [
                0,
                1,
                0,
                0,
                1
            ],
            [
                0,
                0,
                0,
                0,
                1
            ],
            [
                1,
                0,
                0,
                0,
                1
            ],
            [
                0,
                1,
                0,
                0,
                1
            ]
        ];

    public static getItemType(i: number, j: number): number {
        // for (let row = 0; row < this.mockData.length; row++) {
        //     for (let col = 0; col < this.mockData[row].length; col++) {
        //         console.log(`mockData[${row}][${col}]: ${this.mockData[row][col]}`);
        //     }
        // }
        return this.mockData[j][i];
    }
}