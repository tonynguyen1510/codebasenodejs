/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 16:36:26
*------------------------------------------------------- */

import predefined from '../constant/predefined';
// import constant from '../enum/constant';

// const createUserSendBird = (user, next) => {
// 	return axios({
// 		method: 'post',
// 		url: constant.SENDBIRD_API + '/users',
// 		headers: {
// 			'X-Requested-With': 'XMLHttpRequest',
// 			'Api-Token': constant.API_TOKEN,
// 		},
// 		data: {
// 			'user_id': user.id,
// 			'nickname': user.username,
// 			'profile_url': user.avatar || '',
// 			'issue_access_token': true,
// 		},
// 	});
// };

export default function (User) {
	User.validatesInclusionOf('status', { in: predefined.userStatus });
	User.validatesUniquenessOf('phone');


	// User.disableRemoteMethod('create', true);
	User.disableRemoteMethod('deleteById', true);
	User.disableRemoteMethod('__delete__accessTokens', true);
	User.disableRemoteMethod('__create__accessTokens', true);
	User.disableRemoteMethod('__destroyById__accessTokens', true);

	User.beforeRemote('create', (ctx, u, next) => {
		const { data: user = {} } = ctx.args;

		if (!user.email && !user.phone) {
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

