/* --------------------------------------------------------
* Author Trần Đức Tiến
* Email ductienas@gmail.com
* Phone 0972970075
*
* Created: 2018-02-19 12:52:04
*------------------------------------------------------- */

export default function (Lesson) {
	Lesson.validatesUniquenessOf('name');
}
