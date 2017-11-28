var uglifyJS = require("uglify-js"),
	File = require("./file.js");

/*==================== 开始打包，输出到target目录，将adminlte-ext中所有的js、css、img合并 ====================*/
var target = new File("target");
if (target.exists()) {
	target.delete();
}
target.mkdir();
new File("target/adminlte-ext").mkdir();
new File("target/adminlte-ext/css").mkdir();
new File("target/adminlte-ext/js").mkdir();

var jsFiles = [],
	cssFiles = [];
// 打包文件，递归提取img、css、js
var packFile = function(file) {
	if (file.isDir()) {
		if (file.fileName == "img") {
			console.log("正在拷贝文件：" + file.path);
			file.copyTo("target/adminlte-ext/img");
		} else {
			file.eachFiles(function(f) {
				packFile(f);
			});
		}
	} else if (file.getType() == "js") {
		console.log("正在合并js文件：" + file.path);
		jsFiles.push(file.readText());
	} else if (file.getType() == "css") {
		console.log("正在合并css文件：" + file.path);
		cssFiles.push(file.readText());
	}
};
packFile(new File("../adminlte-ext"));

// 输出打包后的js文件并压缩
var jsCode = jsFiles.join("\n");
new File("target/adminlte-ext/js/adminlte-ext.js").writeText(jsCode);
new File("target/adminlte-ext/js/adminlte-ext.min.js").writeText(uglifyJS.minify(jsCode).code);
// 输出打包后的css文件
new File("target/adminlte-ext/css/adminlte-ext.css").writeText(cssFiles.join("\n"));
console.log("打包完毕");