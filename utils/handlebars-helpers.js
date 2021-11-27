/*
Functions used in hbs views
 */
const handlebarsHelpers = {
profits:array=>{
    let profit = 0;
    for (let obj of array.filter(el=>el.transactionType==='Sale')){
        profit+=obj.sum
    }
    return profit
},
expenses:array=>{
    let expenditure = 0;
    for (let obj of array.filter(el=>el.transactionType==='Purchase')){
        expenditure+=obj.sum
    }
    return expenditure
},
    summary:(profits,expenses)=>(profits-expenses).toFixed(2)
}
module.exports = {
    handlebarsHelpers
}