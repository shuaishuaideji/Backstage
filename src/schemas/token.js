/**
 * Created by mac on 17/5/24.
 */
/**
 * Created by mac on 17/4/27.
 */
let schema = db.define('Token', {
		id: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: 'int(11)',
			field: 'id'
		},
		userId: {
			type: 'varchar(20)',
			field: 'userId',
		},
		password: {
			type: 'varchar(20)',
			field: 'password'
		},
		token: {
			type: 'varchar(20)',
			field: 'token'
		},
	}
	, {
		tableName: 'token',
		createdAt: false,
		updatedAt: false
	});
module.exports = schema;