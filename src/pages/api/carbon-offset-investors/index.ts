import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { carbonOffsetInvestorValidationSchema } from 'validationSchema/carbon-offset-investors';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getCarbonOffsetInvestors();
    case 'POST':
      return createCarbonOffsetInvestor();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCarbonOffsetInvestors() {
    const data = await prisma.carbon_offset_investor
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'carbon_offset_investor'));
    return res.status(200).json(data);
  }

  async function createCarbonOffsetInvestor() {
    await carbonOffsetInvestorValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.carbon_offset_investor.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
