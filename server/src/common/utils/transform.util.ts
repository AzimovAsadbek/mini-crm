/**
 * `@Transform()` dekoratori uchun umumiy yordamchilar.
 *
 * Kirish qiymati `unknown` deb qabul qilinadi: string bo'lmasa o'zgarishsiz
 * o'tkaziladi va tegishli validator o'z xato xabarini beradi.
 */

/** Ikki chetidagi bo'sh joylarni olib tashlaydi. */
export const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Bo'sh joylarni olib tashlab, kichik harfga o'tkazadi — email uchun. */
export const trimLower = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

/** Bo'sh joylarni olib tashlaydi, natija bo'sh satr bo'lsa `null` qaytaradi. */
export const trimToNull = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() || null : value;

/** Bo'sh satrni `null` ga aylantiradi — formada to'ldirilmagan sana uchun. */
export const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);

/** Vergul bilan yozilgan ro'yxatni massivga aylantiradi: `PENDING,IN_PROGRESS`. */
export const csvToArray = ({ value }: { value: unknown }) =>
  typeof value === 'string'
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : value;
