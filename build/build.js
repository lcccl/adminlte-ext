var uglifyJS = require("uglify-js"),
	File = require("./file.js");

/*==================== 开始打包，输出到target目录，将adminlte-ext中所有的js进行压缩，生成*.min.js文件 ====================*/
var target = new File("target");
if (target.exists()) {
	target.delete();
}
target.mkdir();

console.log("正在拷贝文件：" + "../adminlte-ext");
new File("../adminlte-ext").copyTo("target/adminlte-ext", function(srcFile, destFile) {
	if (destFile.getType() == "js") {
		var path = destFile.path.substring(0, destFile.path.length - 3) + ".min.js";
		console.log("正在压缩文件" + path);
		new File(path).writeText(uglifyJS.minify(destFile.readText()).code);
	}
});