import { NextResponse } from "next/server";
import fs from "fs";
import pdf from "pdf-parse";
import path from "path";
import os from "os";
import axios from "axios";

// Handle POST requests to the API
export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body
    const { currentBucketFieldId } = await req.json(); // Extract currentBucketFieldId from the body
    
    // Construct the file URL using currentBucketFieldId
    const fileUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${currentBucketFieldId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
    
    console.log("============================================")
    console.log(fileUrl)
    console.log("=================================")

    // Ensure a valid file URL is provided
    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL provided" }, { status: 400 });
    }

    // Download the PDF file from the provided URL
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

    // Write the downloaded file to a temporary directory
    const tempDir = os.tmpdir();
    const filePath = path.join(tempDir, 'temp.pdf');
    fs.writeFileSync(filePath, response.data);

    // Read the buffer from the temporary file
    const dataBuffer = fs.readFileSync(filePath);

    // Parse the PDF data using pdf-parse
    const data = await pdf(dataBuffer);

    // Delete the temporary file after reading
    fs.unlinkSync(filePath);

    // Return the parsed text
    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error processing the file" }, { status: 500 });
  }
}
