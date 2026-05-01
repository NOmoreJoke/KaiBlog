import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nunjucks from 'nunjucks';
import { env } from './infrastructure/config/env.js';
import { webRouter } from './presentation/routes/web.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsDir = path.join(__dirname, 'presentation', 'views');
const staticDir = path.join(__dirname, 'presentation', 'static');

const app = express();

nunjucks.configure(viewsDir, {
  autoescape: true,
  express: app,
  noCache: env.NODE_ENV !== 'production',
});
app.set('view engine', 'njk');

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(
  '/assets',
  express.static(staticDir, {
    maxAge: env.NODE_ENV === 'production' ? '7d' : 0,
    fallthrough: false,
  }),
);
app.use(express.urlencoded({ extended: false }));

app.use((_req: Request, res: Response, next: NextFunction) => {
  res.locals.site = { name: env.SITE_NAME, url: env.SITE_URL };
  res.locals.assets = (filePath: string) => `/assets/${filePath.replace(/^\/+/, '')}`;
  next();
});

app.use('/', webRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).render('errors/404.njk', { title: '页面不存在' });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).render('errors/500.njk', { title: '服务器错误' });
};
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`▶ ${env.SITE_NAME} listening on http://localhost:${env.PORT}`);
});
