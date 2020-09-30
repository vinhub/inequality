export const Constants = {
    numPersons: 16 as integer,

    // standard colors
    grayColor: 0x606060 as number,
    blueColor: 0x1e90ff as number,
    redColor: 0xa00000 as number,
    greenColor: 0x009900 as number,

    bodyTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '20px',
        color: '#606060',
        padding: { left: 0, bottom: 10 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    bodyBoldTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#000000',
        fontStyle: 'strong',
        padding: { left: 0, bottom: 10 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    headerTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#606060',
        padding: { left: 0, bottom: 10 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    smallTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        color: '#606060',
        padding: { left: 0, top: 4 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    buttonTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#5bc0de',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
    } as Phaser.Types.GameObjects.Text.TextStyle,
    actionButtonTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#5cb85c',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
    } as Phaser.Types.GameObjects.Text.TextStyle
} as const
