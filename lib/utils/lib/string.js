function strContains(str, path) {
    return str.toLowerCase().includes(path.toLowerCase())
}

function strEquals(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase()
}

module.exports.strContains = strContains
module.exports.strEquals = strEquals
