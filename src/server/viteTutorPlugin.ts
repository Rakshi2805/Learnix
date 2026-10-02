import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { handleTutorRequest } from './tutorHandler';

export function viteTutorPlugin(): Plugin {
  return {
    name: 'learnix-tutor-api',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/tutor') {
          handleTutorRequest(req, res);
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/tutor') {
          handleTutorRequest(req, res);
        } else {
          next();
        }
      });
    }
  };
}
