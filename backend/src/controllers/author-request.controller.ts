import { Request, Response, NextFunction } from 'express';
import authorRequestService from '../services/author-request.service';
import { sendSuccess, sendCreated } from '../utils/api-response';

class AuthorRequestController {
  async becomeAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reason } = req.body;
      const result = await authorRequestService.submitRequest(req.user!._id.toString(), reason);
      sendCreated(res, result, 'Author request submitted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMyRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authorRequestService.getMyRequest(req.user!._id.toString());
      sendSuccess(res, result, 'Author request retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async getAllRequests(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusFilter = typeof req.query.status === 'string' ? req.query.status : undefined;
      const result = await authorRequestService.getAllRequests(statusFilter);
      sendSuccess(res, result, 'Author requests retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  async approveRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await authorRequestService.approveRequest(id, req.user!._id.toString());
      sendSuccess(res, result, 'Author request approved successfully');
    } catch (error) {
      next(error);
    }
  }

  async rejectRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await authorRequestService.rejectRequest(id, req.user!._id.toString());
      sendSuccess(res, result, 'Author request rejected successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthorRequestController();
