/**
 *
 * @type {string}
 */
const Delimiter = ' و ';

/**
 *
 * @type {string}
 */
const Zero = 'صفر';

/**
 *
 * @type {*[]}
 */
const Letters = [
    ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
    ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'],
    ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
    ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
    ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد',
        'کوآدریلیون', ' کادریلیارد', ' کوینتیلیون', ' کوانتینیارد', ' سکستیلیون', ' سکستیلیارد', ' سپتیلیون',
        'سپتیلیارد', ' اکتیلیون', ' اکتیلیارد', ' نانیلیون', ' نانیلیارد', ' دسیلیون', ' دسیلیارد'],
];

/**
 * Decimal suffixes for decimal part
 * @type {string[]}
 */
const DecimalSuffixes = [
    '',
    'دهم',
    'صدم',
    'هزارم',
    'ده‌هزارم',
    'صد‌هزارم',
    'میلیونوم',
    'ده‌میلیونوم',
    'صدمیلیونوم',
    'میلیاردم',
    'ده‌میلیاردم',
    'صد‌‌میلیاردم'
];

/**
 * Clear number and split to 3 sections
 * @param {*} num
 */
const PrepareNumber = (num) => {
    let Out = num;
    if (typeof Out === 'number') {
        Out = Out.toString();
    }
    const NumberLength = Out.length % 3;
    if (NumberLength === 1) {
        Out = `00${Out}`;
    } else if (NumberLength === 2) {
        Out = `0${Out}`;
    }
    // Explode to array
    return Out.replace(/\d{3}(?=\d)/g, '$&*')
        .split('*');
};

const ThreeNumbersToLetter = (num) => {
    // return Zero
    if (parseInt(num, 0) === 0) {
        return '';
    }
    const parsedInt = parseInt(num, 0);
    if (parsedInt < 10) {
        return Letters[0][parsedInt];
    }
    if (parsedInt <= 20) {
        return Letters[1][parsedInt - 10];
    }
    if (parsedInt < 100) {
        const one = parsedInt % 10;
        const ten = (parsedInt - one) / 10;
        if (one > 0) {
            return Letters[2][ten] + Delimiter + Letters[0][one];
        }
        return Letters[2][ten];
    }
    const one = parsedInt % 10;
    const hundreds = (parsedInt - (parsedInt % 100)) / 100;
    const ten = (parsedInt - ((hundreds * 100) + one)) / 10;
    const out = [Letters[3][hundreds]];
    const SecondPart = ((ten * 10) + one);
    if (SecondPart > 0) {
        if (SecondPart < 10) {
            out.push(Letters[0][SecondPart]);
        } else if (SecondPart <= 20) {
            out.push(Letters[1][SecondPart - 10]);
        } else {
            out.push(Letters[2][ten]);
            if (one > 0) {
                out.push(Letters[0][one]);
            }
        }
    }
    return out.join(Delimiter);
};

/**
 * Remove end zero of decimal part
 * @param input
 * @returns {string}
 * @constructor
 */
const ClearEndZero = (input) => {
    let ReversedInput = input.split('').reverse();
    for(let i =0;i<ReversedInput.length;i++){
        if(ReversedInput[i] !== '0'){
            return ReversedInput.reverse().join('');
        }
        i--;
        ReversedInput.shift();
    }
    return '';
};

/**
 * Convert Decimal part
 * @param DecimalPart
 * @returns {string}
 * @constructor
 */
const ConvertDecimalPart = (DecimalPart) => {
    // Clear right zero
    DecimalPart = ClearEndZero(DecimalPart);
    if(DecimalPart === ''){
        return '';
    }
    if(DecimalPart.length > 11){
        DecimalPart = DecimalPart.substr(0,11);
    }

    return ' ممیز '+ Num2persian(DecimalPart)+' '+DecimalSuffixes[DecimalPart.length];
};

/**
 * Main function
 * @param InputNumber
 * @returns {string}
 * @constructor
 */
const Num2persian = (InputNumber) => {
    // return Zero
    if (isNaN(parseFloat(InputNumber))) {
        return Zero;
    }

    let DecimalPart = '';
    let IntegerPart = InputNumber;
    let PointIndex = InputNumber.indexOf('.');

    // Check for float numbers form string and split Int/Dec
    if (PointIndex > -1) {
        IntegerPart = InputNumber.substring(0, PointIndex);
        DecimalPart = InputNumber.substring(PointIndex + 1, InputNumber.length);
    }

    if (IntegerPart.length > 66) {
        return 'خارج از محدوده';
    }
    // Split to sections
    const SpitedNumber = PrepareNumber(IntegerPart);
    // Fetch Sections and convert
    const Output = [];
    const SplitLength = SpitedNumber.length;
    for (let i = 0; i < SplitLength; i += 1) {
        const SectionTitle = Letters[4][SplitLength - (i + 1)];
        const converted = ThreeNumbersToLetter(SpitedNumber[i]);
        if (converted !== '') {
            Output.push(converted + SectionTitle);
        }
    }

    // Convert Decimal part
    if (DecimalPart.length > 0) {
        DecimalPart = ConvertDecimalPart(DecimalPart);
    }

    return Output.join(Delimiter) + DecimalPart;
};

String.prototype.toPersianLetter = function () {
    return Num2persian(this);
};

Number.prototype.toPersianLetter = function () {
    return Num2persian(parseFloat(this).toString());
};

export default Num2persian
