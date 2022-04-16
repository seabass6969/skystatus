import BigNumber from "bignumber.js"
export function reun(valable){
        if(valable === undefined){
            return "Not enabled your api"
        }else{
            return valable
        }
}
export function toformated(number){
        return new BigNumber(number.toString()).toFormat()
}
