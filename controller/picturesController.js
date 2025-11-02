const cloudinary = require('cloudinary').v2;
const fsPromises = require("fs").promises;


//Cloudinary URL's er HTTPS
cloudinary.config({
    secure: true,
})

class PicturesController {
    static async uploadPicture(req, res) {

        // Implementation for uploading pictures
        const { eventid } = req.params;

        const imageBuffer = req.file.buffer;
        const tmpFilePath = "./temp/" + req.file.originalname;

        // Save the buffer to a temporary file
        await fsPromises.writeFile(tmpFilePath, imageBuffer);

        try {
            const result = await cloudinary.uploader.upload(tmpFilePath, {
                folder: `event_pictures/${eventid}`,
            });
            console.log('Upload successful:', result);

        } catch (error) {
            console.error('Error uploading picture:', error);
            return res.status(500).json({ success: false, message: 'Failed to upload picture' });
        } finally {
            // Clean up the temporary file
            await fsPromises.unlink(tmpFilePath);
        }

        res.status(200).json({ success: true, message: 'Picture uploaded successfully' });

    }

    static async getPictures(req, res) {
        // Implementation for retrieving pictures
        const { eventid } = req.params;

        try {
            const result = await cloudinary.api.resources({
                type: 'upload',
                prefix: `event_pictures/${eventid}/`,
                max_results: 100,
            });
            const pictureUrls = result.resources.map(resource => resource.secure_url);

            return res.status(200).json({ success: true, pictures: pictureUrls });
        } catch (error) {
            console.error('Error retrieving pictures:', error);
            return res.status(500).json({ success: false, message: 'Failed to retrieve pictures' });
        }

    }
}

module.exports = PicturesController;