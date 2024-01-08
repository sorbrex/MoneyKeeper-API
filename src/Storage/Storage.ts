import { Storage } from "@google-cloud/storage";

//Error: error:0909006C:PEM routines:get_name:no start line
//process.env.ATHENA_PRIVATE_KEY.replace(/\\n/g, '\n')

export default class GCStorage {
	// Instantiate a storage client with credentials
	static storage: Storage
	static bucket: any

	static configure() {
		this.storage = new Storage({
			projectId: process.env.PROJECT_ID || "",
			scopes: process.env.SCOPES || "",
			credentials: {
				client_email: process.env.CLIENT_EMAIL || "",
				private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`).join('\n') || ""
			}
		});

		this.bucket = this.storage.bucket(process.env.BUCKET_NAME || "");
	}

	static async cleanDirectory(directory: string) {
		const [files] = await this.bucket.getFiles({ prefix: directory });
		for (const file of files) {
			await file.delete();
		}
	}

	static async uploadFile(fileBuffer: Buffer, destination: string) {
		const file = this.bucket.file(destination); //destination is the name of the file in the bucket with sub folders
		return await file.save(fileBuffer, {
			metadata: {
				contentType: "image/png",
			},
			public: true,
			validation: "md5",
		}).then(() => {
			return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
		})
	}

}

