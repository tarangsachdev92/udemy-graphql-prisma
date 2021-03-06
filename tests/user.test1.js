import { getFirstName, isValidPassword } from '../src/utils/user.js'

test('Should return firstname when given full name', () => {
    const firstName = getFirstName('Tarang Sachdev')

    if (firstName !== "Tarang") {
        throw new Error('Exptected the string Tarang');
    }
    // throw new Error("this should trigger a error");
})


test('Should return first name when given full name', () => {
    const firstName = getFirstName('Andrew Mead')

    expect(firstName).toBe('Andrew')
})

test('Should return first name when given first name', () => {
    const firstName = getFirstName('Jen')

    expect(firstName).toBe('Jen')
})

test('Should reject password shorter than 8 characters', () => {
    const isValid = isValidPassword('abc123')

    expect(isValid).toBe(false)
})

test('Should reject password that contains word password', () => {
    const isValid = isValidPassword('abcPassword098')

    expect(isValid).toBe(false)
})

test('Should correctly validate a valid password', () => {
    const isValid = isValidPassword('Test123098!')

    expect(isValid).toBe(true)
})