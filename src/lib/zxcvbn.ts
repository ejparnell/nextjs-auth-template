import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';

zxcvbnOptions.setOptions({
    dictionary: {
        ...zxcvbnEnPackage.dictionary,
    },
    translations: zxcvbnEnPackage.translations,
});

export default zxcvbn;
