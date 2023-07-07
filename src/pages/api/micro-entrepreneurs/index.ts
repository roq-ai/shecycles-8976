import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { microEntrepreneurValidationSchema } from 'validationSchema/micro-entrepreneurs';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMicroEntrepreneurs();
    case 'POST':
      return createMicroEntrepreneur();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMicroEntrepreneurs() {
    const data = await prisma.micro_entrepreneur
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'micro_entrepreneur'));
    return res.status(200).json(data);
  }

  async function createMicroEntrepreneur() {
    await microEntrepreneurValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.micro_entrepreneur.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
