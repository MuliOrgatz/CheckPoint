import { Request, Response, NextFunction } from 'express';
import {
  DatabaseError,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from 'sequelize';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  if (err instanceof UniqueConstraintError || err.status == 409) {
    res.status(409).json({
      error: 'Conflict Error',
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(400).json({
      error: 'Validation Error',
      message: err.errors.map((e: any) => e.message).join(', '),
    });
  } else if (err instanceof DatabaseError) {
    if ((err as any).original) {
      res.status(400).json({
        error: 'Database Error',
        message: (err as any).original.message,
      });
    } else {
      res.status(400).json({
        error: 'Database Error',
        message: err.message,
      });
    }
  } else if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      error: 'Foreign Key Constraint Error',
      message: err.message,
    });
  } else if (err.status === 404) {
    res.status(404).json({
      error: 'Not Found',
      message: err.message,
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message,
    });
  }
};

export default errorHandler;
