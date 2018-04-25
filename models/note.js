/* --------------------------------------------------------
* Author Ngô An Ninh
* Email ninh.uit@gmail.com
* Phone 0978108807
*
* Created: 2018-04-24 22:03:42
*------------------------------------------------------- */

export default function (Note) {
	var _ = require("underscore");

	Note.observe('before save', function updateTimestamp(ctx, next) {
		if (ctx.instance) {
			if (!ctx.instance.id) {
				ctx.instance.created = Math.floor(Date.now() / 1000);
			}
			ctx.instance.modified = Math.floor(Date.now() / 1000);
			if (!_.isEmpty(ctx.currentInstance) && !_.isEmpty(ctx.currentInstance.created) && !_.isEmpty(ctx.instance.created)) {
				ctx.instance.created = ctx.currentInstance.created;
			}
		} else {
			ctx.data.modified = Math.floor(Date.now() / 1000);
			if (!_.isEmpty(ctx.currentInstance) && (ctx.currentInstance.created) && (ctx.data.created)) {
				ctx.data.created = ctx.currentInstance.created;
			}
		}
		next();
	});
}
