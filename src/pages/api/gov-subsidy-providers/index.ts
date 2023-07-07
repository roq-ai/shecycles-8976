import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { govSubsidyProviderValidationSchema } from 'validationSchema/gov-subsidy-providers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getGovSubsidyProviders();
    case 'POST':
      return createGovSubsidyProvider();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGovSubsidyProviders() {
    const data = await prisma.gov_subsidy_provider
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'gov_subsidy_provider'));
    return res.status(200).json(data);
  }

  async function createGovSubsidyProvider() {
    await govSubsidyProviderValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.gov_subsidy_provider.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
