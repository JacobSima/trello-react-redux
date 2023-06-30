
/**
 * Check if a variable is null or undefined
 * @param {vriable} value 
 * @returns {bool} true/false
 */
export const isNullOrUndefined = value => value === null || value === undefined;

/**
 * check if string is null , undefined or empty
 * @param {string} value 
 * @returns {bool}
 */
export const isNullOrUndefinedOrEmpty = value => value === null || value === undefined || value === "";

/**
 * validate array of string
 * @param {string[]} data 
 * @returns {bool} true/valse
 */
export const isStringArrayValide = data => {
  for(let i = 0 ; i < data.length ; i++){
    if(isNullOrUndefinedOrEmpty(data?.[i])) return false;
  }
  return true;
}

/**
 * Check if an Object is empty, null or undefined
 * @param {Object} obj 
 * @returns {bool} true/false
 */
export const isObjectEmpty = obj => obj === null || obj === undefined || Object.keys(obj)?.length === 0;