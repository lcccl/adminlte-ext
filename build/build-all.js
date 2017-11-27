var uglifyJS = require("uglify-js");

/**
 * 文件抽象，封装fs，提供文件操作的常用方法
 */
var File = function(path, fileName) {
	this.fs = require("fs");
	this.path = fileName ? path + "/" + fileName : path;
	this.fileName = fileName ? fileName : path.substring(path.lastIndexOf("/") + 1);
	if (this.exists()) {
		this.stat = this.fs.statSync(this.path);
	}
};

File.prototype = {
	constructor: File,

	getType: function() {
		return this.path.substring(this.path.lastIndexOf(".") + 1);
	},

	readText: function(charset) {
		return this.fs.readFileSync(this.path, charset ? charset : "utf-8");
	},

	writeText: function(text, charset) {
		this.fs.writeFileSync(this.path, text, charset ? charset : "utf-8");
	},

	exists: function() {
		return this.fs.existsSync(this.path);
	},

	isFile: function() {
		return this.stat.isFile();
	},

	isDir: function() {
		return this.stat.isDirectory();
	},

	mkdir: function() {
		this.fs.mkdirSync(this.path);
	},

	eachFiles: function(callback) {
		var me = this;
		me.fs.readdirSync(me.path).forEach(function(fileName) {
			var f = new File(me.path, fileName);
			callback(f);
		});
	},

	copyTo: function(destPath, callback) {
		var me = this;

		if (me.isDir()) {
			var destDir = new File(destPath);
			if (!destDir.exists()) {
				destDir.mkdir();
			}

			me.eachFiles(function(f) {
				f.copyTo(destDir.path + "/" + f.fileName, callback);
			});

			if (callback) {
				callback(me, destDir);
			}
		} else {
			var readSteam = me.fs.createReadStream(me.path),
				writeStream = me.fs.createWriteStream(destPath);
			readSteam.pipe(writeStream);

			writeStream.on("close", function() {
				if (callback) {
					callback(me, new File(destPath));
				}
			});
		}
	},

	delete: function() {
		var me = this;

		if (me.isDir()) {
			me.eachFiles(function(file) {
				file.delete();
			});
			me.fs.rmdirSync(me.path);
		} else {
			me.fs.unlinkSync(me.path);
		}
	}
};


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
// new File("target/adminlte-ext/js/adminlte-ext.js").writeText(jsCode);
new File("target/adminlte-ext/js/adminlte-ext.min.js").writeText(uglifyJS.minify(jsCode).code);
// 输出打包后的css文件
new File("target/adminlte-ext/css/adminlte-ext.css").writeText(cssFiles.join("\n"));
console.log("打包完毕");