const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
const tens = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const levels = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون', 'کوادریلیون', 'کوانتینیلیون', 'سکستیلیون', 'سپتیلیون'];

function convertThreeDigits(num) {
    if (num === '000') return '';
    const n = parseInt(num, 10);
    const h = Math.floor(n / 100);
    const t = Math.floor((n % 100) / 10);
    const u = n % 10;

    let parts = [];
    if (h > 0) parts.push(hundreds[h]);
    if (t === 1) {
        parts.push(teens[u]);
    } else {
        if (t > 1) parts.push(tens[t]);
        if (u > 0) parts.push(units[u]);
    }
    return parts.join(' و ');
}

function numberToWords(num, options = {}) {
    if (typeof num === 'string') num = parseFloat(num.replace(/,/g, ''));  // حذف کاما در اعداد بزرگ
    if (isNaN(num)) return 'عدد نامعتبر است';
    
    if (num === 0) return 'صفر';

    // تنظیمات پیش‌فرض
    const defaults = {
        separator: ' و ',  // جداکننده بین بخش‌ها
        showNegative: true, // نمایش عبارت "منفی"
        showDecimal: true,  // نمایش بخش اعشاری
    };
    const config = { ...defaults, ...options };

    // بررسی منفی بودن عدد
    let isNegative = num < 0;
    num = Math.abs(num);

    // بخش صحیح عدد
    const integerPart = Math.floor(num);
    const numStr = integerPart.toString().padStart(Math.ceil(integerPart.toString().length / 3) * 3, '0');
    const chunks = numStr.match(/.{1,3}(?=(.{3})*$)/g);

    // تبدیل هر دسته به حروف
    let words = chunks.map((chunk, index) => {
        const word = convertThreeDigits(chunk);
        const level = levels[chunks.length - index - 1];
        return word ? word + (level ? ' ' + level : '') : '';
    }).filter(Boolean);

    let result = words.join(config.separator);

    // بررسی بخش اعشاری
    if (config.showDecimal && num.toString().includes('.')) {
        const decimalPart = num.toString().split('.')[1].replace(/0+$/, '');  // حذف صفرهای انتهایی
        if (decimalPart.length > 0) {
            const decimalWords = decimalPart.split('').map(digit => units[parseInt(digit)]).join(' ');
            result += ` ممیز ${decimalWords}`;
        }
    }

    // افزودن پیشوند "منفی" در صورت نیاز
    if (isNegative && config.showNegative) result = 'منفی ' + result;

    return result;
}

// 🧑‍💻 **مثال‌ها:**
console.log(numberToWords(123456789));  // صد و بیست و سه میلیون و چهارصد و پنجاه و شش هزار و هفتصد و هشتاد و نه
console.log(numberToWords(-1000010));  // منفی یک میلیون و ده
console.log(numberToWords(3.1415));    // سه ممیز یک چهار یک پنج
console.log(numberToWords(1000000000000));  // یک تریلیون
console.log(numberToWords(1000000));  // یک میلیون
console.log(numberToWords(0));  // صفر
console.log(numberToWords("1,234,567.89"));  // یک میلیون و دویست و سی و چهار هزار و پانصد و شصت و هفت ممیز هشت نه

// 📝 **با تنظیمات مختلف:**
console.log(numberToWords(123456, { separator: '، ' }));  // صد و بیست و سه هزار، چهارصد و پنجاه و شش
console.log(numberToWords(-123.45, { showNegative: false }));  // صد و بیست و سه ممیز چهار پنج
console.log(numberToWords(1000000000000, { showDecimal: false }));  // یک تریلیون
