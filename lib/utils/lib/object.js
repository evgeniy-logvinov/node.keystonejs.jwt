function getObjectsWithId(objects) {
    if (objects) {
        return objects
            .map(object => {
                const newObject = object.toJSON()
                newObject.id = object.identifier
                delete newObject.identifier

                return newObject
            }).map(object => ({
                ...object,
            }))
    } else {
        new Error('Empty object')
    }
}

module.exports.getObjectsWithId = getObjectsWithId