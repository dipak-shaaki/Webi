# Premium Designer Portfolio

A high-performance, animated portfolio built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**. Designed to combine the best aesthetics of top design portfolios.

## 🌟 Features

- **Dreamy Minimalism** (Inspired by [Sharlee](https://itssharl.ee))
- **Editorial Typography** (Inspired by [Lauren Waller](https://lauren-waller.com))
- **Playful Interactions** (Inspired by [Sean Halpin](https://www.seanhalpin.xyz))
- **Conversational Contact Bot**
- **Smooth Page Transitions** (No hard reloads)
- **Dark/Light Mode** with persistence
- **Responsive Animations**

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
```

### 3. Customization
- **Personal Details**: Update `src/components/Hero.jsx` and `src/components/About.jsx`.
- **Projects**: Edit the data array in `src/components/Projects.jsx`.
- **Social Links**: Update `src/components/Sidebar.jsx`.

## 🌐 Deploying to GitHub Pages (with .com.np domain)

1. **Update Base URL**:
   If you are deploying to `username.github.io/repo-name`, keep `base: '/repo-name/'` in `vite.config.js`.
   If you are using a custom domain (like `example.com.np`), change `base` to `'/'`.

   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/', // Change to this for custom domains
     // ...
   })
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   The `package.json` includes a deploy script.
   ```bash
   npm run deploy
   ```

4. **Custom Domain Setup**:
   - Go to your GitHub Repository Settings > Pages.
   - Under **Custom domain**, enter your `.com.np` domain (e.g., `www.yourname.com.np`).
   - Allow GitHub to create the `CNAME` file, or create a file named `CNAME` in the `public` folder with your domain name inside.
   - Configure your DNS records (in your `.com.np` registrar) to point to GitHub Pages IPs.

## 🛠 Tech Stack

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Framer Motion**
- **React Icons**
