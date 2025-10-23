import { Capacitor } from '@capacitor/core';
import { ToastController } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import download from 'downloadjs';
import mime from 'mime';
import { APP_File_CheckPermissions } from './appDevicePermission';
import { APP_COMPONENT_IonToast } from './appComponent';
import { APP_MATCH_Base64, APP_MATCH_BlobUrl, APP_MATCH_Url } from './appMatch';

// Helper function to safely get mime type
function getMimeType(fileExt: string): string {
	try {
		return mime.getType(fileExt) || 'application/octet-stream';
	} catch (error) {
		console.error('Error getting mime type:', error);
		// Fallback mime types for common extensions
		const fallbackMimes: { [key: string]: string } = {
			'jpg': 'image/jpeg',
			'jpeg': 'image/jpeg',
			'png': 'image/png',
			'gif': 'image/gif',
			'webp': 'image/webp',
			'pdf': 'application/pdf',
			'txt': 'text/plain',
			'json': 'application/json',
			'xml': 'application/xml',
			'csv': 'text/csv'
		};
		return fallbackMimes[fileExt.toLowerCase()] || 'application/octet-stream';
	}
}

// Helper function to safely get file extension from mime type
function getMimeExtension(mimeType: string): string {
	try {
		return mime.getExtension(mimeType) || '';
	} catch (error) {
		console.error('Error getting extension:', error);
		// Fallback extensions for common mime types
		const fallbackExts: { [key: string]: string } = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/gif': 'gif',
			'image/webp': 'webp',
			'application/pdf': 'pdf',
			'text/plain': 'txt',
			'application/json': 'json',
			'application/xml': 'xml',
			'text/csv': 'csv'
		};
		return fallbackExts[mimeType.toLowerCase()] || '';
	}
}

/**
 * Chọn file chuyên nghiệp, hỗ trợ Promise và callback, validate accept, dọn dẹp input đúng cách
 * @param options { accept: string; multiple?: boolean }
 * @param callback (files: File[]) => any (tùy chọn)
 * @returns Promise<File[]>
 *
 * Ví dụ:
 *   // Dùng Promise
 *   const files = await APP_FILE_SelectFile({ accept: '.pdf' });
 *   // Dùng callback
 *   APP_FILE_SelectFile({ accept: '.pdf' }, (files) => { ... });
 */
export function APP_FILE_SelectFile(
	options: { accept: string; multiple?: boolean },
	callback?: (files: File[]) => any
): Promise<File[]> {
	return new Promise<File[]>((resolve, reject) => {
		if (!options || typeof options.accept !== 'string') {
			const err = new Error('Invalid options or accept type');
			if (callback) callback([]);
			return reject(err);
		}
		const inputFile = document.createElement('input');
		inputFile.type = 'file';
		inputFile.accept = options.accept;
		inputFile.multiple = !!options.multiple;
		inputFile.style.display = 'none';
		inputFile.style.visibility = 'hidden';

		// Cleanup function
		const cleanup = () => {
			if (inputFile.parentNode) {
				document.body.removeChild(inputFile);
			}
			inputFile.value = '';
		};

		inputFile.addEventListener('change', (e: any) => {
			e.preventDefault();
			let fileList = (e.target?.files || []) as FileList;
			let files: File[] = [];
			if (fileList.length > 0) {
				files = Array.from(fileList);
				// Validate accept (nâng cao, nếu cần)
				if (options.accept) {
					const acceptList = options.accept
						.split(',')
						.map((s) => s.trim().toLowerCase());
					files = files.filter((file) => {
						const ext = '.' + file.name.split('.').pop()?.toLowerCase();
						const mimeType = file.type.toLowerCase();
						return acceptList.some((acc) => {
							if (acc.endsWith('/*')) {
								return mimeType.startsWith(acc.replace('/*', '/'));
							}
							return (
								acc === ext ||
								mimeType === acc ||
								mimeType.includes(acc.replace('.', ''))
							);
						});
					});
				}
			}
			cleanup();
			if (callback) callback(files);
			resolve(files);
		});

		inputFile.addEventListener('click', (e) => {
			// Đề phòng trường hợp click nhưng không chọn file
			setTimeout(() => {
				// Nếu người dùng không chọn file, vẫn phải cleanup
				inputFile.addEventListener('blur', cleanup, { once: true });
			}, 500);
		});

		document.body.appendChild(inputFile);
		inputFile.click();
	});
}

/**
 * Chọn một thư mục, quét tất cả file trong thư mục (bao gồm thư mục con), lọc theo accept
 * @param options { accept: string }
 * @param callback (files: File[]) => any (tùy chọn)
 * @returns Promise<File[]>
 *
 * Ví dụ:
 *   // Dùng Promise
 *   const files = await APP_FILE_SelectDirectory({ accept: '.pdf' });
 *   // Dùng callback
 *   APP_FILE_SelectDirectory({ accept: '.pdf' }, (files) => { ... });
 */
export function APP_FILE_SelectDirectory(
	options: { accept: string },
	callback?: (files: File[]) => any
): Promise<File[]> {
	return new Promise<File[]>((resolve, reject) => {
		if (!options || typeof options.accept !== 'string') {
			const err = new Error('Invalid options or accept type');
			if (callback) callback([]);
			return reject(err);
		}
		const inputFile = document.createElement('input');
		inputFile.type = 'file';
		inputFile.style.display = 'none';
		inputFile.style.visibility = 'hidden';
		(inputFile as any).webkitdirectory = true;
		inputFile.multiple = true;

		const cleanup = () => {
			if (inputFile.parentNode) {
				document.body.removeChild(inputFile);
			}
			inputFile.value = '';
		};

		inputFile.addEventListener('change', (e: any) => {
			e.preventDefault();
			let files = (e.target?.files || []) as FileList;
			let fileArr = Array.from(files);
			if (options.accept) {
				const acceptList = options.accept
					.split(',')
					.map((s) => s.trim().toLowerCase());
				fileArr = fileArr.filter((file) => {
					const ext = '.' + file.name.split('.').pop()?.toLowerCase();
					const mimeType = file.type.toLowerCase();
					// Hỗ trợ accept dạng .ext, image/*, hoặc mime type
					return acceptList.some((acc) => {
						if (acc.endsWith('/*')) {
							return mimeType.startsWith(acc.replace('/*', '/'));
						}
						return (
							acc === ext ||
							mimeType === acc ||
							mimeType.includes(acc.replace('.', ''))
						);
					});
				});
			}
			cleanup();
			if (callback) callback(fileArr);
			resolve(fileArr);
		});

		inputFile.addEventListener('click', (e) => {
			setTimeout(() => {
				inputFile.addEventListener('blur', cleanup, { once: true });
			}, 500);
		});

		document.body.appendChild(inputFile);
		inputFile.click();
	});
}

export const APP_FILE_Download = async (
	options: { blob?: Blob; fileName?: string; fileType?: string },
	components?: { toastController: ToastController }
) => {
	switch (Capacitor.getPlatform()) {
		case 'web': {
			if (options.blob) {
				download(options.blob, options.fileName, options.fileType);
			}
			break;
		}
		case 'android':
		case 'ios': {
			let res = await APP_File_CheckPermissions();
			if (res.status) {
				if (options.blob) {
					Filesystem.writeFile({
						path: options.fileName ?? 'fileNoName',
						data: await convertBlobToBase64(options.blob),
						directory: Directory.Documents,
						recursive: true,
					}).then((resFS) => {
						if (resFS.uri) {
							Share.share({
								files: [resFS.uri],
							});
						}
					});
				}
			} else {
				if (components?.toastController)
					APP_COMPONENT_IonToast(
						components.toastController,
						{},
						{ Succeeded: res.status, Message: res.message }
					).then((toast) => toast.present());
			}
		}
	}
};

// Utility function to convert Blob to Base64
function convertBlobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			resolve(reader.result as string);
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob); // Read the Blob as a Data URL
	});
}

/* EXAMPLE:
	fetchUrlToDataJSON(
		`${environment.readfile_url ?? ""}${environment.health_folder ?? ""}/${options.params.health_id}/${'content.json'}`,
		'content.json',
		'application/json',
		(file?: File) => {
			options.loading ? options.loading(false) : null;

			//
			if (options.callback) options.callback(file);
		}
	);
*/
export const fetchUrlToDataJSON = (
	url: string,
	fname: string,
	mimeType: string,
	callback: Function
) => {
	fetchUrlToFile(url, fname, mimeType, (file?: any) => {
		if (file) {
			let fr = new FileReader();
			fr.onload = () => {
				callback(JSON.parse(fr.result as string));
			};
			fr.onerror = (err) => {
				console.error('fetchUrlToDataJSON', err);
				callback();
			};
			fr.readAsText(file);
		} else {
			callback();
		}
	});
};

export const fetchUrlToFile = (
	url: string,
	fname: string,
	mimeType: string,
	callback: Function
) => {
	//fetch(url, { mode: 'cors', headers: { 'Access-Control-Allow-Origin': '*' } })
	fetch(url, { cache: 'no-cache' })
		.then((res?: Response) => {
			if (res?.status == 404) {
				return;
			}
			return res?.arrayBuffer();
		})
		.then(function (buf?: ArrayBuffer) {
			if (!buf) {
				return;
			}

			mimeType = mimeType || getMimeType(fname);

			return new File([buf], fname, { type: mimeType });
		})
		.then(function (file?: File) {
			callback(file);
		})
		.catch((err: any) => {
			callback();
		});
};

export const urlToBase64 = (url: string): Promise<string> => {
	//	'https://phr.surelrn.vn/api/readfile/medicaldocument/2025/04/30/0d98d5f3-3468-4ae5-bebd-24974c76ae91.png'

	return fetch(url)
		.then((response) => {
			return response.blob();
		})
		.then((blob) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();

				reader.onloadend = () => {
					if (typeof reader.result === 'string') {
						resolve(reader.result);
					} else {
						reject('Failed to convert to base64');
					}
				};

				reader.onerror = reject;
				reader.readAsDataURL(blob);
			});
		});
};

export const urlToFile = (
	url: string,
	format: string,
	callback?: (file?: File) => any
) => {
	return fetch(url)
		.then((response) => {
			console.log('url to response', response);
			return response.arrayBuffer();
		})
		.then((buffer) => {
			console.log('response to buffer', buffer);
			var mimeType, fileExt;

		if (APP_MATCH_Url(url)) {
			fileExt = format || (url.split('.').pop() ?? '');
			mimeType = getMimeType(fileExt);
		} else if (APP_MATCH_BlobUrl(url)) {
			fileExt = format;
			mimeType = getMimeType(fileExt);
		} else if (APP_MATCH_Base64(url)) {
			mimeType = (url.match(/^data:([^;]+);base64,/i) ?? [])[1] ?? '';
			fileExt = format || getMimeExtension(mimeType);
		}			if (!mimeType || !fileExt) {
				if (callback) callback();
				return;
			}

			return new File(
				[buffer],
				`${Math.round(Math.random() * 999999999)}.${fileExt}`,
				{ type: mimeType }
			);
		})
		.then((file) => {
			console.log('buffer to file', file);
			if (callback) callback(file);
			return file;
		});
};
