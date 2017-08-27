/**
 * Created by mac on 17/4/27.
 */
let schema = db.define('User', {
		id: {
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
			type: 'int(11)',
			field: 'id'
		},
		account: {
			type: 'varchar(20)',
			field: 'account',
		},
		phone: {
			type: 'varchar(20)',
			field: 'phone'
		},
		nickName: {
			type: 'varchar(20)',
			field: 'nickName'
		},
	}
	, {
		tableName: 'user',
		createdAt: false,
		updatedAt: false
	});
module.exports = schema;