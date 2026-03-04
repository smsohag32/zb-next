import { Font } from '@react-pdf/renderer';

const BANGLA_FONT_URL = 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSansBengali/NotoSansBengali-Regular.ttf';

let registered = false;

export function registerBanglaFont() {
    if (registered) return;

    Font.register({
        family: 'NotoSansBengali',
        fonts: [
            { src: BANGLA_FONT_URL, fontWeight: 'normal' },
            { src: BANGLA_FONT_URL, fontWeight: 'bold' },
        ],
    });

    Font.registerHyphenationCallback((word: string) => [word]);

    registered = true;
}
