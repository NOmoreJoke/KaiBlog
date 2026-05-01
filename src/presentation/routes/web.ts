import { Router, type Request, type Response, type Router as ExpressRouter } from 'express';

export const webRouter: ExpressRouter = Router();

webRouter.get('/', (_req: Request, res: Response) => {
  res.render('home.njk', {
    title: 'KaiBlog',
    canonicalPath: '/',
    activeNav: 'all',
  });
});
