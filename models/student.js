/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 16:36:26
*------------------------------------------------------- */

// import predefined from '../constant/predefined';
// import constant from '../enum/constant';

export default function (Student) {
	// Student.validatesInclusionOf('status', { in: predefined.userStatus });
	Student.validatesUniquenessOf('phone');
	Student.validatesUniquenessOf('phone2');
	Student.validatesUniquenessOf('email');
	Student.validatesUniquenessOf('email2');

	// Student.disableRemoteMethod('create', true);
	Student.disableRemoteMethod('deleteById', true);
	Student.disableRemoteMethod('__delete__accessTokens', true);
	Student.disableRemoteMethod('__create__accessTokens', true);
	Student.disableRemoteMethod('__destroyById__accessTokens', true);

	Student.beforeRemote('create', (ctx, u, next) => {
		const { data: student = {} } = ctx.args;

		if (!student.email && !student.phone) {
			return next({
				statusCode: 400,
				code: 'EMAIL_PHONE_REQUIRED',
				message: '{{email}} or {{phone}} is required'
			});
		}
		next();
	});

	// User.afterRemote('create', (ctx, user, next) => {
	// 	sendMailVerify(user, next);
	// });
}

