# Deployment Guide

## Backend on Render

Create a new Render Web Service from this repository.

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

Set these Render environment variables:

- `MONGO_URI`: your MongoDB Atlas connection string
- `CLIENT_ORIGIN`: `https://beacon-smart-estimation.vercel.app`
- `NODE_ENV`: `production`

You can also use the root `render.yaml` as a Render blueprint.

## Frontend on Vercel

Import the repository in Vercel.

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this Vercel environment variable:

- `VITE_API_BASE_URL`: `https://smart-it-estimater.onrender.com/api`

## Frontend on Netlify

Import the repository in Netlify.

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `frontend/dist`

Set this Netlify environment variable:

- `VITE_API_BASE_URL`: `https://smart-it-estimater.onrender.com/api`

After frontend deployment, update the Render `CLIENT_ORIGIN` value to the final Vercel or Netlify URL.
