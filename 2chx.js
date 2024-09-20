const https = require('https');

const url = process.argv[2].replace(/.html$/, '.json');
const urlBaseRegex = /^(https:\/\/.*?)\/.*/;
const urlBase = url.match(urlBaseRegex)[1];
const webmurlRegex = /^https:\/\/.*?\/.*(?:\.mp4|\.webm)/;
const limit = process.argv[3] || 200;
const offset = process.argv[4] || 0;

https.get(url, (res) => {
	let data = '';
	let limitCounter = 0;
	let offsetCounter = 0;

	res.on('data', (chunk) => {
		data += chunk;
	});

	res.on('end', () => {
		data = JSON.parse(data);
		data.threads[0].posts.forEach(post => {
			if (!post.files)
				return;

			post.files.forEach(file => {
				const fullPath = urlBase + file.path;

				if (!webmurlRegex.test(fullPath))
					return;

				if (offsetCounter < offset) {
					offsetCounter++;
					return;
				}
				if (limitCounter >= limit)
					return;

				console.log(fullPath);
				limitCounter++;
			});
		});
	});
}).on("error", (err) => {
	console.log(err.message);
});

