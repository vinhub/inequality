export const Constants = {
    numPersons: 16 as integer,

    // standard colors
    grayColor: 0x606060 as number,
    blueColor: 0x1e90ff as number,
    redColor: 0xa00000 as number,
    greenColor: 0x009900 as number,

    bodyTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '16px',
        color: '#666',
        padding: { left: 0, bottom: 10 },
        underline: {
            color: '#1e90ff',
            thickness: 1,
            offset: 3
        }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    bodyBoldTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '16px',
        color: '#000',
        fontStyle: 'strong',
        padding: { left: 0, bottom: 10 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    headerTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '18px',
        color: '#333',
        padding: { left: 0, bottom: 4 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    smallTextStyle:
    {
        fontFamily: 'calibri, Arial, Helvetica, sans-serif',
        fontSize: '15px',
        color: '#666',
        padding: { left: 0, top: 4 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    smallEmphasisTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#1e90ff',
        padding: { left: 0, top: 4 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    buttonTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#5bc0de',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
    } as Phaser.Types.GameObjects.Text.TextStyle,
    actionButtonTextStyle:
    {
        fontFamily: 'Calibri, Arial, Helvetica, sans-serif',
        fontSize: '18px',
        color: '#ffffff',
        backgroundColor: '#5cb85c',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
    } as Phaser.Types.GameObjects.Text.TextStyle
} as const
