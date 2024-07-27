export namespace StringHelper {

    /**
     * This function normalizes a Vietnamese string by removing accents and special characters.
     * It replaces Vietnamese characters with their closest English equivalents, removes combining accents,
     * eliminates extra spaces, and removes punctuation and special characters.
     *
     * @param {string} input - The Vietnamese string to be normalized.
     * @returns {string} - The normalized string with Vietnamese tones and special characters removed.
     *
     * Example:
     * normalizeVietnameseString('Tiếng Việt có dấu')
     * // Returns: 'Tieng Viet co dau'
     */
    export const normalizeVietnameseString = (input: string): string => {
        if (!input) {
            return "";
        }

        const vietnameseToEnglishMap: { [key: string]: string } = {
            "àáạảãâầấậẩẫăằắặẳẵ": "a",
            "èéẹẻẽêềếệểễ": "e",
            "ìíịỉĩ": "i",
            "òóọỏõôồốộổỗơờớợởỡ": "o",
            "ùúụủũưừứựửữ": "u",
            "ỳýỵỷỹ": "y",
            "đ": "d",
            "ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ": "A",
            "ÈÉẸẺẼÊỀẾỆỂỄ": "E",
            "ÌÍỊỈĨ": "I",
            "ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ": "O",
            "ÙÚỤỦŨƯỪỨỰỬỮ": "U",
            "ỲÝỴỶỸ": "Y",
            "Đ": "D"
        };

        // Replace Vietnamese characters with corresponding English characters
        for (const [vietChars, engChar] of Object.entries(vietnameseToEnglishMap)) {
            const regex = new RegExp(`[${vietChars}]`, 'g');
            input = input.replace(regex, engChar);
        }

        // Remove Vietnamese combining accents
        input = input.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣
        input = input.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛

        // Replace multiple spaces with a single space
        input = input.replace(/ +/g, " ").trim();

        // Remove punctuation and special characters
        input = input.replace(/[!@%^*()+=<>?/,.:;"&#[\]~$_`{}|\\\-]/g, " ");

        return input;
    }


    /**
     * This function adds an opacity level to a given color in hexadecimal format.
     * The opacity value is clamped between 0 and 1 and then converted to a two-digit
     * hexadecimal representation, which is appended to the color string.
     *
     * @param {string} color - The hex color code (e.g., "#RRGGBB").
     * @param {number} opacity - The opacity level, a number between 0 and 1.
     * @returns {string} - The color with the opacity level appended as a hex value (e.g., "#RRGGBBAA").
     *
     * Example:
     * addOpacityToHexColor("#FF5733", 0.5)
     * // Returns: "#FF573380"
     */
    export function addOpacityToHexColor(color: string, opacity: number): string {
        // Ensure opacity is between 0 and 1, then convert to a hex value (00 to FF)
        const clampedOpacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
        const hexOpacity = clampedOpacity.toString(16).toUpperCase().padStart(2, '0');
        return color + hexOpacity;
    }

    /**
     * Converts a given number of bytes into a human-readable string with the appropriate unit.
     * It handles conversion from bytes to larger units (KB, MB, GB, etc.) and formats the result
     * with a specified number of decimal places.
     *
     * @param {number} bytes - The number of bytes to be converted.
     * @param {number} decimals - The number of decimal places to include in the formatted result (default is 2).
     * @returns {string} - A formatted string representing the size in a larger unit (e.g., "1.23 KB").
     *
     * Example:
     * formatBytes(1024)
     * // Returns: '1 KB'
     * formatBytes(1234, 3)
     * // Returns: '1.205 KB'
     */
    export function formatByteSize(bytes: number, decimals = 2): string {
        // Check if bytes is not a number or is equal to 0
        if (isNaN(bytes) || bytes === 0) return '0 Bytes';

        // Constants for the conversion factor and number of decimal places
        const KILOBYTE = 1024;
        const decimalPlaces = decimals < 0 ? 0 : decimals;
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        // Calculate the unit index
        const unitIndex = Math.floor(Math.log(bytes) / Math.log(KILOBYTE));

        // Convert and format the result
        const convertedValue = (bytes / Math.pow(KILOBYTE, unitIndex)).toFixed(decimalPlaces);

        // Return the formatted result
        return `${parseFloat(convertedValue)} ${units[unitIndex]}`;
    }


    /**
     * Checks if a string is not a valid number string.
     *
     * @param {string} value - The string to be checked.
     * @returns {boolean} - True if the string is not a valid number string, false otherwise.
     *
     * Example:
     * isNotNumberString('123') // Returns: false
     * isNotNumberString('abc') // Returns: true
     */
    export const isInvalidNumberString = (value: string): boolean => {
        // Check if the trimmed value is not a number or if it does not match the original value
        return isNaN(parseInt(value.trim())) || value.trim() !== `${parseInt(value.trim())}`;
    }

    /**
     * Truncates a string to a specified maximum length while preserving data integrity.
     * If the length of the input string is less than or equal to the maximum length,
     * the original string is returned. Otherwise, the string is truncated by removing
     * values from the beginning until its length is within the limit.
     *
     * @param {string} inputString - The input string to be truncated.
     * @param {number} maxLength - The maximum length allowed for the string.
     * @returns {string} - The truncated string.
     *
     * Example:
     * truncateString('Lorem ipsum dolor sit amet', 10)
     * // Returns: 'dolor sit amet'
     */
    export function truncateStringForLogBugs(inputString: string, maxLength: number): string {
        // Check if the input string length is less than or equal to the maximum length
        if (inputString.length <= maxLength) {
            return inputString; // Return the input string if its length is within the limit
        }

        // Split the string into an array of values, delimited by '|', and remove empty values
        const values: string[] = inputString.split('|').filter(Boolean);

        // Remove values from the beginning of the array until the length is within the limit
        while (inputString.length > maxLength) {
            values.shift(); // Remove the first value from the array
            inputString = values.join('|'); // Reconstruct the string
        }

        return inputString; // Return the truncated string
    }


    /**
     * Replaces the last occurrences of a target character in a string with a replacement character.
     *
     * @param {string} inputString - The input string where replacements will occur.
     * @param {string} targetChar - The character to be replaced.
     * @param {string} replacementChar - The character to replace the target character.
     * @returns {string} - The modified string with the last occurrences of the target character replaced.
     *
     * Example:
     * replaceLastOccurrences('abcdeabcde', 'd', 'X')
     * // Returns: 'abcdeabcXe'
     */
    export function replaceLastOccurrences(inputString: string, targetChar: string, replacementChar: string): string {
        // If the input string is short (less than or equal to 7 characters), simply append the replacementChar and return
        if (inputString?.length <= 7) {
            return `${inputString}${replacementChar}`;
        }

        // Reverse the input string, targetChar, and replacementChar
        const reversedInput = inputString?.split('').reverse().join('');
        const reversedTargetChar = targetChar?.split('').reverse().join('');
        const reversedReplacementChar = replacementChar?.split('').reverse().join('');

        // Replace the last occurrence of reversedTargetChar with reversedReplacementChar in the reversedInput
        const reversedResult = reversedInput?.replace(reversedTargetChar, reversedReplacementChar);

        // Reverse the result again to get the final modified string
        return reversedResult?.split('').reverse().join('');
    }


    /**
     * Generates a random alphanumeric string of specified length.
     *
     * @param {number} length - The length of the random string to be generated.
     * @returns {string} - The randomly generated alphanumeric string.
     *
     * Example:
     * generateRandomString(8)
     * // Returns: '3sdf8G2h'
     */
    export const generateRandomString = (length: number): string => {
        return Math.random().toString(36).substr(2, length);
    }


    /**
     * Removes all special characters from a given string.
     * Special characters include anything that is not a letter (a-z, A-Z) or number (0-9).
     *
     * @param {string} str - The input string from which special characters will be removed.
     * @returns {string} - The cleaned string with all special characters removed.
     */
    export const removeSpecialCharacters = (str: string)=> {
        // Define a regular expression pattern that matches any character that is not
        // a letter (a-z, A-Z) or a number (0-9). The pattern uses the ^ symbol inside
        // the brackets [] to negate the character set, meaning it will match anything
        // that is not specified within the brackets.
        const regex = /[^a-zA-Z0-9]/g;

        // Use the string's replace method with the regular expression to replace all
        // occurrences of special characters with an empty string, effectively removing them.
        // Return the cleaned string.
        return str.replace(regex, '');
    }
}
