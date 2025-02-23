# Weather-Dashboard

## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Description
The Weather Dashboard is a web application that allows users to search for current weather conditions and a 5-day forecast for any city. The application fetches weather data from the OpenWeatherMap API and displays it in a user-friendly interface. Users can also view their search history and delete previous searches.

## Installation
To install and run the Weather Dashboard locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/weather-dashboard.git
    ```

2. Navigate to the project directory:
    ```bash
    cd weather-dashboard
    ```

3. Install the server dependencies:
    ```bash
    cd server
    npm install
    ```

4. Install the client dependencies:
    ```bash
    cd ../client
    npm install
    ```

5. Create a `.env` file in the [server](http://_vscodecontentref_/0) directory and add your OpenWeatherMap API key:
    ```env
    API_KEY=your_openweathermap_api_key
    ```

6. Build the client:
    ```bash
    npm run build
    ```

7. Start the server:
    ```bash
    cd ../server
    npm start
    ```

8. Open your browser and navigate to `http://localhost:3001` to view the application.

## Usage
1. Enter the name of a city in the search input field and click the search button.
2. View the current weather conditions and 5-day forecast for the searched city.
3. View your search history and click on a previous search to view the weather data again.
4. Delete a city from your search history by clicking the delete button next to the city name.

## API
The Weather Dashboard uses the OpenWeatherMap API to fetch weather data. The server-side code handles the API requests and responses.

### Endpoints
- `POST /api/weather/`: Fetches the current weather and 5-day forecast for a given city.
- `GET /api/weather/history`: Fetches the search history.
- `DELETE /api/weather/history/:id`: Deletes a city from the search history.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript, TypeScript
- **Backend**: Node.js, Express.js
- **API**: OpenWeatherMap API
- **Build Tools**: Webpack
- **Environment Variables**: dotenv

## Contributing
Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/your-feature-name
    ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](http://_vscodecontentref_/1) file for details.