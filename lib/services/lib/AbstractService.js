const _ = require('lodash')
var keystone = require('keystone');
const {
	promisify
} = require('util')
const {
	WebError, RestApiError
} = requireRoot('lib/errors')

class AbstractService {

	getObjectWithId(object) {
		if (object) {
			object.id = object._id
			delete object._id
			return object
		} else {
			new WebError('Empty object')
		}
	}

	/**
	 * Get pagination result
	 * @param {object} object { results, perPage, page, model }
	 */
	async getPaginateResult({ results, perPage, page, number, model }) {
		const count = await model.count()
		const totalPages = Math.ceil(count / perPage)
		return {
			data: {
				content: results,
				totalElements: count,
				totalPages: totalPages,
				size: perPage,
				number: number,
				numberOfElements: results.length || 0,
				last: totalPages == page,
				first: count && page == 1,
			},
			status: 'success'
		}
	}

	/**
	 * Validate date by template
	 * @param {string} date 
	 */
	getDate(date) {
		if (date) {
			if (moment(date, 'YYYY-MM-DD', true).isValid()) {
				return moment(date, 'YYYY-MM-DD').toISOString()
			} else {
				throw new RestApiError(`Incorrect date ${date}`)
			}
		}
	}

	/**
	 * Get filter by date
	 * @param {string} identifier 
	 * @param {string} format 
	 */
	getDateFilter(identifier, format) {
		return moment(identifier, format, true).isValid() ? { $gte: moment(identifier, format).toISOString(), $lt: moment(identifier, format).add(1, 'day').toISOString() } : undefined
	}
}

module.exports = AbstractService
