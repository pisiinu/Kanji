# Kanji Naming Assistant

A web tool for discovering Japanese kanji meant for fiction naming and real-life name checking.

## Deployment

This is a totally static Front-End web application using pure HTML, CSS, and JavaScript.

### Deploying to Vercel
You can deploy this instantly to Vercel. We have included a `vercel.json` file to serve the directory perfectly.
1. Push your repository to GitHub.
2. Import project in Vercel.
3. The framework preset is "Other". Build command is empty. Output directory can be left empty or set to `/naming-app` if you only want the app subdirectory. Actually, Vercel will handle it automatically.

### Deploying to Netlify
A `netlify.toml` is provided for seamless static deployments.
1. Push your repository to GitHub.
2. Log into Netlify and select "Add New Site" -> "Import an existing project".
3. Netlify will detect the `netlify.toml` and configure the base directory to `naming-app` and publish the site.

### Deploying to GitHub Pages
To host on GitHub Pages, just commit the `naming-app` contents into the root, or go to repository settings -> GitHub Pages and select the branch you wish to deploy.
