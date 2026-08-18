import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../config/logger.config';
import { ThemeService } from '../services/theme.service';
import { getIoInstance } from '../config/socket-holder';

export class ThemeController {
  private themeService: ThemeService;

  constructor(themeService: ThemeService) {
    this.themeService = themeService;
  }

  async getTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const theme = await this.themeService.getActiveTheme();
      res.status(200).json({
        success: true,
        data: theme,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req as any).user.id;
      const theme = await this.themeService.saveTheme(req.body, adminId);

      const io = getIoInstance();
      if (io) {
        io.emit('theme:update', theme);
        logger.info(`Theme update broadcasted by admin ${adminId}`);
      }

      res.status(200).json({
        success: true,
        data: theme,
      });
    } catch (error) {
      next(error);
    }
  }

  async resetTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = (req as any).user.id;
      const theme = await this.themeService.resetTheme(adminId);

      const io = getIoInstance();
      if (io) {
        io.emit('theme:update', theme);
        logger.info(`Theme reset broadcasted by admin ${adminId}`);
      }

      res.status(200).json({
        success: true,
        data: theme,
      });
    } catch (error) {
      next(error);
    }
  }

  async getThemeHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = Number(req.query.limit) || 20;
      const history = await this.themeService.getThemeHistory(limit);
      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const createThemeController = (themeService: ThemeService) => new ThemeController(themeService);
