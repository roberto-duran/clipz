// Using Javascript, convert the following array:

// to:
// "a < b OR (c == d AND e != f)"

// Please make your response as elegant and legible as possible
const unformatedArr = ["OR", ["<", "a", "b"], ["AND", ["==", "c", "d"], ["!=", "e", "f"]]];


function format_arr(unformatedArr, firstLogicalIteration = false) {
    let result = '';
    const logicalOperators = ['OR', 'AND'],
        positions = { "operator": 0, "leftVariable": 1, "rightVariable": 2 };

    result += string_convertion(
        unformatedArr[positions.operator],
        unformatedArr[positions.leftVariable],
        unformatedArr[positions.rightVariable],
        logicalOperators.includes(unformatedArr[positions.operator]) && !firstLogicalIteration
    );

    return result;
}

function string_convertion(operator, leftVariable, rightVariable, addParentheses = false) {
    const leftVariableFormated = Array.isArray(leftVariable) ? format_arr(leftVariable) : leftVariable,
        rightVariableFormated = Array.isArray(rightVariable) ? format_arr(rightVariable) : rightVariable;

    return `${addParentheses ? '(' : ''}${leftVariableFormated} ${operator} ${rightVariableFormated}${addParentheses ? ')' : ''}`;
}

console.log(format_arr(unformatedArr, true));



// I have 7 years of experience working with CodeIgniter in this app casefriend.com. this is a large app forlawyers
// here I have made almost evrething form reporting to

// btw in this app casefriend make integrations to calendar solutions like MS calendar and Google calendar