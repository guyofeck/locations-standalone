import express from 'express';
import path from 'path';
import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import fetch from 'node-fetch';
import Redis from 'ioredis';
const redisClient = new Redis(process.env.REDIS_URL || '');
const INSTALLER_URL = 'https://www.wix.com/installer';
const APP_ID = process.env.WIX_APP_ID;
const CLIENT_SECRET = process.env.WIX_APP_SECRET;
const BASE_URL = process.env.BASE_URL;
type AccessResponse = { access_token: string; refresh_token: string };

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname));
} else {
    const compiler = webpack(require('../webpack.config'));

    app.use(middleware(compiler));
}

app.get('/', (_req: any, res: any) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/app', (req, res) => {
    return res.redirect(`${INSTALLER_URL}/install
?appId=${APP_ID}&redirectUrl=${BASE_URL}/auth&token=` + req.query['token'])
});

app.get('/auth', async (req, res) => {
    const accessResponse = await fetch('https://www.wix.com/oauth/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'grant_type': 'authorization_code',
            'client_id': APP_ID,
            'client_secret': CLIENT_SECRET,
            'code': req.query['code']
        })
    });
    const access = await accessResponse.json() as AccessResponse;
    await redisClient.set(req.query['instanceId'] as string, access['refresh_token']);

    return res.redirect(`${INSTALLER_URL}/close-window?access_token=${access['access_token']}`)
});

app.get('/api/locations', async (req, res) => {
    const instanceId = req.query.instanceId.toString();
    const refreshToken = await redisClient.get(instanceId);

    const accessResponse = await fetch('https://www.wix.com/oauth/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'grant_type': 'refresh_token',
            'client_id': APP_ID,
            'client_secret': CLIENT_SECRET,
            refresh_token: refreshToken
        })
    });
    const access = await accessResponse.json() as AccessResponse;

    const locationssResponse = await fetch('https://manage.wix.com/_api/locations-web/v1/locations', {
        headers: {
            Authorization: access['access_token']
        }
    });
    const locations = await locationssResponse.json();

    return res.json(locations);
});


app.listen(process.env.PORT || 9000);

