import DataUriParser from "datauri/parser.js";
import path from 'path';

const getDataUrl = (file) => {
    const parser = new DataUriParser();

    // Corrected method name: `extname` instead of `extName`
    const extName = path.extname(file.originalname); // Note: `originalname` is used, not `originalName`
    return parser.format(extName, file.buffer);
};

export default getDataUrl;
