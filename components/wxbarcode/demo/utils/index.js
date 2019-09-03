var barcode = require('./barcode');
var qrcode = require('./qrcode');
var systemInfo = my.getSystemInfoSync();
var factor = systemInfo.pixelRatio;

function convert_length(length) {
	return Math.round(length/factor);
}

function barc(id, code, width, height) {
	barcode.code128(my.createCanvasContext(id), code, convert_length(width), convert_length(height))
}

function qrc(id, code, width, height, sx, sy, ctx) {
	qrcode.api.draw(code, {
		ctx: ctx || my.createCanvasContext(id),
		width: convert_length(width),
		height: convert_length(height)
	}, null, null, sx, sy)
}

module.exports = {
	barcode: barc,
	qrcode: qrc
}