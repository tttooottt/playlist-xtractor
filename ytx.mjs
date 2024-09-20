import axios from 'axios';
import 'dotenv/config';

const playlistId = process.argv[2];
const API_KEY = process.env.API_KEY;

async function extract(pt) {
	let apiurl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&key=${API_KEY}`;
	if (pt !== undefined)
		apiurl += `&pageToken=${pt}`;

	const r = await axios.get(apiurl);
	for (const i of r.data.items)
		console.log(i.contentDetails.videoId);

	if (r.data.nextPageToken !== undefined)
		extract(r.data.nextPageToken);
}

extract();
