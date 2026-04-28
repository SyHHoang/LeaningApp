# Learning App - Frontend

Frontend for the English learning platform. This app provides UI for vocabulary learning, grammar lessons, and practice tests.

## Tech Stack

* Vue.js
* Vite

## Installation

git clone https://github.com/SyHHoang/LeaningApp.git
cd LeaningApp
npm install

## Environment Variables

Create a `.env` file in the root folder:

VITE_API_URL=your_vite_api_url<br>
VITE_GOOGLE_CLIENT_ID=your_google_client_id<br>
VITE_IMGKIT_PUBLIC_KEY=your_imgkit_public_key<br>
VITE_IMGKIT_URL=your_imgkit_url_endpoint<br>
VITE_IMG_ERROR_URL=your_fallback_image_url<br>
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

## Run

npm run dev

## Notes

This frontend communicates with the backend via REST API. Make sure the backend is running and the API URL is set correctly in the environment variables.
