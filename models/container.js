/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2017-12-01 16:12:33
*------------------------------------------------------- */

export default function (Container) {
	Container.disableRemoteMethod('destroyContainer', true);
	Container.disableRemoteMethod('getContainer', true);
	Container.disableRemoteMethod('getContainers', true);
	Container.disableRemoteMethod('removeFile', true);
	Container.disableRemoteMethod('createContainer', true);
	Container.disableRemoteMethod('destroyContainer', true);
	Container.disableRemoteMethod('getFiles', true);
	Container.disableRemoteMethod('getFile', true);
	Container.disableRemoteMethod('download', true);

}
