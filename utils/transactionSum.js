/*
Function for correct recording of a given transaction amount
 */
function transactionSum(euro = 0, cent = 0) {
  return (Number(euro)) + ((cent.slice(0, 2) * 0.01));
}
module.exports = {
  transactionSum,
};
