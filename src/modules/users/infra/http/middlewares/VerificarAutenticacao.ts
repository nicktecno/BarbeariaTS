import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import autorizacaoConfig from '@config/autenticacao';

import AppError from '@shared/errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function VerificarAutenticacao(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const autorizarHeader = request.headers.authorization;

  if (!autorizarHeader) {
    throw new AppError('JWT token não encontrado!', 401);
  }

  const [, token] = autorizarHeader.split(' '); // separar bearer do token
  try {
    const decodificado = verify(token, autorizacaoConfig.jwt.secret);

    const { sub } = decodificado as TokenPayload; // hack para tipar um variavel

    request.user = {
      id: sub, // hack para poder acessar o id do usuario em todas as rotas subsequentes
    };

    return next();
  } catch {
    throw new AppError('JWT token inválido', 401);
  }
}
