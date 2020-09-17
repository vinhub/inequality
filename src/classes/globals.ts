export const Constants = {
    numPersons: 16 as integer,
    happyWealthMin: 2 as integer,
    unhappyWealthMax: 0 as integer,
    startingWealth: 1 as integer,
    bodyTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#000',
        padding: { left: 0, bottom: 20 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    headerTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '32px',
        color: '#000',
        padding: { left: 0, bottom: 24 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    smallTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '14px',
        color: '#000',
        padding: { left: 0, top: 4 }
    } as Phaser.Types.GameObjects.Text.TextStyle,
    buttonTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#0099cc',
        padding: { left: 12, right: 12, top: 6, bottom: 6 },
    } as Phaser.Types.GameObjects.Text.TextStyle,
    footerTextStyle:
    {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '24px',
        color: '#000',
        padding: { left: 0, top: 24 },
    } as Phaser.Types.GameObjects.Text.TextStyle,

} as const

