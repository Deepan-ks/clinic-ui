/**
 * @typedef {Object} BillItem
 * @property {string|number} id - Service ID
 * @property {string} name - Service name
 * @property {number} price - Unit price
 * @property {number} quantity - Quantity
 * @property {number} total - Line total
 */

/**
 * @typedef {Object} Bill
 * @property {string|number} id
 * @property {string} billNumber
 * @property {string} patientName
 * @property {string} doctorName
 * @property {string} date
 * @property {BillItem[]} items
 * @property {number} subtotal
 * @property {number} discount
 * @property {number} total
 */

/**
 * @typedef {Object} CreateBillPayload
 * @property {string|number} patientId
 * @property {string|number} doctorId
 * @property {string} doctorName
 * @property {string|number} specializationId
 * @property {string} paymentMode - CASH, CARD, etc.
 * @property {number} discountAmount
 * @property {number} discountPercent
 * @property {Object[]} items
 * @property {string|number} items.serviceId
 * @property {number} items.quantity
 */

export {};
