// Utilidades para manejo de moneda y formato
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'USD'
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '$'

/**
 * Formatea un precio con el símbolo de moneda configurado
 * @param {number|string} price - El precio a formatear
 * @param {boolean} includeSymbol - Si incluir el símbolo de moneda
 * @returns {string} Precio formateado
 */
export const formatPrice = (price, includeSymbol = true) => {
    const numPrice = parseFloat(price || 0)
    const formatted = numPrice.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    
    return includeSymbol ? `${CURRENCY_SYMBOL} ${formatted}` : formatted
}

/**
 * Obtiene el código de moneda configurado
 * @returns {string} Código de moneda
 */
export const getCurrency = () => CURRENCY

/**
 * Obtiene el símbolo de moneda configurado
 * @returns {string} Símbolo de moneda
 */
export const getCurrencySymbol = () => CURRENCY_SYMBOL

/**
 * Formatea precio para meta tags (sin símbolo)
 * @param {number|string} price - El precio a formatear
 * @returns {string} Precio sin símbolo para meta tags
 */
export const formatPriceForMeta = (price) => {
    return parseFloat(price || 0).toString()
}