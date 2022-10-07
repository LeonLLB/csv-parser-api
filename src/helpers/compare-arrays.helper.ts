export const compareArrays = (array1:any[],array2:any[],exact = true) : boolean => {
    if(array1.length !== array2.length) return false
    if(!exact){
        for (const value of array2) {
            if(!array1.includes(value)) return false
        }
        return true
    } else {
        for (const i in array2) {
            if(array1[i] !== array2[i]) return false
        }
        return true
    }
}