import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Ensure the URL is converted to use the 'download' endpoint
  const downloadUrl = url.replace('/view?', '/download?');

  // Use server's temp directory for the download path
  const downloadPath = path.join(process.cwd(), 'temp', 'downloadedFile.pdf');

  const writer = fs.createWriteStream(downloadPath);

  try {
    const response = await axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    await new Promise<void>((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log('File downloaded successfully');

    // Remove the file after download
    // await new Promise<void>((resolve, reject) => {
    //   fs.unlink(downloadPath, (error) => {
    //     if (error) {
    //       return reject(error);
    //     }
    //     resolve();
    //   });
    // });

    // console.log('File removed successfully');

    return res.status(200).json({ message: 'File downloaded and removed successfully' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error downloading or removing the file' });
  }
};
