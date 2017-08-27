/**
 * Created by mac on 17/5/23.
 */
let schema = db.define('Post', {
		id: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: 'int(11)',
			field: 'id'
		},
		userId: {
			type: 'varchar(40)',
			field: 'userId',
		},
		title: {
			type: 'varchar(40)',
			field: 'title',
		},
		context: {
			type: 'varchar(100)',
			field: 'context'
		},
		createdAt: {
			type: 'datetime',
			field: 'createdAt'
		},

	}
	, {
		tableName: 'post',
		createdAt: false,
		updatedAt: false
	});
module.exports = schema;