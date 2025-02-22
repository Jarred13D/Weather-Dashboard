import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (_req: Request, res: Response) => {
  try {
    const { city } = _req.body;
    if (!city) {
      throw new Error('City name is required');
    }
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherForCity(city);
  // TODO: save city to search history
  await HistoryService.addCity(city);

  res.json(weatherData);
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to retrieve weather data' }); 
}
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req: Request, res: Response) => {
  try {
    const { id } = _req.params;
    await HistoryService.removeCity(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;