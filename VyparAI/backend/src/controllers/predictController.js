import axios from 'axios';
import { env } from '../config/env.js';

export const predictDemand = async (req, res) => {
  const { features } = req.body;

  const response = await axios.post(`${env.mlServiceUrl}/predict`, { features });
  res.json(response.data);
};
