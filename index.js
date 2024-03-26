import { config } from 'dotenv';
import fetch from 'node-fetch';
import Mustache from 'mustache';
import fs from 'fs/promises';

config();

const apiKey = process.env.OPENWEATHER_API_KEY;

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
    name: 'Seida',
    date: new Date().toLocaleDateString('es-ES', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Europe/Madrid',
    }),
};

async function setWeatherInfo() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=Seville&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        DATA.temperature = Math.round(data.main.temp);
        DATA.weather = data.weather[0].description;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function generateReadMe() {
    try {
        const data = await fs.readFile(MUSTACHE_MAIN_DIR);
        const output = Mustache.render(data.toString(), DATA);
        await fs.writeFile('README.md', output);
    } catch (error) {
        console.error('Error generating README:', error);
    }
}

async function action() {
    await setWeatherInfo();
    await generateReadMe();
}

action();
