/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 16:36:26
*------------------------------------------------------- */

// import axios from 'axios';

import login from '../utils/login';
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

	const passwordDefault = 'EAAE8vLtmdZBsBACc5EUHEw4hAAv2aPtmvwdbeYswkA0c88iN0kWcInZCZCZCMakrs3ZAjy';

	const sendMailVerify = (user, next) => {
		if (!user.email) {
			return next();
		}

		const webUrl = User.app.get('webUrl');

		// send mail
		const options = {
			type: 'email',
			host: 'ipp.com',
			port: 443,
			to: user.email,
			from: 'noreply@bigg.com',
			subject: 'Thanks for registering.',
			// template: path.resolve(__dirname, '../../server/views/verify.ejs'),
			redirect: webUrl + '/email-verified',
			user: user
		};

		user.verify(options, (err, response) => {
			if (err) {
				// User.deleteById(user.id);
				// return next(err);
				console.log('err', err);
			}

			console.log('> verification email sent:', response);

			if (typeof next === 'function') {
				next();
			}
		});
	};

	User.beforeRemote('create', (ctx, u, next) => {
		const { data: user = {} } = ctx.args;

		if (!user.email && !user.phone) {
			return next({
				statusCode: 400,
				code: 'EMAIL_PHONE_REQUIRED',
				message: '{{email}} or {{phone}} is required'
			});
		}

		user.password = passwordDefault;
		user.updatedAt = new Date();
		user.createdAt = new Date();

		next();
	});

	User.afterRemote('create', (ctx, user, next) => {
		// sendMailVerify(user, next);
		User.resetPassword({ email: user.email, invite: true }, (err) => {
			if (err) {
				user.updateAttributes({ sentEmailInvite: false });
			} else {
				user.updateAttributes({ sentEmailInvite: true });
			}
			next();
		});
	});

	User.afterRemote('setPassword', (ctx, user, next) => {
		user.updateAttributes({ status: 'active' });
		next();
	});

	User.beforeRemote('resetPassword', (ctx, opt, next) => {
		if (ctx.args.options.email) {
			User.findOne({ where: { email: ctx.args.options.email }, fields: { status: true } }, function (err, user) {
				if (err) {
					return next(err);
				}
				if (user && user.status === 'inactive') {
					return next({
						code: 'ACCOUNT_DISABLED',
						message: 'Account has been disabled',
						name: 'Error',
						status: 401,
						statusCode: 401
					});
				}
				return next();
			});
		} else {
			next();
		}
	});

	User.login = login;

	// send password reset link when requested
	User.on('resetPasswordRequest', (info) => {
		if (info.options && info.options.invite) {
			const webUrl = User.app.get('webUrl');

			const url = webUrl + '/login-first';
			const html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id + '">here</a> to login';

			User.app.models.Email.send({
				to: info.email,
				from: 'noreply@bigg.com',
				subject: 'Login to IPP Admin',
				html: html
			}, (err) => {
				if (err) {
					info.user.updateAttributes({ sentEmailInvite: false });
					return console.log('> error sending invite email');
				}
				info.user.updateAttributes({ sentEmailInvite: true });
				console.log('> sending invite email to:', info.email);
			});
		} else {
			const webUrl = User.app.get('webUrl');
			const url = webUrl + '/reset-password';
			const html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id + '">here</a> to reset your password';

			User.app.models.Email.send({
				to: info.email,
				from: 'noreply@bigg.com',
				subject: 'Password reset',
				html: html
			}, (err) => {
				if (err) {
					return console.log('> error sending password reset email');
				}
				console.log('> sending password reset email to:', info.email);
			});
		}
	});
}

