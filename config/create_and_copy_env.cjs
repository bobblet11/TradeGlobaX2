const fs = require('fs');
const path = require('path');

// Path to the centralized .env file
const centralizedEnvPath = path.join(__dirname, '/.env'); // Adjust this path as needed
// Path to the Vite project's .env file
const viteEnvPath = path.join(__dirname, '../frontend/web/.env');

// Function to create centralized .env file with default values
const createCentralizedEnv = () => {
    const defaultEnvContent = `
        # Database configuration
        DB_USER=your_db_user_here
        DB_PASSWORD=your_db_password_here
        DB_NAME=your_db_name_here
        DB_CLUSTER_ID=your_db_cluster_id_here

        # Coin market API
        CMC_API_KEY=your_cmc_api_key_here
        COINS_PATH=your_coins_path_here

        # APIservice post/put key
        DB_API_KEY=your_db_api_key_here

        # APIservice Express setup
        PORT=3000
        SITE_ORIGIN="*"
        JWT_SECRET_KEY=your_jwt_secret_key_here
        TOKEN_HEADER_KEY=your_token_header_key_here

        # APIservice origin for webFetcher and React app
        ROOT_URL=http://localhost
        VITE_DATABASE_API_URL=http://localhost:3000
    `.trim();

    fs.writeFile(centralizedEnvPath, defaultEnvContent, (err) => {
        if (err) {
            console.error('Error creating centralized .env file:', err);
        } else {
            console.log('Centralized .env file created successfully!');
        }
    });
};

// Check if the centralized .env file exists
fs.access(centralizedEnvPath, fs.constants.F_OK, (err) => {
    if (err) {
        // If the file does not exist, create it
        console.log('Centralized .env file does not exist. Creating it...');
        createCentralizedEnv();
    } else {
        console.log('Centralized .env file already exists.');
    }
});

// Copy the centralized .env file to the Vite project's root directory
fs.copyFile(centralizedEnvPath, viteEnvPath, (err) => {
    if (err) {
        console.error('Error copying .env file:', err);
    } else {
        console.log('.env file copied successfully!');
    }
});