export const REGEX_HEX = /^#[a-fA-F0-9]+$/i;
export const REGEX_RGB = /^rgb\((\d+),(\d+),(\d+)\)$/i;
export const REGEX_RGBA = /^rgba\((\d+),(\d+),(\d+),([0-9\.]+)\)$/i;
export const REGEX_URL = /^http(s)?:\/\//i;
export const REGEX_URL_VALID =
	/^https?:\/\/((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d{1,3}(\.\d{1,3}){3}))([\/?#].*)?$/i;
export const REGEX_IP = /^\\\\(\d{1,3}(?:\.\d{1,3}){3})\\/i;
export const REGEX_BLOBURL = /^blob:(http(s)?|capacitor):\/\//i;
export const REGEX_BASE64 = /^data:[^;]+;base64,/i;
export const REGEX_YOUTUBE_URL =
	/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)[\w-]+(&[\w=]*)?(\?[\w=]*)?$/i;

export const APP_MATCH_Color = function (str?: string | null) {
	return (
		str &&
		((str.match(REGEX_HEX) === null ? false : true) ||
			(str.match(REGEX_RGB) === null ? false : true) ||
			(str.match(REGEX_RGBA) === null ? false : true))
	);
};

export const APP_MATCH_Url = (str: string | null | undefined) => {
	return str && (str.match(REGEX_URL) === null ? false : true);
};

export const APP_MATCH_BlobUrl = (str: string | null | undefined) => {
	return str && (str.match(REGEX_BLOBURL) === null ? false : true);
};

export const APP_MATCH_Base64 = function (str: string | null | undefined) {
	return str && (str.match(REGEX_BASE64) === null ? false : true);
};

export const APP_MATCH_YoutubeUrl = function (str: string | null | undefined) {
	return str && (str.match(REGEX_YOUTUBE_URL) === null ? false : true);
};
