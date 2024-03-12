export enum DateRange {
    "Today" = "1D",
    "3D" = "3D",
    "7D" = "7D",
    "30D" = "30D"
}
const rangeToNum = {
    [DateRange.Today]: 1,
    [DateRange["3D"]]: 3,
    [DateRange["7D"]]: 7,
    [DateRange["30D"]]: 30,

}
export function createDateStub(range: DateRange){
    return `WHERE time >= toDate(today() - ${rangeToNum[range]})
    AND time <= toDate(today())`
}