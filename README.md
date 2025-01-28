# TradeGlobaX

## Project Description
A full stack web project that displays real-time financial data for over 1,000 cryptocurrencies.

## Features
- Real-time cryptocurrency data
- User-friendly interface
- Price charting

## Techstack
### Frontend
- React
- Konva
- Chart.Js
### Database API
- Express.JS
- MongoDB


## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/TradeGlobaX.git
   ```
2. Navigate into each project directory:
  ```bash
  cd TradeGlobaX2/backend/databaseAPI
  cd TradeGlobaX2/backend/webFetcher
  cd TradeGlobaX2/frontend/web
  ```
3. Install dependencies for each project:
  ```bash
  npm install
  ```

## Dependencies
1. React frontend
   ```bash
   "@fortawesome/fontawesome-svg-core": "^6.7.2",
   "@fortawesome/free-brands-svg-icons": "^6.7.2",
   "@fortawesome/free-regular-svg-icons": "^6.7.2",
   "@fortawesome/free-solid-svg-icons": "^6.7.2",
   "@fortawesome/react-fontawesome": "^0.2.2",
   "chart.js": "^4.4.7",
   "dotenv": "^16.4.7",
   "konva": "^8.3.5",
   "react": "^18.3.1",
   "react-chartjs-2": "^5.3.0",
   "react-dom": "^18.3.1",
   "react-konva": "^17.0.2-6",
   "react-router-dom": "^7.1.3"
   ```
2. Database API
   ```bash
   "cors": "^2.8.5",
   "dotenv": "^16.4.7",
   "express": "^4.21.2",
   "express-rate-limit": "^7.5.0",
   "helmet": "^8.0.0",
   "joi": "^17.13.3",
   "mongodb": "^6.12.0",
   "morgan": "^1.10.0",
   "nodemon": "^3.1.9"
   ```
3. CoinMarketCap API fetcher
   ```bash
   "dotenv": "^16.4.7",
   "fs": "^0.0.1-security",
   "readline": "^1.3.0"
   ```


## Usage Instructions
each project can be executed using the following,
   ```bash
   npm run dev
   ```

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit changes
4. git push origin/yourFeature

## Acknowledgements
CoinMarketCap API for non-historical cryptocurrency data.

## License
MIT License

Copyright (c) 2025 Benjamin Jun-jie Glover

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
