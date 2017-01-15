import { minify } from 'html-minifier';
import CleanCSS from 'clean-css';

const STYLESHEET = `
.pageload-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.pageload-overlay::after,
.pageload-overlay::before {
  content: '';
  position: fixed;
  width: 20px;
  height: 20px;
  top: 50%;
  left: 50%;
  margin: -10px 0 0 -10px;
  border-radius: 50%;
  visibility: hidden;
  opacity: 0;
  z-index: 1000;
  transition: opacity 0.15s, visibility 0s 0.15s;
}

.pageload-overlay::after {
  background: #6cc88a;
  transform: translateX(-20px);
  animation: moveRight 0.6s linear infinite alternate;
}

.pageload-overlay::before {
  background: #4fc3f7;
  transform: translateX(20px);
  animation: moveLeft 0.6s linear infinite alternate;
}

@keyframes moveRight {
  to { transform: translateX(20px); }
}

@keyframes moveLeft {
  to { transform: translateX(-20px); }
}

.pageload-loading.pageload-overlay::after,
.pageload-loading.pageload-overlay::before {
  opacity: 1;
  visibility: visible;
    transition: opacity 0.3s linear 1s;
  }
`;

export default minify(`
  <!doctype html>
  <html lang='en'>
    <head>
      <meta charset='utf-8'/>
      <style>
        ${new CleanCSS().minify(STYLESHEET).styles}
      </style>
    </head>
    <body>
      <div class='pageload-overlay pageload-loading'></div>
    </body>
  </html>
`, {
  removeAttributeQuotes: true,
});

