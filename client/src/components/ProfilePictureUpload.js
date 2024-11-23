import React, { useState } from "react";
import { useDropzone } from "react-dropzone"; // Import dropzone for file upload
import axios from "axios";
import '../styles/profile-picture-upload.css'; // CSS file for styling

const ProfilePictureUpload = ({ currentUser, onUpdateProfile }) => {
    const [profilePic, setProfilePic] = useState(currentUser?.profilePicture || null);
    const [loading, setLoading] = useState(false);
    
    // Handle file drop or file selection
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            handleFileUpload(file);
        }
    });

    // Handle the file upload to cloud (e.g., Cloudinary or any other service)
    const handleFileUpload = async (file) => {
        setLoading(true);
        
        try {
            // Create FormData for file upload (assuming API will handle the upload)
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "your_upload_preset"); // Cloudinary upload preset (if using Cloudinary)

            // Replace with your cloud storage API endpoint
            const response = await axios.post("YOUR_CLOUD_UPLOAD_URL", formData);

            // Assuming the response contains the URL to the uploaded image
            const imageUrl = response.data.secure_url;
            
            // Update profile picture URL in user profile
            await onUpdateProfile({ profilePicture: imageUrl });

            // Set the profile picture state to reflect the uploaded image
            setProfilePic(imageUrl);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-picture-upload">
            <div className="profile-picture-upload-container" {...getRootProps()}>
                <input {...getInputProps()} />
                {profilePic ? (
                    <img src={profilePic} alt="Profile" className="profile-picture-upload-img" />
                ) : (
                    <div className="profile-picture-upload-placeholder">
                        <span>Click to upload a profile picture.</span>
                    </div>
                )}
            </div>
            <div className="profile-picture-upload-footer">
                {loading ? (
                    <span>Uploading...</span>
                ) : (
                    <span>Click to upload a profile picture.</span>
                )}
            </div>
        </div>
    );
};

export default ProfilePictureUpload;
