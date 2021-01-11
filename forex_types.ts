//The structure of a Rates object
interface ForexRates{
    USD: number,
    CAD: number,
    GBP: number,
    INR: number,
    LKR: number,
    BTN: number,

}

//The data structure returned in the message body by fixer.io
interface ForexObject {
    success: boolean,
    error?: ForexError,
    timestamp: number,
    historical: boolean,
    base: string,
    date: string,
    rates: ForexRates
}

//The data structure of a fixer.io error
interface ForexError{
    code: number,
    type: string,
    info: string,
}

