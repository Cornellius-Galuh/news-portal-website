import authorRequestRepository from '../repositories/author-request.repository';
import userRepository from '../repositories/user.repository';
import AppError from '../utils/app-error';
import { AuthorRequestStatus, UserRole } from '../types/enums';

class AuthorRequestService {
  async submitRequest(userId: string, reason: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (user.role !== UserRole.USER) {
      throw new AppError('Only users with USER role can submit author requests.', 403);
    }

    const existingPending = await authorRequestRepository.findPendingByUserId(userId);
    if (existingPending) {
      throw new AppError('You already have a pending author request.', 409);
    }

    const request = await authorRequestRepository.create({ userId, reason });
    return request;
  }

  async getMyRequest(userId: string) {
    return authorRequestRepository.findLatestByUserId(userId);
  }

  async getAllRequests(statusFilter?: string) {
    let filter: AuthorRequestStatus | undefined;
    if (statusFilter) {
      const upperStatus = statusFilter.toUpperCase() as AuthorRequestStatus;
      if (Object.values(AuthorRequestStatus).includes(upperStatus)) {
        filter = upperStatus;
      }
    }

    return authorRequestRepository.findAll(filter);
  }

  async approveRequest(requestId: string, adminId: string) {
    const request = await authorRequestRepository.findById(requestId);
    if (!request) {
      throw new AppError('Author request not found.', 404);
    }

    if (request.status === AuthorRequestStatus.APPROVED) {
      throw new AppError('Author request is already approved.', 400);
    }

    if (request.status === AuthorRequestStatus.REJECTED) {
      throw new AppError('Cannot approve an already rejected author request.', 400);
    }

    if (request.status !== AuthorRequestStatus.PENDING) {
      throw new AppError('Only pending author requests can be processed.', 400);
    }

    const targetUserId =
      typeof request.userId === 'object' && request.userId !== null && '_id' in request.userId
        ? String((request.userId as { _id: unknown })._id)
        : String(request.userId);

    const updatedUser = await userRepository.updateRole(targetUserId, UserRole.AUTHOR);
    if (!updatedUser) {
      throw new AppError('Failed to update user role to AUTHOR.', 500);
    }

    const updatedRequest = await authorRequestRepository.updateReviewStatus(
      requestId,
      AuthorRequestStatus.APPROVED,
      adminId,
      new Date(),
    );

    return updatedRequest;
  }

  async rejectRequest(requestId: string, adminId: string) {
    const request = await authorRequestRepository.findById(requestId);
    if (!request) {
      throw new AppError('Author request not found.', 404);
    }

    if (request.status === AuthorRequestStatus.REJECTED) {
      throw new AppError('Author request is already rejected.', 400);
    }

    if (request.status === AuthorRequestStatus.APPROVED) {
      throw new AppError('Cannot reject an already approved author request.', 400);
    }

    if (request.status !== AuthorRequestStatus.PENDING) {
      throw new AppError('Only pending author requests can be processed.', 400);
    }

    const updatedRequest = await authorRequestRepository.updateReviewStatus(
      requestId,
      AuthorRequestStatus.REJECTED,
      adminId,
      new Date(),
    );

    return updatedRequest;
  }
}

export default new AuthorRequestService();
