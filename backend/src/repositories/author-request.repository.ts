import AuthorRequest from '../models/author-request.model';
import { IAuthorRequestDocument } from '../interfaces/author-request.interface';
import { AuthorRequestStatus } from '../types/enums';

class AuthorRequestRepository {
  async create(data: { userId: string; reason: string }): Promise<IAuthorRequestDocument> {
    return AuthorRequest.create({
      userId: data.userId,
      reason: data.reason,
      status: AuthorRequestStatus.PENDING,
    });
  }

  async findPendingByUserId(userId: string): Promise<IAuthorRequestDocument | null> {
    return AuthorRequest.findOne({
      userId,
      status: AuthorRequestStatus.PENDING,
    });
  }

  async findLatestByUserId(userId: string): Promise<IAuthorRequestDocument | null> {
    return AuthorRequest.findOne({ userId }).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IAuthorRequestDocument | null> {
    return AuthorRequest.findById(id)
      .populate('userId', 'username email avatar role')
      .populate('reviewedBy', 'username email role');
  }

  async findAll(statusFilter?: AuthorRequestStatus): Promise<IAuthorRequestDocument[]> {
    const query = statusFilter ? { status: statusFilter } : {};
    return AuthorRequest.find(query)
      .populate('userId', 'username email avatar role')
      .populate('reviewedBy', 'username email role')
      .sort({ createdAt: -1 });
  }

  async updateReviewStatus(
    id: string,
    status: AuthorRequestStatus,
    reviewedBy: string,
    reviewedAt: Date,
  ): Promise<IAuthorRequestDocument | null> {
    return AuthorRequest.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          reviewedBy,
          reviewedAt,
        },
      },
      { new: true, runValidators: true },
    )
      .populate('userId', 'username email avatar role')
      .populate('reviewedBy', 'username email role');
  }
}

export default new AuthorRequestRepository();
