export const parseInput = (input: string) : boolean | string | number => {
    if(!isNaN(parseFloat(input))) return parseFloat(input)
    if(input === 'true' || input === 'false' ){
        return (input === 'true')
    }
    return input
}